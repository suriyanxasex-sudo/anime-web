const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  isPremium: Boolean,
  chapters: [{ title: String, content: [String] }],
  updatedAt: { type: Date, default: Date.now }
});
const Manga = mongoose.models.Manga || mongoose.model('Manga', MangaSchema);

async function run() {
  if (!process.env.MONGODB_URI) { console.error("Missing MONGODB_URI"); process.exit(1); }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("--- JPLUS_DATABASE_REBUILD_STARTING ---");

    // ⚡️ สั่งล้างฐานข้อมูลทิ้งทั้งหมดก่อนเริ่ม (เพื่อความชัวร์)
    await Manga.deleteMany({}); 

    const targets = [
      { 
        title: "NARUTO_J_SPECIAL", 
        imageUrl: "https://m.media-amazon.com/images/I/912KVnXi6kL.jpg", 
        isPremium: true,
        chapters: [
          { 
            title: "Chapter 1", 
            // ⚡️ ใส่ลิ้งก์รูปที่เปิดได้ชัวร์ๆ (ผ่าน Proxy)
            content: [
              "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000",
              "https://images.unsplash.com/photo-1614583225154-5feaba0bd421?q=80&w=1000"
            ] 
          }
        ]
      }
    ];

    for (const item of targets) {
      console.log(`[BOT] Syncing Data: ${item.title}`);
      await Manga.create(item);
    }
    console.log("--- MISSION_SUCCESS: DATABASE_READY ---");
  } catch (err) { console.error("ERROR:", err.message); }
  finally { mongoose.connection.close(); process.exit(0); }
}
run();