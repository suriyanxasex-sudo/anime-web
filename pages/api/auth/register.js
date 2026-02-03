import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs'; // เรียกใช้ตัวเข้ารหัส

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  
  const { username, password } = req.body;
  
  const existing = await User.findOne({ username });
  if (existing) return res.json({ success: false, message: 'ชื่อนี้มีคนใช้แล้ว' });

  // --- จุดสำคัญ: เข้ารหัสก่อนบันทึก ---
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // --------------------------------

  const newUser = await User.create({ 
    username, 
    password: hashedPassword, // บันทึกรหัสที่ถูกแปลงแล้ว
    role: 'user', 
    isPremium: false 
  });
  
  res.json({ success: true, user: newUser });
}