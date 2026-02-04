import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_LOGIN_CORE v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: ระบบล็อกอินที่ปลอดภัยที่สุด (No Hardcoded Backdoor)
 */

export default async function handler(req, res) {
  const startTime = Date.now();

  // 1. [METHOD_GUARD]
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'METHOD_NOT_ALLOWED' });
  }

  await dbConnect();

  const { username, password } = req.body;

  // 2. [INPUT_VALIDATION]
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'MISSING_CREDENTIALS' });
  }

  const cleanUsername = username.trim().toLowerCase();

  try {
    // 3. [DATABASE_SEARCH] - ค้นหา User จริงๆ จาก DB
    // (Joshua ตัวจริงอยู่ใน DB แล้วจากการรัน Admin Seeder)
    const user = await User.findOne({ username: cleanUsername });

    // ไม่เจอ User
    if (!user) {
      return res.status(401).json({ success: false, message: 'USER_NOT_FOUND' });
    }

    // 4. [SECURITY_VERIFICATION] - เช็ค Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'INVALID_PASSWORD' });
    }

    // 5. [SESSION_UPDATE] - อัปเดตเวลาเข้าใช้งาน
    user.lastLogin = new Date();
    await user.save();

    const executionTime = Date.now() - startTime;
    console.log(`[AUTH_SUCCESS] ${cleanUsername} logged in. (${executionTime}ms)`);

    // 6. [RESPONSE_PAYLOAD] - ส่งข้อมูลกลับไปให้หน้าบ้าน (รวม Points และ Email)
    return res.status(200).json({
      success: true,
      message: 'ACCESS_GRANTED',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,          // ✅ ส่ง Email กลับไปด้วย
        points: user.points,        // ✅ ส่งแต้มคงเหลือ (เอาไว้โชว์)
        isAdmin: user.isAdmin,      // ✅ ส่งสถานะ Admin จริงๆ
        isPremium: user.isPremium,
        profilePic: user.profilePic,
        role: user.isAdmin ? 'admin' : 'user' // (เผื่อหน้าบ้านยังใช้ตัวแปร role อยู่)
      }
    });

  } catch (error) {
    console.error(`[LOGIN_ERROR] ${error.message}`);
    return res.status(500).json({ success: false, message: 'SERVER_ERROR', error: error.message });
  }
}