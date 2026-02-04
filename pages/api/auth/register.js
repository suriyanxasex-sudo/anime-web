import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_REGISTRATION_CORE v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ระบบสมัครสมาชิกที่สมบูรณ์แบบ รองรับ Email และ Auto-Admin
 */

export default async function handler(req, res) {
  const startTime = Date.now();

  // 1. [METHOD_GUARD] - รับเฉพาะ POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'METHOD_NOT_ALLOWED' });
  }

  // ✅ รับ email เข้ามาด้วย (สำคัญมาก!)
  const { username, email, password, profilePic } = req.body;

  // 2. [DEEP_VALIDATION] - ตรวจสอบความถูกต้องของข้อมูล
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ success: false, message: 'USERNAME_TOO_SHORT' });
  }
  
  // ตรวจสอบรูปแบบ Email (Regex Basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'INVALID_EMAIL_FORMAT' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'PASSWORD_TOO_SHORT (Min 6 chars)' });
  }

  try {
    await dbConnect();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // 3. [DUPLICATE_SCANNER] - เช็คว่า Username หรือ Email ซ้ำไหม? (ใช้ $or)
    const existingUser = await User.findOne({ 
      $or: [
        { username: cleanUsername },
        { email: cleanEmail }
      ]
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(400).json({ success: false, message: 'EMAIL_ALREADY_REGISTERED' });
      }
      return res.status(400).json({ success: false, message: 'USERNAME_TAKEN' });
    }

    // 4. [SECURITY_HASHING] - เข้ารหัสระดับสูง
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. [ACCOUNT_CREATION] - สร้างบัญชี
    const newUser = await User.create({
      username: cleanUsername,
      email: cleanEmail, // ✅ บันทึก Email ลง DB
      password: hashedPassword,
      isPremium: false,
      points: 0, // 💰 เริ่มต้น 0 แต้ม (เตรียมพร้อมระบบซื้อตอน)
      profilePic: profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
      
      // 👑 GOD MODE: ถ้าชื่อคือ 'joshua' ให้เป็น Admin ทันที
      isAdmin: cleanUsername === 'joshua', 
      
      unlockedContent: [], // เตรียม Array ว่างไว้เก็บตอนที่ซื้อ
      favorites: [],

      metadata: {
        accountCreated: new Date(),
        lastLogin: new Date(),
        registrationIP: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    const executionTime = Date.now() - startTime;
    console.log(`[AUTH_SYSTEM] New member established: ${cleanUsername} (${cleanEmail}) in ${executionTime}ms`);

    // 6. [RESPONSE_SANITIZATION] - ลบรหัสผ่านก่อนส่งกลับ
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: 'REGISTRATION_SUCCESSFUL',
      user: userResponse
    });

  } catch (error) {
    console.error(`[CRITICAL_ERROR] Register failed: ${error.message}`);
    // ดัก Error จาก Mongoose โดยตรง (เช่น Validation Error)
    return res.status(500).json({ success: false, message: 'DATABASE_ERROR', error: error.message });
  }
}