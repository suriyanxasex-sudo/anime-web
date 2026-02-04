import connectDB from '../../../lib/mongodb';
import Manga from '../../../models/Manga';

/**
 * JPLUS_GET_ALL_MANGA_API
 * ดึงข้อมูลสดใหม่จาก MongoDB Atlas โดยไม่ผ่าน Cache
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: "Method Not Allowed" });

  try {
    await connectDB();
    
    // ดึงข้อมูลทั้งหมด เรียงตามวันที่อัปเดตล่าสุด
    const mangas = await Manga.find({}).sort({ updatedAt: -1 });

    // ปิด Cache 100% เพื่อความชัวร์ของลูกพี่ Joshua
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).json(mangas);
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Database connection failed", 
      error: error.message 
    });
  }
}