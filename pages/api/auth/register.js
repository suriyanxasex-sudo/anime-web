import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_REGISTRATION_PROTOCOL v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: สร้างอัตลักษณ์ผู้ใช้งานใหม่พร้อมระบบความปลอดภัยระดับสูงสุด
 */

export default async function handler(req, res) {
  const startTime = Date.now();

  // 1. ตรวจสอบ HTTP Method (Register ต้องเป็น POST เท่านั้น)
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: `METHOD_${req.method}_DENIED: โปรโตคอลนี้รองรับเฉพาะการส่งข้อมูลแบบ POST` 
    });
  }
  
  await dbConnect(); // เชื่อมต่อฐานข้อมูล MongoDB Atlas

  try {
    const { username, password, profilePic } = req.body;

    // 2. ระบบตรวจสอบความถูกต้องของข้อมูล (Deep Input Validation)
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'REG_ERROR: ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร' 
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'REG_ERROR: รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษรเพื่อความปลอดภัย' 
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    console.log(`[AUTH_SYSTEM] Processing registration for: ${cleanUsername}`);

    // 3. ตรวจสอบการซ้ำซ้อนของข้อมูล (Global Collision Check)
    const existingUser = await User.findOne({ username: cleanUsername });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'CONFLICT: ชื่อผู้ใช้นี้มีอยู่ในสารบบของ Jplus แล้ว' 
      });
    }

    // 4. ระบบเข้ารหัสข้อมูลลับ (Bcrypt Security Layer)
    // ใช้ Salt 12 รอบ (ความเข้มสูง) เพื่อป้องกันการโจมตีแบบ Rainbow Table
    console.log(`[SECURITY] Generating Cryptographic Salt...`);
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. ระบบกำหนดบทบาทอัตโนมัติ (Role Assignment Logic)
    // ถ้าชื่อตรงกับลูกพี่ Joshua ระบบจะมอบอำนาจ Admin ให้ทันที
    const isAdmin = cleanUsername === 'joshua';
    
    // 6. การสร้าง Object ผู้ใช้งานแบบละเอียด (Full Meta Construction)
    const newUser = await User.create({
      username: cleanUsername,
      password: hashedPassword,
      isAdmin: isAdmin,
      isPremium: false,
      profilePic: profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
      favorites: [],
      metadata: {
        accountCreated: new Date(),
        lastLogin: new Date(),
        registrationIP: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      }
    });

    const executionTime = Date.now() - startTime;
    console.log(`[SUCCESS] New member "${cleanUsername}" registered in ${executionTime}ms`);

    // 7. ส่งข้อมูลที่ปลอดภัยกลับไปยัง Client-side
    return res.status(201).json({
      success: true,
      message: 'ACCOUNT_CREATED_SUCCESSFULLY',
      execution_time: `${executionTime}ms`,
      user: {
        _id: newUser._id,
        username: newUser.username,
        role: newUser.isAdmin ? 'ADMIN_OVERLORD' : 'STANDARD_MEMBER',
        isPremium: newUser.isPremium,
        profileImage: newUser.profilePic,
        joinDate: newUser.metadata.accountCreated
      }
    });

  } catch (error) {
    console.error(`[CRITICAL_REG_FAILURE] ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: 'CORE_SERVER_ERROR: ' + error.message 
    });
  }
}