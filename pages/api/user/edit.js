import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_IDENTITY_MANAGEMENT_PROTOCOL v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: จัดการการเปลี่ยนแปลงข้อมูลอัตลักษณ์ผู้ใช้งานอย่างปลอดภัย 100%
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  
  // 1. ตรวจสอบ HTTP Method (อนุญาตเฉพาะ POST ตามมาตรฐานความปลอดภัย)
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: `METHOD_${req.method}_NOT_ALLOWED_BY_JOSHUA_SECURITY` 
    });
  }
  
  await dbConnect(); // เชื่อมต่อ MongoDB Atlas 
  
  // 2. รับข้อมูลจาก Request Body และทำการล้างข้อมูลเบื้องต้น
  const { userId, newUsername, newPassword, newProfilePic } = req.body;
  
  // ตรวจสอบว่ามี UserID ส่งมาหรือไม่ (ถ้าไม่มีคือโมฆะทันที)
  if (!userId) {
    return res.status(400).json({ 
      success: false, 
      message: 'IDENTITY_ERROR: MISSING_USER_ID_IDENTIFIER' 
    });
  }

  try {
    console.log(`[CORE_SYSTEM] Initiating Identity_Sync for ID: ${userId}`);

    // ค้นหาผู้ใช้งานในฐานข้อมูลแบบ Deep Search
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'DATABASE_ERROR: TARGET_USER_NOT_FOUND_IN_SYSTEM' 
      });
    }

    // 3. ระบบจัดการการเปลี่ยนชื่อผู้ใช้ (Global Username Collision Check)
    if (newUsername && newUsername.trim() !== "" && newUsername !== user.username) {
      const cleanUsername = newUsername.trim().toLowerCase();
      
      // ตรวจสอบว่าชื่อใหม่ซ้ำกับใครในระบบไหม
      const existing = await User.findOne({ username: cleanUsername });
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: 'CONFLICT: ชื่อผู้ใช้นี้ถูกครอบครองโดยบัญชีอื่นแล้ว' 
        });
      }
      
      console.log(`[IDENTITY] Changing username: ${user.username} -> ${cleanUsername}`);
      user.username = cleanUsername;
    }

    // 4. ระบบความปลอดภัยของรหัสผ่าน (Encryption Protocol)
    if (newPassword && newPassword.trim().length >= 4) {
      console.log(`[SECURITY] Generating new Salt for Password Encryption...`);
      // ใช้ Salt 12 รอบ (ความเข้มสูง) เพื่อป้องกันการถอดรหัส (Brute Force)
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // 5. ระบบจัดการรูปโปรไฟล์ (Asset Management)
    if (newProfilePic && newProfilePic.trim() !== "") {
      user.profilePic = newProfilePic.trim();
    }

    // 6. บันทึกข้อมูลลง MongoDB (Commit Changes)
    user.metadata = {
      ...user.metadata,
      lastUpdated: new Date(),
      updateMethod: 'WEB_INTERFACE'
    };

    await user.save();

    const executionTime = Date.now() - startTime;
    console.log(`[SUCCESS] Sync completed in ${executionTime}ms. Profile is now updated.`);

    // 7. ส่งข้อมูลที่ปลอดภัยกลับไป (ไม่ส่งข้อมูลลับกลับไปเด็ดขาด)
    return res.status(200).json({ 
        success: true, 
        message: 'IDENTITY_SYNCHRONIZATION_SUCCESSFUL',
        execution_time: `${executionTime}ms`,
        user: { 
            _id: user._id,
            username: user.username,
            role: user.isAdmin ? 'ADMIN_OVERLORD' : 'MEMBER_ID',
            isPremium: user.isPremium,
            profilePic: user.profilePic,
            lastUpdated: user.metadata.lastUpdated
        } 
    });

  } catch (error) {
    console.error(`[CRITICAL_FAILURE] Profile Sync Error: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: 'CORE_SERVER_ERROR: ' + error.message 
    });
  }
}