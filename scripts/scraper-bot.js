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
    console.log("--- JPLUS SYSTEM RESTORE ---");

    // ⚡️ ลบข้อมูลเก่าทิ้งทั้งหมด!
    await Manga.deleteMany({}); 
    console.log("[CLEANUP] Database Cleaned.");

    const targets = [
      { 
        title: "NARUTO - JPLUS EDITION", 
        imageUrl: "https://m.media-amazon.com/images/I/912KVnXi6kL.jpg", 
        isPremium: true,
        chapters: [{ 
          title: "Chapter 1", 
          // ⚡️ ต้องมีลิ้งก์รูปตรงนี้เท่านั้น!
          content: [
            "https://images.unsplash.com/photo-1578632738980-43314a7c462e?q=80&w=1000",
            "https://images.unsplash.com/photo-1614583225154-5feaba0bd421?q=80&w=1000"
          ] 
        }]
      }
    ];

    for (const item of targets) {
      console.log(`[INSTALL] Deploying: ${item.title}`);
      await Manga.create(item);
    }
    console.log("--- MISSION COMPLETE ---");
  } catch (err) { console.error("ERROR:", err.message); }
  finally { mongoose.connection.close(); process.exit(0); }
}
run();