import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  // 1. รับค่า Email เข้ามาด้วย (สำคัญกับ Schema ใหม่)
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  await dbConnect();

  try {
    const cleanUsername = username.trim().toLowerCase();
    
    // 2. เช็คว่ามี User หรือ Email นี้หรือยัง
    const existingUser = await User.findOne({ 
      $or: [{ username: cleanUsername }, { email: email }] 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว' });
    }

    // 3. เข้ารหัสรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. ✨ GOD MODE TRIGGER: ถ้าชื่อ joshua ให้ยศ Admin + เงินล้านทันที
    const isOverlord = cleanUsername === 'joshua';

    const newUser = await User.create({
      username: cleanUsername,
      email: email || `${cleanUsername}@noemail.com`, // ถ้าไม่ส่งเมลมั่วให้ก่อน
      password: hashedPassword,
      isAdmin: isOverlord,       // ✅ Set Admin
      isPremium: isOverlord,     // ✅ Set Premium
      points: isOverlord ? 999999 : 0, // ✅ ให้ตังค์
      profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`
    });

    return res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ!',
      user: {
        username: newUser.username,
        isAdmin: newUser.isAdmin
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}