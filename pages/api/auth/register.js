import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // รับเฉพาะ Method POST เท่านั้น
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
  
  await dbConnect();

  try {
    const { username, password } = req.body;

    // 1. ตรวจสอบเบื้องต้นว่ากรอกข้อมูลครบไหม
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
    }

    // 2. เช็คว่าชื่อนี้มีคนใช้ไปหรือยัง
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' });

    // 3. ✨ จุดสำคัญ: เข้ารหัสก่อนบันทึก (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. สร้าง User ใหม่ลงใน MongoDB
    const newUser = await User.create({ 
      username, 
      password: hashedPassword, 
      role: 'user', 
      isPremium: false,
      profilePic: '', // เพิ่มฟิลด์รูปว่างไว้ก่อน
      favorites: []   // เตรียม Array ไว้เก็บมังงะเรื่องโปรด
    });

    // 5. ส่งค่ากลับ (ไม่ส่ง Password ออกไปเพื่อความปลอดภัย)
    res.status(201).json({ 
      success: true, 
      user: {
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        isPremium: newUser.isPremium
      } 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด: ' + error.message });
  }
}