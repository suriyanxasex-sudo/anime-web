import axios from 'axios';
import dbConnect from '../../../lib/mongodb';
import Manga from '../../../models/Manga'; // เปลี่ยนจาก Anime เป็น Manga ตาม Schema ใหม่ของเรา

/**
 * JPLUS_AUTO_SYNC_BOT v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ขุดข้อมูลมังงะแบบ Multi-Source และจัดระเบียบลงฐานข้อมูลโดยอัตโนมัติ
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  
  // 🔐 ระบบรักษาความปลอดภัย: เฉพาะ Admin Joshua ที่มี Key เท่านั้น
  const { key } = req.query;
  if (key !== 'joshua7465') {
    return res.status(403).json({ 
      success: false, 
      message: 'UNAUTHORIZED_ACCESS: บอทตัวนี้รับคำสั่งจาก Joshua เท่านั้น' 
    });
  }

  await dbConnect();

  try {
    console.log('--- 🤖 JPLUS_BOT: INITIALIZING_DEEP_SCAN ---');
    
    // 1. เชื่อมต่อแหล่งข้อมูลหลัก (MangaDex Global API)
    const response = await axios.get('https://api.mangadex.org/manga', {
      params: { 
        limit: 50, // อัปเกรดดึงรวดเดียว 50 เรื่องให้สมกับเป็นบอทมหาเทพ
        'includes[]': ['cover_art', 'author', 'artist'],
        'contentRating[]': ['safe', 'suggestive'],
        'availableTranslatedLanguage[]': ['en', 'th'], // เน้นที่มีภาษาไทยหรืออังกฤษ
        order: { followedCount: 'desc' }
      }
    });

    const mangaList = response.data.data;
    console.log(`[SCAN_FOUND] Detected ${mangaList.length} high-potential titles.`);

    // 2. ระบบจัดการงานแบบขนาน (Parallel Task Execution)
    const updateTasks = mangaList.map(async (item) => {
      // ค้นหา Metadata: หน้าปก, ผู้เขียน
      const coverRel = item.relationships.find(r => r.type === 'cover_art');
      const authorRel = item.relationships.find(r => r.type === 'author');
      const fileName = coverRel?.attributes?.fileName;
      
      // การจัดการชื่อเรื่องแบบ Multi-Language
      const title = item.attributes.title.en || 
                    item.attributes.title.ja || 
                    item.attributes.title['ja-ro'] || 
                    Object.values(item.attributes.title)[0];

      // 3. ระบบ Deep Extraction (ขุดข้อมูลรายละเอียดยิบ)
      const mangaPayload = {
        title: title,
        imageUrl: fileName ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}.256.jpg` : 'https://via.placeholder.com/300x450',
        synopsis: item.attributes.description.en || item.attributes.description.th || "No detailed synopsis found.",
        score: (Math.random() * (9.9 - 8.5) + 8.5).toFixed(1), // สุ่มคะแนนระดับพรีเมียม
        status: item.attributes.status?.toUpperCase() || 'ONGOING',
        author: authorRel?.attributes?.name || 'Unknown_Creator',
        genres: item.attributes.tags.map(tag => tag.attributes.name.en).slice(0, 5),
        // ระบบจำลอง Chapters เบื้องต้นเพื่อให้หน้าแรกไม่หมุนค้าง
        chapters: [
          { chapterNum: 1, chapterTitle: 'Prologue: The Beginning', provider: 'SYSTEM_GEN' }
        ],
        metadata: {
          lastSync: new Date(),
          sourceId: item.id,
          provider: 'MANGADEX_CORE'
        }
      };

      // 4. บันทึกลง MongoDB (Upsert Logic: ถ้ามีแล้วให้อัปเดต ถ้าไม่มีให้สร้างใหม่)
      return await Manga.findOneAndUpdate(
        { title: title }, // ใช้ Title เป็นจุดเช็คเพื่อป้องกันข้อมูลซ้ำแบบ 100%
        mangaPayload,
        { upsert: true, new: true, runValidators: true }
      );
    });

    // รันงานทั้งหมดพร้อมกันเพื่อความเร็วสูงสุด
    const results = await Promise.all(updateTasks);
    
    const executionTime = Date.now() - startTime;
    console.log(`--- ✅ JPLUS_BOT: SYNC_COMPLETE (${executionTime}ms) ---`);

    res.status(200).json({ 
      success: true, 
      status: 'CORE_DATABASE_SYNCHRONIZED',
      total_scanned: mangaList.length,
      execution_time: `${executionTime}ms`,
      bot_version: '2.5_OVERLORD',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[BOT_CRASH] Critical failure: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error_code: 'SCRAPER_FAILURE',
      message: error.message 
    });
  }
}