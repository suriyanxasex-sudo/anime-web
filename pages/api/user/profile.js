import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * JPLUS_ADMIN_SEEDER v3.0
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: สร้าง God User (Admin) โดยอัตโนมัติหากระบบยังว่างเปล่า
 */

export default async function handler(req, res) {
  try {
    await connectDB();

    const targetUsername = "joshua";
    
    // 1. [CHECK_EXISTENCE] - ดูว่ามีลูกพี่อยู่หรือยัง
    let user = await User.findOne({ username: targetUsername });

    if (!user) {
      console.log(">> DETECTED_EMPTY_THRONE: Creating Admin Account...");
      
      // 2. [HASH_PASSWORD] - สร้างรหัสผ่านเริ่มต้น (admin1234)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin1234", salt);

      // 3. [GOD_MODE_INJECTION] - สร้างตัวละครเทพ
      user = await User.create({
        username: targetUsername,
        email: "admin@jplus.com", // ✅ ต้องใส่ Email (Schema บังคับ)
        password: hashedPassword, // ✅ ต้องใส่ Password (Schema บังคับ)
        isAdmin: true,            // ✅ ใช้ isAdmin: true แทน role
        isPremium: true,
        points: 999999,           // 💰 ให้แต้มไปเลย 1 ล้าน (God Mode)
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=joshua-god",
        metadata: {
          accountCreated: new Date(),
          lastLogin: new Date()
        }
      });
      
      return res.status(201).json({ 
        success: true, 
        message: "GOD_ACCOUNT_CREATED", 
        info: "User: joshua | Pass: admin1234 | Points: 999,999" 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "ADMIN_EXISTS", 
      user 
    });

  } catch (error) {
    console.error("Seeder Error:", error);
    return res.status(500).json({ error: error.message });
  }
}