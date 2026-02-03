import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'METHOD_NOT_ALLOWED' });

  const { userId, newUsername, newPassword, newProfilePic } = req.body;

  if (!userId) return res.status(400).json({ success: false, message: 'MISSING_USER_ID' });

  await dbConnect();

  try {
    console.log(`[IDENTITY_SYNC] Attempting to update profile for UserID: ${userId}`);

    // เตรียมข้อมูลที่จะอัปเดต
    const updateData = {
      username: newUsername,
      profilePic: newProfilePic
    };

    // ถ้ามีการกรอกรหัสผ่านใหม่ ให้ Hash ก่อนเก็บเสมอ
    if (newPassword && newPassword.trim() !== "") {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(newPassword, salt);
      console.log(`[SECURITY] Password for user ${userId} has been re-hashed`);
    }

    // ทำการอัปเดตใน MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'USER_NOT_FOUND' });
    }

    // ไม่ส่งรหัสผ่านกลับไปหน้าบ้านเด็ดขาดเพื่อความปลอดภัย
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    console.log(`[SUCCESS] Profile identity for ${newUsername} updated in core database`);

    return res.status(200).json({ 
      success: true, 
      message: 'IDENTITY_UPDATED_SUCCESSFULLY',
      user: userResponse
    });

  } catch (error) {
    console.error(`[CRITICAL_ERROR] Profile Update Failed: ${error.message}`);
    return res.status(500).json({ success: false, message: 'DATABASE_WRITE_ERROR', error: error.message });
  }
}