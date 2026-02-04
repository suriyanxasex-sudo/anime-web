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
    console.log("--- JPLUS_SYSTEM_WIPE_AND_SYNC ---");

    // ล้างขยะเก่าที่รูปไม่ขึ้นทิ้งให้เกลี้ยง
    await Manga.deleteMany({}); 

    const targets = [
      { 
        title: "Oshi no Ko [PROXIED]", 
        imageUrl: "https://mangadex.org/covers/9593a324-4061-455b-9f9f-09919f96b26c/b0a455a5-9989-498c-843e-329486c91a78.jpg", 
        isPremium: true,
        chapters: [{ 
          title: "Chapter 1", 
          content: [
            "https://uploads.mangadex.org/data/7b320392095f32b123/1-image.png",
            "https://uploads.mangadex.org/data/7b320392095f32b123/2-image.png"
          ] 
        }]
      }
    ];

    for (const item of targets) {
      console.log(`[BOT] Deploying: ${item.title}`);
      await Manga.create(item);
    }
    console.log("--- MISSION_SUCCESS ---");
  } catch (err) { console.error("ERROR:", err.message); }
  finally { mongoose.connection.close(); process.exit(0); }
}
run();