import connectDB from '../../../lib/mongodb';
import mongoose from 'mongoose';
import Manga from '../../../models/Manga';

/**
 * JPLUS_MANGA_FEED v3.5 (ULTRA SPEED)
 * พัฒนาโดย: JOSHUA_MAYOE
 * แก้ไข: บังคับดึงข้อมูลจากคอลเลกชัน 'mangas' ที่มีข้อมูลอยู่จริง
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: "Method Not Allowed" });

  try {
    await connectDB();

    // 1. [QUERY_PARSER]
    const { search, limit = 50 } = req.query;
    
    // 2. [DIRECT_COLLECTION_ACCESS] 
    // 💡 แก้จุดตาย: บังคับเข้าถึงคอลเลกชัน 'mangas' โดยตรง ไม่ผ่าน Model ที่อาจจะชื่อไม่ตรงกัน
    const mangaCollection = mongoose.connection.db.collection('mangas');

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // 3. [FETCH_DATA] 
    // ดึงข้อมูลมังงะจากถังที่ลูกพี่รันบอทไว้ (22 เรื่องนั้นจะโผล่ที่นี่!)
    const mangas = await mangaCollection
      .find(query)
      .project({ 'chapters.content': 0 }) // ⚡️ ไม่เอาเนื้อหาภาพตอน (ลดขนาดไฟล์)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .toArray();

    // 4. [RESPONSE]
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
    return res.status(200).json({
      success: true,
      count: mangas.length,
      data: mangas // ส่งข้อมูล 22 เรื่องไปโชว์หน้าบ้าน!
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