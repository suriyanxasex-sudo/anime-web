import connectDB from '../../../lib/mongodb';
import Manga from '../../../models/Manga';

/**
 * JPLUS_MANGA_FEED v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: ดึงข้อมูลมังงะหน้าแรกด้วยความเร็วแสง (ตัดข้อมูลหนักๆ ทิ้ง)
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: "Method Not Allowed" });

  try {
    await connectDB();

    // 1. [QUERY_PARSER] - รับค่าค้นหาจากหน้าบ้าน
    const { search, limit = 50 } = req.query;
    
    // สร้างเงื่อนไขการค้นหา
    const query = {};
    if (search) {
      // ค้นหาชื่อเรื่อง แบบไม่สนตัวพิมพ์เล็ก/ใหญ่ (Case Insensitive)
      query.title = { $regex: search, $options: 'i' };
    }

    // 2. [OPTIMIZED_FETCH] - ดึงข้อมูลแบบมืออาชีพ
    const mangas = await Manga.find(query)
      .select('-chapters.content') // ⚡️ สำคัญมาก: ไม่ดึงลิงก์รูปภาพมา (ลดขนาดไฟล์ JSON จาก 10MB เหลือ 50KB)
      .sort({ updatedAt: -1 })     // เรียงจากใหม่ไปเก่า
      .limit(parseInt(limit));     // จำกัดจำนวน (กันแอปล่ม)

    // 3. [RESPONSE_METADATA] - ส่งข้อมูลกลับพร้อมจำนวนที่เจอ
    // (Disable Cache ตามคำขอ เพื่อความสดใหม่)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
    return res.status(200).json({
      success: true,
      count: mangas.length,
      data: mangas
    });

  } catch (error) {
    console.error("Feed Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Database connection failed", 
      error: error.message 
    });
  }
}