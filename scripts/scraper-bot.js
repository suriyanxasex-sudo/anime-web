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
    console.log("--- JPLUS_CLEAN_SYNC_STARTING ---");

    // ข้อมูลชุดใหม่ ใช้รูปจาก Unsplash/Pinterest ที่ Direct Link ชัวร์ๆ
    const targets = [
      { 
        title: "Oshino Ko Premium", 
        imageUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop", 
        isPremium: true,
        chapters: [{ 
          title: "Chapter 1", 
          content: [
            "https://images.unsplash.com/photo-1614583225154-5feaba0bd421?q=80&w=1000",
            "https://images.unsplash.com/photo-1578632738980-43314a7c462e?q=80&w=1000"
          ] 
        }]
      },
      { 
        title: "Valkyrie Special", 
        imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop", 
        isPremium: false,
        chapters: [{ 
          title: "Chapter 1", 
          content: [
            "https://images.unsplash.com/photo-1541562232579-512a21359920?q=80&w=1000",
            "https://images.unsplash.com/photo-1580477310901-22801c48e53b?q=80&w=1000"
          ] 
        }]
      }
    ];

    // ⚡️ ล้างข้อมูลเก่าที่ "กาก" ทิ้งให้หมดก่อนลงใหม่
    await Manga.deleteMany({}); 
    console.log("[CLEANUP] All broken data removed.");

    for (const item of targets) {
      console.log(`[BOT] Deploying: ${item.title}`);
      await Manga.create(item);
    }
    console.log("--- MISSION_COMPLETE ---");
  } catch (err) { console.error("ERROR:", err.message); }
  finally { mongoose.connection.close(); process.exit(0); }
}
run();