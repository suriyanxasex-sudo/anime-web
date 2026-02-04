import dbConnect from '../../../lib/mongodb';
import Manga from '../../../models/Manga';
import User from '../../../models/User';

/**
 * JPLUS_MANGA_CORE_API v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: API กลางสำหรับดึงข้อมูลมังงะ (ปรับแต่งประสิทธิภาพสูงสุด)
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  await dbConnect();

  // --- [GET] SEARCH & FEED PROTOCOL ---
  if (req.method === 'GET') {
    try {
      const { search, category, limit = 30, page = 1, sort = 'latest' } = req.query;
      let query = {};
      
      // 1. Advanced Search (ค้นหา)
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { synopsis: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } } // เพิ่มค้นหาชื่อผู้แต่ง
        ];
      }
      
      // 2. Category Filter (กรอง)
      if (category && category !== 'All') {
        query.genres = category;
      }

      // 3. Sorting Logic (เรียงลำดับ)
      let sortQuery = { updatedAt: -1 }; // Default: อัปเดตล่าสุด
      if (sort === 'popular') sortQuery = { score: -1 };
      if (sort === 'newest') sortQuery = { createdAt: -1 };
      if (sort === 'az') sortQuery = { title: 1 };

      // 4. Optimized Execution (ดึงข้อมูลแบบเบาหวิว)
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const mangas = await Manga.find(query)
        .select('-chapters.content') // ⚡️ HERO FEATURE: ไม่ดึงลิงก์รูปภาพมา (ลด Payload 99%)
        .sort(sortQuery)
        .limit(parseInt(limit))
        .skip(skip);

      const totalItems = await Manga.countDocuments(query);
      const executionTime = Date.now() - startTime;

      // Disable Cache (เพื่อให้ได้ข้อมูลสดใหม่เสมอ)
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

      return res.status(200).json({
        success: true,
        meta: {
          execution_time: `${executionTime}ms`,
          total_results: totalItems,
          total_pages: Math.ceil(totalItems / limit),
          current_page: parseInt(page),
        },
        data: mangas
      });

    } catch (error) {
      console.error(`[FEED_ERROR] ${error.message}`);
      return res.status(500).json({ success: false, message: 'SERVER_ERROR', error: error.message });
    }
  } 
  
  // --- [POST] SECURE CREATE PROTOCOL ---
  else if (req.method === 'POST') {
    try {
      // 🔐 รับ userId แทน adminKey
      const { userId, title, imageUrl, isPremium, genres, synopsis } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'MISSING_IDENTITY' });
      }

      // ตรวจสอบสิทธิ์จาก Database จริง
      const adminUser = await User.findById(userId);
      if (!adminUser || !adminUser.isAdmin) {
        return res.status(403).json({ success: false, message: 'ACCESS_DENIED: Only Overlord Joshua allowed.' });
      }

      // สร้างข้อมูล
      const newManga = await Manga.create({
        title,
        imageUrl,
        isPremium: isPremium || false,
        genres: genres || [],
        synopsis: synopsis || "No synopsis provided.",
        chapters: [],
        updatedAt: new Date()
      });

      console.log(`[MANGA_FORGED] Created: ${newManga.title} by ${adminUser.username}`);
      
      return res.status(201).json({
        success: true,
        message: 'MANGA_CREATED',
        data: newManga
      });

    } catch (error) {
      console.error(`[CREATE_ERROR] ${error.message}`);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });
}