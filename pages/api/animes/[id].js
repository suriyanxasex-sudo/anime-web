import dbConnect from '../../../lib/mongodb';
import Manga from '../../../models/Manga'; // อัปเกรดจาก Anime เป็น Manga ตาม Schema หลัก

/**
 * JPLUS_ENTITY_CONTROLLER v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: จัดการข้อมูลมังงะรายเรื่อง ทั้งการดึงข้อมูลเชิงลึก, เพิ่มยอดวิว และการทำลายข้อมูล (Delete)
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  const { query: { id }, method } = req;

  // ตรวจสอบความถูกต้องของ ID เบื้องต้น
  if (!id || id.length < 24) {
    return res.status(400).json({ success: false, message: 'INVALID_ENTITY_ID_FORMAT' });
  }

  await dbConnect(); // เชื่อมต่อฐานข้อมูล MongoDB Atlas

  // --- [GET] FETCH_DETAILED_ENTITY_PROTOCOL ---
  if (method === 'GET') {
    try {
      console.log(`[ENTITY_SYNC] Fetching deep data for ID: ${id}`);

      // 1. ดึงข้อมูลมังงะพร้อมรายละเอียดตอน (Chapters) ทั้งหมด
      const manga = await Manga.findById(id);
      
      if (!manga) {
        return res.status(404).json({ 
          success: false, 
          message: 'NOT_FOUND: ไม่พบข้อมูลมังงะในพิกัดที่ระบุ' 
        });
      }

      // 2. ระบบนับยอดอ่าน (Smart View Increment)
      // ใช้ $inc เพื่อเพิ่มค่าแบบ Atomic ป้องกันข้อมูลทับซ้อนกรณีคนเข้าพร้อมกันเยอะๆ
      await Manga.findByIdAndUpdate(id, { 
        $inc: { views: 1 },
        $set: { "metadata.lastAccessed": new Date() }
      });

      const executionTime = Date.now() - startTime;
      console.log(`[SUCCESS] Data transmitted for: ${manga.title} (${executionTime}ms)`);

      // 3. ส่งข้อมูลออกไปแบบครบถ้วน (Full Payload)
      return res.status(200).json({
        success: true,
        execution_time: `${executionTime}ms`,
        data: manga
      });

    } catch (error) {
      console.error(`[CRITICAL_GET_ERR] ${error.message}`);
      return res.status(500).json({ 
        success: false, 
        message: 'DATABASE_FETCH_FAILURE', 
        error: error.message 
      });
    }
  } 
  
  // --- [DELETE] ADMIN_TERMINATION_PROTOCOL ---
  else if (method === 'DELETE') {
    try {
      // 🔐 ระบบตรวจสอบสิทธิ์ Admin: ป้องกันการลบมั่วซั่ว
      // ในทางปฏิบัติควรเช็คจาก Session แต่ที่นี่เราใส่ตัวดักพื้นฐานไว้ให้ลูกพี่ก่อน
      const { adminKey } = req.body; // รับ Key จาก Request Body
      
      if (adminKey !== 'joshua7465') {
        return res.status(403).json({ 
          success: false, 
          message: 'TERMINATION_DENIED: เฉพาะ Admin Joshua เท่านั้นที่ลบข้อมูลได้' 
        });
      }

      const deletedManga = await Manga.findByIdAndDelete(id);
      
      if (!deletedManga) {
        return res.status(404).json({ success: false, message: 'ENTITY_NOT_FOUND' });
      }

      console.log(`[ADMIN_ACTION] Joshua has terminated entity: ${id}`);
      
      return res.status(200).json({ 
        success: true, 
        message: 'ENTITY_PERMANENTLY_REMOVED_FROM_ARCHIVE' 
      });

    } catch (error) {
      return res.status(500).json({ success: false, message: 'TERMINATION_FAILED', error: error.message });
    }
  }

  // ป้องกัน Method อื่นๆ
  return res.status(405).json({ message: `METHOD_${method}_NOT_ALLOWED` });
}