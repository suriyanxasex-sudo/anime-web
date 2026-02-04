// scripts/create-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' }); // โหลดค่า Config Database

// Schema จำลองสำหรับ User (เพื่อให้ Script รู้จักโครงสร้าง)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  isAdmin: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  profilePic: String,
  metadata: Object
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  console.log("🔑 JPLUS ADMIN FIXER: Connecting to Database...");

  if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: ไม่เจอ MONGODB_URI ในไฟล์ .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database Connected.");

    const username = 'joshua';
    const password = '7465'; // รหัสที่ลูกพี่ต้องการ

    // 1. ลบตัวเก่าทิ้ง (กันบั๊กข้อมูลซ้ำ)
    await User.deleteOne({ username });
    console.log(`🗑️  Deleted old '${username}' account (if existed).`);

    // 2. สร้างตัวใหม่แบบเทพทรู
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username: username,
      password: hashedPassword,
      email: 'admin@jplus.com',
      isAdmin: true,      // 👑 สถานะ Admin
      isPremium: true,    // 💎 สถานะ Premium
      points: 999999,     // 💰 แต้มบุญมหาศาล
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=joshua-boss",
      metadata: { 
        createdAt: new Date(),
        fixedBy: 'Script Method 2' 
      }
    });

    console.log(`\n🎉 SUCCESS! Admin Created Successfully.`);
    console.log(`👉 Username: ${username}`);
    console.log(`👉 Password: ${password}`);
    console.log(`\nลูกพี่กลับไปหน้าเว็บแล้ว Login ได้เลยครับ!`);
    
    process.exit(0);

  } catch (error) {
    console.error(`❌ FAILED: ${error.message}`);
    process.exit(1);
  }
}

createAdmin();