import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_AUTH_REGISTER_CORE v3.0
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ระบบสมัครสมาชิกที่สมบูรณ์แบบ รองรับ Email และ Auto-Admin
 */

export default async function handler(req, res) {
  // 1. [METHOD_GUARD] - รับเฉพาะ POST
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'METHOD_NOT_ALLOWED' });

  // ✅ รับ email เข้ามาด้วย
  const { username, email, password } = req.body;

  // 2. [DEEP_VALIDATION] - ตรวจสอบความถูกต้องของข้อมูล
  if (!username || username.length < 3) {
    return res.status(400).json({ success: false, message: 'USERNAME_TOO_SHORT_MIN_3' });
  }
  
  // ตรวจสอบรูปแบบ Email (เบื้องต้น)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'INVALID_EMAIL_FORMAT' });
  }

  if (!password || password.length < 4) {
    return res.status(400).json({ success: false, message: 'PASSWORD_TOO_SHORT_MIN_4' });
  }

  try {
    await dbConnect();

    // 3. [DUPLICATE_SCANNER] - เช็คว่า Username หรือ Email ซ้ำไหม?
    const existingUser = await User.findOne({ 
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ success: false, message: 'EMAIL_ALREADY_REGISTERED' });
      }
      return res.status(400).json({ success: false, message: 'USERNAME_TAKEN' });
    }

    // 4. [SECURITY_HASHING] - เข้ารหัสระดับสูง
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. [ACCOUNT_CREATION] - สร้างบัญชี
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(), // ✅ บันทึก Email
      password: hashedPassword,
      isPremium: false,
      points: 0, // เริ่มต้น 0 แต้ม
      profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`, // สร้างรูป Auto ให้เลย
      
      // 👑 GOD MODE: ถ้าชื่อคือ 'joshua' ให้เป็น Admin ทันที
      isAdmin: username.toLowerCase() === 'joshua', 
      
      metadata: {
        accountCreated: new Date(),
        lastLogin: new Date()
      }
    });

    // 6. [RESPONSE_SANITIZATION] - ลบรหัสผ่านก่อนส่งกลับ
    const userResponse = newUser.toObject();
    delete userResponse.password;

    console.log(`[AUTH_SYSTEM] New member established: ${username} (${email})`);

    return res.status(201).json({
      success: true,
      message: 'REGISTRATION_SUCCESSFUL',
      user: userResponse
    });

  } catch (error) {
    console.error(`[CRITICAL_ERROR] Register failed: ${error.message}`);
    return res.status(500).json({ success: false, message: 'DATABASE_ERROR', error: error.message });
  }
}