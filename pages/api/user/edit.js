import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  
  const { userId, newUsername, newPassword, newProfilePic } = req.body;
  
  try {
    // หา User คนนี้
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: 'ไม่พบผู้ใช้' });

    // ถ้ามีการแก้ชื่อ (ต้องเช็คว่าซ้ำคนอื่นไหม)
    if (newUsername && newUsername !== user.username) {
       const existing = await User.findOne({ username: newUsername });
       if (existing) return res.json({ success: false, message: 'ชื่อนี้มีคนใช้แล้ว' });
       user.username = newUsername;
    }

    // ถ้ามีการแก้รหัสผ่าน (ต้องเข้ารหัสใหม่)
    if (newPassword) {
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(newPassword, salt);
    }

    // ถ้ามีการแก้รูปโปรไฟล์
    if (newProfilePic) {
       user.profilePic = newProfilePic;
    }

    await user.save();

    // ส่งข้อมูลใหม่กลับไป (แต่ไม่ส่งรหัสผ่าน)
    res.json({ 
        success: true, 
        user: { 
            _id: user._id,
            username: user.username, 
            role: user.role, 
            isPremium: user.isPremium,
            profilePic: user.profilePic
        } 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}