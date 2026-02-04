const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  isPremium: Boolean,
  updatedAt: { type: Date, default: Date.now }
});
const Manga = mongoose.models.Manga || mongoose.model('Manga', MangaSchema);

async function run() {
  if (!process.env.MONGODB_URI) { console.error("Missing MONGODB_URI"); process.exit(1); }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("--- JPLUS_BOT_SEQUENTIAL_ACTIVE ---");
    const targets = [
      { title: "Solo Leveling Premium", imageUrl: "https://via.placeholder.com/300x450", isPremium: true },
      { title: "One Piece Special", imageUrl: "https://via.placeholder.com/300x450", isPremium: true }
    ];
    for (const item of targets) {
      console.log(`[BOT] ขุด: ${item.title}`);
      await Manga.findOneAndUpdate({ title: item.title }, item, { upsert: true });
      await new Promise(r => setTimeout(r, 3000)); // กันโดนแบน
    }
    console.log("--- MISSION_COMPLETE ---");
  } catch (err) { console.error("ERROR:", err.message); }
  finally { mongoose.connection.close(); process.exit(0); }
}
run();