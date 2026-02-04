import dbConnect from '../../../lib/mongodb';
import Manga from '../../../models/Manga';
import User from '../../../models/User';

/**
 * JPLUS_DOOMSDAY_PROTOCOL v3.0
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: ล้างบางข้อมูลทั้งหมดใน Database (Warning: กู้คืนไม่ได้!)
 */

export default async function handler(req, res) {
  // 1. [METHOD_GUARD] - ต้องเป็น POST เท่านั้น
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });
  }

  // 2. [SECURITY_CHECK] - เช็ค Key ลับ (ต้องตรงกับที่ส่งมาจาก Dashboard)
  const { key, target = 'manga' } = req.body;
  
  if (key !== 'joshua7465') {
    return res.status(403).json({ 
      success: false, 
      message: "ACCESS_DENIED: รหัสทำลายตัวเองไม่ถูกต้อง!" 
    });
  }

  try {
    await dbConnect();

    let message = "";
    let deletedCount = 0;

    // 3. [EXECUTE_PURGE] - เลือกว่าจะลบอะไร
    if (target === 'manga' || target === 'all') {
      const resManga = await Manga.deleteMany({});
      deletedCount += resManga.deletedCount;
      message += `Deleted ${resManga.deletedCount} Mangas. `;
    }

    if (target === 'users' || target === 'all') {
      // ⚠️ ระวัง: ลบ User ทั้งหมด รวมถึง Admin ด้วย (ต้องไปรัน Seeder ใหม่ถึงจะเข้าได้)
      const resUser = await User.deleteMany({});
      deletedCount += resUser.deletedCount;
      message += `Deleted ${resUser.deletedCount} Users. `;
    }

    console.log(`[DOOMSDAY_LOG] 💥 System Purge Initiated by Admin. Result: ${message}`);

    return res.status(200).json({
      success: true,
      message: "SYSTEM_PURGED_SUCCESSFULLY",
      details: message,
      count: deletedCount
    });

  } catch (error) {
    console.error("Nuke Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}