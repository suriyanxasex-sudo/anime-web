const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Schema แบบย่อ (เพื่อให้ script อ่านข้อมูลออก)
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkStatus() {
  if (!process.env.MONGODB_URI) {
    console.error("❌ ไม่เจอ MONGODB_URI");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Connected to DB...");

    // ค้นหาตัวลูกพี่
    const user = await User.findOne({ username: 'joshua' });

    if (!user) {
      console.log("❌ ไม่เจอ User ชื่อ joshua ในระบบ!");
    } else {
      console.log("\n🔎 --- [JOSHUA STATUS REPORT] ---");
      console.log(`👤 Username:  ${user.username}`);
      console.log(`📧 Email:     ${user.email}`);
      console.log(`👑 isAdmin:   ${user.isAdmin}  <-- ต้องเป็น true`);
      console.log(`💎 isPremium: ${user.isPremium}`);
      console.log(`💰 Points:    ${user.points}`);
      console.log("--------------------------------\n");
    }

  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkStatus();