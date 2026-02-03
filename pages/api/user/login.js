import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_AUTHENTICATION_GATEWAY v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ตรวจสอบสิทธิ์การเข้าถึงอาณาจักร Jplus Manga+
 */

export default async function handler(req, res) {
  const startTime = Date.now();

  // 1. ตรวจสอบ HTTP Method (รับเฉพาะ POST เท่านั้นเพื่อความปลอดภัยของข้อมูล)
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: `METHOD_${req.method}_NOT_ALLOWED: กรุณาส่งข้อมูลผ่านโปรโตคอล POST` 
    });
  }

  await dbConnect(); // เชื่อมต่อฐานข้อมูลหลัก

  const { username, password } = req.body;

  // ตรวจสอบเบื้องต้นว่ามีการส่งค่ามาครบไหม
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'IDENTITY_ERROR: กรุณาระบุชื่อผู้ใช้และรหัสผ่าน' 
    });
  }

  const cleanUsername = username.trim().toLowerCase();

  try {
    // 👑 [CRITICAL_BYPASS] JOSHUA_EXCLUSIVE_BACKDOOR
    // ระบบช่องทางพิเศษสำหรับลูกพี่ Joshua เท่านั้น
    if (cleanUsername === 'joshua' && password === '7465') {
      console.log(`[CORE_AUTH] Admin Joshua has entered the system via Overlord Access Key.`);
      return res.status(200).json({
        success: true,
        message: 'OVERLORD_ACCESS_GRANTED',
        user: { 
          username: 'joshua', 
          role: 'admin', 
          isPremium: true,
          accessLevel: 'ROOT' 
        }
      });
    }

    // 🔍 [DATABASE_SCAN] ระบบค้นหา User ปกติในฐานข้อมูล
    // ดึงข้อมูล User ขึ้นมาเพื่อทำการเปรียบเทียบรหัสผ่านที่ถูกเข้ารหัสไว้
    const user = await User.findOne({ username: cleanUsername });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'AUTHENTICATION_FAILED: ไม่พบอัตลักษณ์นี้ในระบบ' 
      });
    }

    // 🔐 [SECURITY_CHECK] ตรวจสอบรหัสผ่านด้วยการถอดรหัส (Bcrypt Compare)
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // อัปเดต Metadata เวลาเข้าใช้งานล่าสุด
      user.lastLogin = new Date();
      await user.save();

      const executionTime = Date.now() - startTime;
      console.log(`[AUTH_SUCCESS] User ${cleanUsername} logged in. Latency: ${executionTime}ms`);

      return res.status(200).json({
        success: true,
        message: 'ACCESS_AUTHORIZED',
        execution_time: `${executionTime}ms`,
        user: {
          _id: user._id,
          username: user.username,
          role: user.isAdmin ? 'admin' : 'user',
          isPremium: user.isPremium,
          profilePic: user.profilePic
        }
      });
    }

    // กรณีรหัสผ่านไม่ถูกต้อง
    return res.status(401).json({ 
      success: false, 
      message: 'ACCESS_DENIED: รหัสผ่านไม่ถูกต้องตามฐานข้อมูล' 
    });

  } catch (error) {
    console.error(`[AUTH_FATAL_ERROR] ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: 'CORE_SERVER_ERROR: ' + error.message 
    });
  }
}