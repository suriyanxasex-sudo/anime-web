// scripts/fix-admin-god-mode.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function fixAdmin() {
  console.log("⚡️ JPLUS ADMIN RECONSTRUCTION: Starting...");

  if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI missing in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Database Connected.");

    const targetUsername = 'joshua';
    const targetPassword = '7465';

    // 1. ลบ Joshua ทุกเวอร์ชันทิ้งให้เกลี้ยง (ล้างบางคนใช้ชื่อซ้ำ)
    const deleteResult = await mongoose.connection.db.collection('users').deleteMany({ 
      username: { $regex: new RegExp(`^${targetUsername}$`, 'i') } 
    });
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} old user(s) named '${targetUsername}'.`);

    // 2. สร้าง Joshua ใหม่ พร้อมสถานะ God Mode
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(targetPassword, salt);

    const adminUser = {
      username: targetUsername,
      password: hashedPassword,
      email: 'joshua@jplus-admin.com',
      isAdmin: true,       // ✅ ยศแอดมิน
      role: 'admin',       // ✅ ยศแอดมิน (กันเหนียว)
      isPremium: true,     // ✅ พรีเมียม
      points: 999999,      // ✅ แต้มบุญมหาศาล
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=JoshuaAdmin",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await mongoose.connection.db.collection('users').insertOne(adminUser);

    console.log(`\n👑 --- [SUCCESS] --- 👑`);
    console.log(`ID: ${targetUsername}`);
    console.log(`PASS: ${targetPassword}`);
    console.log(`Status: ADMIN OVERLORD`);
    console.log(`----------------------`);
    console.log(`\nลูกพี่ไป Login ได้เลยครับ รอบนี้เข้าได้ชัวร์และเป็นแอดมินแน่นอน!`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ FAILED: ${error.message}`);
    process.exit(1);
  }
}

fixAdmin();