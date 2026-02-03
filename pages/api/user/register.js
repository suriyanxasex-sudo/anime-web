import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'METHOD_NOT_ALLOWED' });

  const { username, password } = req.body;

  // Validation: ตรวจสอบความละเอียดของข้อมูล
  if (!username || username.length < 3) {
    return res.status(400).json({ success: false, message: 'USERNAME_TOO_SHORT_MIN_3' });
  }
  if (!password || password.length < 4) {
    return res.status(400).json({ success: false, message: 'PASSWORD_TOO_SHORT_MIN_4' });
  }

  await dbConnect();

  try {
    // 1. ตรวจสอบว่าชื่อผู้ใช้นี้มีในระบบหรือยัง
    const userExists = await User.findOne({ username: username.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'IDENTIFIER_ALREADY_EXISTS' });
    }

    // 2. ระบบรักษาความปลอดภัย: Hash รหัสผ่านด้วย Salt 12 รอบ
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. สร้าง User ใหม่ในฐานข้อมูล Jplus
    const newUser = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      isPremium: false,
      isAdmin: username.toLowerCase() === 'joshua', // ตั้งค่า Auto Admin สำหรับลูกพี่
      metadata: {
        accountCreated: new Date(),
        lastLogin: new Date()
      }
    });

    // 4. เตรียมข้อมูลส่งกลับ (ไม่ส่ง Password กลับไป)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    console.log(`[AUTH_SYSTEM] New member established: ${username}`);

    return res.status(201).json({
      success: true,
      message: 'REGISTRATION_SUCCESSFUL',
      user: userResponse
    });

  } catch (error) {
    console.error(`[CRITICAL_ERROR] Register failed: ${error.message}`);
    return res.status(500).json({ success: false, message: 'DATABASE_WRITE_ERROR', error: error.message });
  }
}