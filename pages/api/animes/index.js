import dbConnect from '../../../lib/mongodb';
import Manga from '../../../models/Manga'; // เปลี่ยนจาก Anime เป็น Manga ตาม Schema ใหม่ที่อัปเกรดไป

/**
 * JPLUS_MANGA_CORE_API v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ระบบจัดการข้อมูลมังงะส่วนกลาง รองรับการค้นหา กรองข้อมูล และการเพิ่มข้อมูลระดับสูง
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  await dbConnect(); // เชื่อมต่อฐานข้อมูล MongoDB Atlas

  // --- [GET] SEARCH & FILTER PROTOCOL ---
  if (req.method === 'GET') {
    try {
      const { search, category, limit = 30, page = 1, sort = 'latest' } = req.query;
      let query = {};
      
      // 1. Advanced Search Logic: ค้นหาจากชื่อเรื่อง (Regex Case-Insensitive)
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { synopsis: { $regex: search, $options: 'i' } } // ค้นหาจากเรื่องย่อด้วยเพื่อให้เจอผลลัพธ์ที่กว้างขึ้น
        ];
      }
      
      // 2. Category Filtering: กรองตามหมวดหมู่
      if (category && category !== 'All') {
        query.genres = category; // ใช้ genres ตามโมเดลใหม่ที่เราแก้
      }

      // 3. Sorting Logic: ระบบเรียงลำดับ
      let sortQuery = { createdAt: -1 };
      if (sort === 'popular') sortQuery = { score: -1 };
      if (sort === 'oldest') sortQuery = { createdAt: 1 };

      console.log(`[QUERY] Executing search for: "${search || 'ALL'}" in category: "${category || 'ALL'}"`);

      // 4. Execution with Pagination: ดึงข้อมูลแบบแบ่งหน้าเพื่อ Performance ที่ดีที่สุด
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const mangas = await Manga.find(query)
        .sort(sortQuery)
        .limit(parseInt(limit))
        .skip(skip);

      const totalItems = await Manga.countDocuments(query);
      const executionTime = Date.now() - startTime;

      return res.status(200).json({
        success: true,
        execution_time: `${executionTime}ms`,
        total_results: totalItems,
        total_pages: Math.ceil(totalItems / limit),
        current_page: parseInt(page),
        data: mangas
      });

    } catch (error) {
      console.error(`[GET_ERR] ${error.message}`);
      return res.status(500).json({ success: false, message: 'DATABASE_QUERY_FAILURE', error: error.message });
    }
  } 
  
  // --- [POST] ADMIN_UPLOAD_PROTOCOL ---
  else if (req.method === 'POST') {
    try {
      // 🔐 ระบบตรวจสอบสิทธิ์เบื้องต้น: เฉพาะ Admin Joshua เท่านั้นที่ได้รับอนุญาต
      const { adminKey } = req.body;
      if (adminKey !== 'joshua7465') {
        return res.status(403).json({ 
          success: false, 
          message: 'ACCESS_DENIED: โปรโตคอลนี้อนุญาตเฉพาะ Admin Joshua (7465) เท่านั้น' 
        });
      }

      // สร้างข้อมูลมังงะใหม่ (Manual Entry)
      const newManga = await Manga.create({
        ...req.body,
        lastUpdated: new Date()
      });

      console.log(`[ADMIN_ACTION] Joshua manually created: ${newManga.title}`);
      
      return res.status(201).json({
        success: true,
        message: 'MANUAL_ENTRY_SUCCESSFUL',
        data: newManga
      });

    } catch (error) {
      console.error(`[POST_ERR] ${error.message}`);
      return res.status(400).json({ success: false, message: 'WRITE_FAILURE', error: error.message });
    }
  }

  // ป้องกัน Method ที่ไม่ได้รับอนุญาต
  return res.status(405).json({ message: `METHOD_${req.method}_NOT_ALLOWED` });
}