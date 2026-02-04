// ไฟล์: scripts/wipe-db.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' }); // โหลดรหัสผ่านจากไฟล์ .env

const MangaSchema = new mongoose.Schema({ title: String }, { strict: false });
const Manga = mongoose.models.Manga || mongoose.model('Manga', MangaSchema);

async function wipe() {
  if (!process.env.MONGODB_URI) { 
    console.error("❌ ไม่เจอ MONGODB_URI ในเครื่อง (เช็คไฟล์ .env.local)"); 
    process.exit(1); 
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔥 กำลังเผาข้อมูลทิ้ง...");
    await Manga.deleteMany({}); // ลบแม่งให้หมด
    console.log("✅ เรียบร้อย! Database ว่างเปล่า 100%");
  } catch (e) { console.error(e); }
  finally { mongoose.connection.close(); process.exit(0); }
}
wipe();