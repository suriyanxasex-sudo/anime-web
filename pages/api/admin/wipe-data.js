import dbConnect from '../../../lib/mongodb';
import Manga from '../../../models/Manga'; // อัปเกรดเป็น Manga Model หลัก

/**
 * JPLUS_CORE_PURGE_PROTOCOL v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ล้างข้อมูลมังงะทั้งหมดในระบบ (Emergency Wipe) 
 * คำเตือน: ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้ (Permanent Destruction)
 */

export default async function handler(req, res) {
  const startTime = Date.now();

  // 1. ระบบรักษาความปลอดภัยขั้นสูงสุด (Strict POST Verification)
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: `PURGE_DENIED: Method ${req.method} is not authorized for core destruction.` 
    });
  }

  // 2. รับรหัสลับจาก Admin Joshua
  const { key, confirmSecret } = req.body;

  // ตรวจสอบรหัสระดับที่ 1
  if (key !== 'joshua7465') {
    console.error(`[SECURITY_ALERT] Unauthorized attempt to wipe database detected.`);
    return res.status(403).json({ 
      success: false, 
      message: 'ACCESS_DENIED: รหัสลับ Joshua ไม่ถูกต้อง' 
    });
  }

  // 3. ระบบ Double-Check (บังคับให้พิมพ์คำยืนยันเพื่อป้องกันการกดพลาด)
  if (confirmSecret !== 'DELETE_ALL_MANGA') {
    return res.status(400).json({
      success: false,
      message: 'CONFIRMATION_REQUIRED: กรุณากรอก confirmSecret ว่า "DELETE_ALL_MANGA"'
    });
  }

  await dbConnect(); // เชื่อมต่อฐานข้อมูล MongoDB Atlas

  try {
    console.log('--- ⚠️ JPLUS_SYSTEM: INITIATING_FULL_DATABASE_PURGE ---');

    // 4. ขั้นตอนการทำลายข้อมูล (Execution Phase)
    // เช็คจำนวนก่อนลบเพื่อให้รู้ว่าเราล้างไปเท่าไหร่
    const countBefore = await Manga.countDocuments({});
    
    // สั่งล้างข้อมูลทั้งหมดในคอลเลกชันมังงะ
    const deleteResult = await Manga.deleteMany({});

    const executionTime = Date.now() - startTime;
    console.warn(`[TERMINATION_COMPLETE] ${countBefore} entities removed from archive in ${executionTime}ms.`);

    // 5. ส่งรายงานสรุปการล้างข้อมูล
    return res.status(200).json({ 
      success: true, 
      status: 'DATABASE_CLEANED',
      message: `ล้างคลังมังงะเรียบร้อยแล้ว (${countBefore} รายการถูกกำจัด)`,
      metadata: {
        operator: 'ADMIN_JOSHUA',
        execution_time: `${executionTime}ms`,
        deleted_count: deleteResult.deletedCount,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error(`[CRITICAL_PURGE_FAILURE] ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: 'CORE_DESTRUCTION_FAILED: ' + error.message 
    });
  }
}