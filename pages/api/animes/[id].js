import dbConnect from '../../../lib/mongodb';
import Manga from '../../../models/Manga';
import User from '../../../models/User';

/**
 * JPLUS_ENTITY_CONTROLLER v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: จัดการข้อมูลมังงะรายตัว (ดึงข้อมูลแบบเบาหวิว & ลบแบบปลอดภัย)
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  const { query: { id }, method } = req;

  // Check ID Format
  if (!id || id.length < 24) {
    return res.status(400).json({ success: false, message: 'INVALID_ID_FORMAT' });
  }

  await dbConnect();

  // --- [GET] FETCH INFO PROTOCOL ---
  if (method === 'GET') {
    try {
      // 1. [OPTIMIZED_FETCH] - ดึงข้อมูลมังงะ แต่ *ไม่เอา* รูปภาพในตอน
      // (-chapters.content คือหัวใจสำคัญที่ทำให้โหลดไว!)
      const manga = await Manga.findById(id)
                               .select('-chapters.content'); 
      
      if (!manga) {
        return res.status(404).json({ success: false, message: 'MANGA_NOT_FOUND' });
      }

      // 2. [VIEW_COUNTER] - เพิ่มยอดวิวแบบเงียบๆ (Background)
      // (ใช้ catch เพื่อกันไม่ให้ API ล่มถ้านับวิวพลาด)
      Manga.findByIdAndUpdate(id, { $inc: { views: 1 } }).catch(e => console.error("View Count Error:", e));

      const executionTime = Date.now() - startTime;

      return res.status(200).json({
        success: true,
        execution_time: `${executionTime}ms`,
        data: manga
      });

    } catch (error) {
      console.error(`[GET_ERROR] ${error.message}`);
      return res.status(500).json({ success: false, error: error.message });
    }
  } 
  
  // --- [DELETE] SECURE TERMINATION PROTOCOL ---
  else if (method === 'DELETE') {
    try {
      // 🔐 รับ userId มาเช็คสิทธิ์ (ปลอดภัยกว่า adminKey)
      // หมายเหตุ: ในการ Delete บางครั้ง Client อาจส่ง Body ไม่ได้ 
      // แต่ในระบบ Admin Dashboard ของเรา เราใช้ Axios.delete(url, { data: { userId } }) ได้ครับ
      const { userId } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'MISSING_IDENTITY' });
      }

      // ตรวจสอบว่าเป็น Admin ตัวจริงไหม
      const adminUser = await User.findById(userId);
      if (!adminUser || !adminUser.isAdmin) {
        return res.status(403).json({ success: false, message: 'ACCESS_DENIED: Only Overlord can delete.' });
      }

      // ลบจริง
      const deletedManga = await Manga.findByIdAndDelete(id);

      if (!deletedManga) {
        return res.status(404).json({ success: false, message: 'TARGET_NOT_FOUND' });
      }

      console.log(`[TERMINATED] Manga ID ${id} deleted by ${adminUser.username}`);

      return res.status(200).json({ 
        success: true, 
        message: 'MANGA_DELETED_PERMANENTLY' 
      });

    } catch (error) {
      console.error(`[DELETE_ERROR] ${error.message}`);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });
}