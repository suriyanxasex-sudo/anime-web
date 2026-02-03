import axios from 'axios';
import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';

export default async function handler(req, res) {
  // 🔐 ระบบรักษาความปลอดภัย: เฉพาะ Admin Joshua ที่มี Key เท่านั้นถึงจะรันบอทได้
  const { key } = req.query;
  if (key !== 'joshua7465') {
    return res.status(403).json({ success: false, message: 'UNAUTHORIZED_ACCESS_DENIED' });
  }

  await dbConnect();

  try {
    console.log('--- 🤖 JPLUS_BOT: STARTING_SCAN ---');
    
    // ดึงข้อมูลมังงะยอดนิยมจาก MangaDex (แหล่งที่ใหญ่และอ่านฟรี)
    const response = await axios.get('https://api.mangadex.org/manga', {
      params: { 
        limit: 30, // ดึงรวดเดียว 30 เรื่อง
        'includes[]': ['cover_art'],
        'contentRating[]': ['safe', 'suggestive'],
        order: { followedCount: 'desc' } // เอาเรื่องที่มีคนติดตามเยอะที่สุด
      }
    });

    const mangaList = response.data.data;
    const updateTasks = mangaList.map(async (item) => {
      // ค้นหาไฟล์หน้าปก
      const coverRel = item.relationships.find(r => r.type === 'cover_art');
      const fileName = coverRel?.attributes?.fileName;
      const title = item.attributes.title.en || item.attributes.title.ja || Object.values(item.attributes.title)[0];
      
      return await Anime.findOneAndUpdate(
        { mangaId: item.id },
        {
          title: title,
          image: fileName ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}` : 'https://via.placeholder.com/300x400',
          description: item.attributes.description.en || "No English description available.",
          rating: (Math.random() * (9.8 - 8.0) + 8.0).toFixed(1), // สุ่มคะแนนให้ดูเท่ๆ
          type: item.attributes.publicationDemographic || 'General'
        },
        { upsert: true, new: true }
      );
    });

    await Promise.all(updateTasks);

    res.status(200).json({ 
      success: true, 
      status: 'SYSTEM_SYNC_COMPLETE',
      count: mangaList.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}