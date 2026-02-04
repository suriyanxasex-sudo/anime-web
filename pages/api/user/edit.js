import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_IDENTITY_CORE v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: อัปเดตข้อมูล User (Username, Email, Pass, Pic) แบบ Full Option
 */

export default async function handler(req, res) {
  const startTime = Date.now();

  // 1. [METHOD_GUARD]
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'METHOD_NOT_ALLOWED' });
  }

  await dbConnect();

  // ⚠️ รับค่าให้ตรงกับหน้า Frontend (Profile.js)
  const { userId, username, email, password, profilePic } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'MISSING_USER_ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'USER_NOT_FOUND' });
    }

    // --- 2. UPDATE USERNAME (พร้อมเช็คซ้ำ) ---
    if (username && username.trim() !== "" && username !== user.username) {
      const cleanName = username.trim().toLowerCase();
      const existing = await User.findOne({ username: cleanName });
      if (existing) {
        return res.status(400).json({ success: false, message: 'USERNAME_ALREADY_TAKEN' });
      }
      user.username = cleanName;
    }

    // --- 3. UPDATE EMAIL (ของใหม่! พร้อมเช็คซ้ำ) ---
    if (email && email.trim() !== "" && email !== user.email) {
      const cleanEmail = email.trim().toLowerCase();
      const existingEmail = await User.findOne({ email: cleanEmail });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'EMAIL_ALREADY_USED' });
      }
      user.email = cleanEmail;
    }

    // --- 4. UPDATE PASSWORD ---
    // (เช็คว่ามีการส่งรหัสใหม่มาจริง และยาวพอ)
    if (password && password.trim().length >= 4) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
      console.log(`[SECURE] Password updated for ${user.username}`);
    }

    // --- 5. UPDATE PROFILE PIC ---
    if (profilePic && profilePic.trim() !== "") {
      user.profilePic = profilePic.trim();
    }

    // --- 6. SAVE & RETURN ---
    user.metadata = { ...user.metadata, lastUpdated: new Date() };
    await user.save();

    const executionTime = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      message: 'PROFILE_UPDATED',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,          // ✅ ส่ง Email กลับไปด้วย
        role: user.isAdmin ? 'admin' : 'user', // ✅ ส่ง Role แบบมาตรฐาน
        isAdmin: user.isAdmin,
        isPremium: user.isPremium,
        points: user.points,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error(`[UPDATE_ERROR] ${error.message}`);
    return res.status(500).json({ success: false, message: 'SERVER_ERROR', error: error.message });
  }
}