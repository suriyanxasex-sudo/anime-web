import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';
import axios from 'axios';

// ฟังก์ชันหน่วงเวลา (สำคัญมาก! ช่วยให้ Vercel ไม่ตัดการเชื่อมต่อ)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  // 1. เช็ครหัสผ่านบอท
  if (req.query.key !== 'joshua7465') {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  
  await dbConnect();

  try {
    // 2. ดึงรายชื่ออนิเมะมาใหม่ (Top Airing)
    const { data } = await axios.get('https://api.consumet.org/anime/gogoanime/top-airing');
    
    if (!data.results || data.results.length === 0) {
       return res.status(500).json({ error: 'API ต้นทางไม่ส่งข้อมูล (ลองกดใหม่อีกครั้ง)' });
    }

    // --- จุดปรับจูน: เอามาแค่ 3 เรื่องพอ เพื่อให้รันจบไว ไม่ Error ---
    const newItems = data.results.slice(0, 3); 
    let addedCount = 0;
    let skippedCount = 0;

    // 3. เริ่มวนลูป "ทีละเรื่อง" (Sequential Loop)
    for (const item of newItems) {
      
      // เช็คว่ามีใน Database หรือยัง
      const exists = await Anime.findOne({ title: item.title });
      
      if (!exists) {
        // พักหายใจ 1 วินาที ก่อนเริ่มงานใหม่
        await sleep(1000); 

        try {
          console.log(`กำลังตรวจสอบ: ${item.title}...`);
          
          // ดึงรายละเอียด + ลิงก์ดูหนัง
          const detailRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${item.id}`);
          const details = detailRes.data;

          // --- 🛡️ ระบบคัดกรอง (Quality Control) ---
          // ถ้าไม่มีตอน (Episodes) หรือเป็นเรื่องเปล่าๆ ให้ข้ามเลย
          if (!details.episodes || details.episodes.length === 0) {
             console.log(`❌ ข้าม ${item.title} (ไม่มีไฟล์วิดีโอ)`);
             skippedCount++;
             continue; 
          }

          // แปลงข้อมูลเตรียมบันทึก
          const episodes = details.episodes.map(ep => ({
            number: ep.number,
            title: `ตอนที่ ${ep.number}`,
            servers: [
              {
                name: "Server หลัก",
                // แปลงลิงก์ให้เป็น Embed Video
                url: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(item.title + ' ep ' + ep.number)}`,
                quality: "720p",
                isPremium: false
              }
            ]
          }));

          // บันทึกลง Database
          await Anime.create({
            title: details.title,
            imageUrl: details.image,
            synopsis: details.description || 'ไม่มีเรื่องย่อ',
            category: details.genres?.[0] || 'Anime',
            episodes: episodes
          });
          
          addedCount++;
          console.log(`✅ บันทึกสำเร็จ: ${item.title}`);

        } catch (err) {
          console.error(`⚠️ เกิดข้อผิดพลาดกับเรื่อง ${item.title}: ${err.message}`);
          continue; // ถ้าเรื่องนี้พัง ให้ข้ามไปเรื่องถัดไปทันที (ไม่หยุดบอท)
        }
      }
    }
    
    res.json({ 
        success: true, 
        message: `เพิ่มสำเร็จ ${addedCount} เรื่อง (ข้าม ${skippedCount} เรื่องที่ดูไม่ได้)` 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}