import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { username, password } = req.body;

  await dbConnect();

  try {
    // 1. ดึงข้อมูล User (ต้องใช้ .select('+password') เพราะใน Schema เราซ่อนไว้)
    const user = await User.findOne({ username: username.toLowerCase() }).select('+password');

    if (!user) return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });

    // 2. เช็ครหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'รหัสผ่านผิด' });

    // 3. อัปเดต Last Login
    user.metadata = { ...user.metadata, lastLogin: new Date() };
    await user.save();

    // 4. 📦 PACKING DATA: ส่งข้อมูลสำคัญกลับไปหน้าเว็บ
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,      // ✅ สำคัญมาก! ต้องส่งไปไม่งั้นเมนู Admin ไม่ขึ้น
        isPremium: user.isPremium,
        points: user.points,        // ✅ ส่งแต้มไปโชว์
        profilePic: user.profilePic,
        favorites: user.favorites   // ✅ ส่งรายการโปรด
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}