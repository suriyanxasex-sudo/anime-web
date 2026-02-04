const mongoose = require('mongoose');

// นิยาม Schema ใหม่ในสคริปต์เพื่อความแม่นยำ
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
    console.log("--- JPLUS_ULTIMATE_SCRAPER_ACTIVE ---");

    const targets = [
      { 
        title: "Naruto Special", 
        imageUrl: "https://m.media-amazon.com/images/I/912KVnXi6kL._AC_UF1000,1000_QL80_.jpg", 
        isPremium: false,
        chapters: [{ 
          title: "Chapter 1", 
          content: [
            "https://via.placeholder.com/800x1200?text=NARUTO_PAGE_1",
            "https://via.placeholder.com/800x1200?text=NARUTO_PAGE_2"
          ] 
        }]
      },
      { 
        title: "Solo Leveling Premium", 
        imageUrl: "https://static.wikia.nocookie.net/sololeveling/images/e/e8/Solo_Leveling_Webtoon.png", 
        isPremium: true,
        chapters: [{ 
          title: "Chapter 1", 
          content: [
            "https://via.placeholder.com/800x1200?text=SOLO_PAGE_1",
            "https://via.placeholder.com/800x1200?text=SOLO_PAGE_2"
          ] 
        }]
      }
    ];

    for (const item of targets) {
      console.log(`[BOT] กวาดข้อมูล: ${item.title}`);
      // ใช้ findOneAndReplace เพื่อล้างข้อมูลเก่าที่พิการออกให้หมด
      await Manga.findOneAndReplace({ title: item.title }, item, { upsert: true });
    }
    console.log("--- MISSION_COMPLETE ---");
  } catch (err) { console.error("ERROR:", err.message); }
  finally { mongoose.connection.close(); process.exit(0); }
}
run();