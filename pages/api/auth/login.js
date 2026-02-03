import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();

  const { username, password } = req.body;

  // ค้นหา user
  const user = await User.findOne({ username });
  if (!user) return res.json({ success: false, message: 'ไม่พบชื่อผู้ใช้นี้' });

  // เช็ครหัสผ่าน (เทียบรหัสสด กับ รหัสลับในฐานข้อมูล)
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) return res.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });

  // ถ้าผ่าน ส่งข้อมูลกลับไป (ไม่ส่ง password)
  res.json({ 
    success: true, 
    user: { 
      username: user.username, 
      role: user.role, 
      isPremium: user.isPremium 
    } 
  });
}