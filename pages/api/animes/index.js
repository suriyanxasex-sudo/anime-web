import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';

export default async function handler(req, res) {
  await dbConnect();
  
  if (req.method === 'GET') {
    try {
      const { search, category } = req.query;
      let query = {};
      
      // ระบบค้นหาชื่อเรื่อง
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
      
      // ระบบกรองตามหมวดหมู่ (เผื่อหน้าแรกมีการกดเลือกหมวด)
      if (category && category !== 'All') {
        query.category = category;
      }

      // ดึงข้อมูลมังงะล่าสุด 30 เรื่อง (เพิ่มจาก 20 เป็น 30 ให้ดูจุใจ)
      const animes = await Anime.find(query)
        .sort({ createdAt: -1 }) 
        .limit(30);

      res.status(200).json(animes);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    // ส่วนนี้สำหรับ Admin Joshua เผื่ออยากเพิ่มมังงะเองด้วยมือ
    try {
      const anime = await Anime.create(req.body);
      res.status(201).json(anime);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}