import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  // รับเฉพาะ Method POST เท่านั้น
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  await dbConnect(); // เชื่อมต่อฐานข้อมูล

  try {
    const { username } = req.body; // รับชื่อผู้ใช้มาอัปเกรด

    // ค้นหาและอัปเกรดสถานะเป็น Premium (VIP)
    // { new: true } เพื่อให้ส่งค่า User ที่อัปเดตแล้วกลับไป
    const user = await User.findOneAndUpdate(
      { username }, 
      { isPremium: true }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้นี้ในระบบ' });
    }

    res.status(200).json({ 
      success: true, 
      message: `${user.username} อัปเกรดเป็น VIP เรียบร้อยแล้ว! 💎`,
      user 
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}