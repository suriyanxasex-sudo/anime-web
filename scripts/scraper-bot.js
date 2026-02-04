const mongoose = require('mongoose');

// Schema (Copy ให้ตรงกัน)
const MangaSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  isPremium: Boolean,
  sourceUrl: String,
  chapters: [{ title: String, content: [String], sourceUrl: String }],
  updatedAt: { type: Date, default: Date.now }
});
const Manga = mongoose.models.Manga || mongoose.model('Manga', MangaSchema);

async function run() {
  if (!process.env.MONGODB_URI) { console.error("❌ Missing MONGODB_URI"); process.exit(1); }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("--- JPLUS SYSTEM CLEANER ---");
    console.log("⏳ กำลังล้างข้อมูลเก่าทั้งหมด...");

    // ⚡️ คำสั่งล้างโลก: ลบทุกอย่างให้เกลี้ยง
    await Manga.deleteMany({}); 

    console.log("✅ Database ว่างเปล่าแล้ว! พร้อมรับการดูดข้อมูลใหม่ (Ready for Hunter Bot)");
    
  } catch (err) { console.error("ERROR:", err.message); }
  finally { mongoose.connection.close(); process.exit(0); }
}
run();