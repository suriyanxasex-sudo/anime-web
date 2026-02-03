import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
  
  await dbConnect();
  
  // รับข้อมูลจากหน้าบ้าน (เปลี่ยนจาก userId เป็น id เพื่อให้สั้นลง)
  const { userId, newUsername, newPassword, newProfilePic } = req.body;
  
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้นี้ในระบบ' });

    // 1. ตรวจสอบชื่อผู้ใช้ใหม่ (ถ้ามีการเปลี่ยน)
    if (newUsername && newUsername !== user.username) {
       const existing = await User.findOne({ username: newUsername });
       if (existing) return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
       user.username = newUsername;
    }

    // 2. จัดการรหัสผ่านใหม่ (ต้อง Hash ให้ปลอดภัยก่อนลง DB)
    if (newPassword) {
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(newPassword, salt);
    }

    // 3. อัปเดตรูปโปรไฟล์
    if (newProfilePic) {
       user.profilePic = newProfilePic;
    }

    // บันทึกข้อมูลลง MongoDB
    await user.save();

    // 4. ส่งข้อมูลกลับไปให้หน้าบ้านอัปเดตสถานะทันที (ตัด Password ทิ้งเพื่อความปลอดภัย)
    res.status(200).json({ 
        success: true, 
        message: 'อัปเดตข้อมูลสำเร็จ!',
        user: { 
            _id: user._id,
            username: user.username,
            role: user.role,
            isPremium: user.isPremium,
            profilePic: user.profilePic
        } 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด: ' + error.message });
  }
}