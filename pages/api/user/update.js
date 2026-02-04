import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_IDENTITY_UPDATE_CORE v3.0
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: อัปเดตข้อมูลส่วนตัวอย่างปลอดภัย พร้อมระบบเข้ารหัส Password
 */

export default async function handler(req, res) {
  // 1. [METHOD_CHECK] - แก้เป็น POST ให้ตรงกับหน้าบ้าน
  if (req.method !== 'POST') return res.status(405).json({ message: "Method Not Allowed" });

  try {
    await connectDB();
    
    // รับค่าจากหน้าบ้าน (Profile.js)
    const { userId, username, email, password, profilePic } = req.body;

    // 2. [VALIDATION] - ต้องมี ID ถึงจะรู้ว่าแก้ใคร
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing User ID" });
    }

    // เตรียมข้อมูลที่จะอัปเดต
    const updateData = {
      username,
      email,
      profilePic
    };

    // 3. [PASSWORD_ENCRYPTION] - ถ้ามีการส่งรหัสผ่านใหม่มา ให้เข้ารหัสก่อน
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(password, salt);
      console.log(`[SECURE_LOG] Password updated for user: ${userId}`);
    }

    // 4. [EXECUTE_UPDATE] - ค้นหาจาก ID แล้วแก้เฉพาะคนนั้น
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true } // new: true เพื่อส่งข้อมูลใหม่กลับไปโชว์
    ).select('-password'); // ⚠️ สำคัญ: อย่าส่งรหัสผ่านกลับไปหน้าบ้าน

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Profile Updated Successfully",
      user: updatedUser 
    });

  } catch (error) {
    console.error("Update Error:", error);
    
    // เช็คกรณีชื่อซ้ำหรืออีเมลซ้ำ (MongoDB จะส่ง code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Username or Email already exists!" });
    }
    
    return res.status(500).json({ success: false, error: error.message });
  }
}