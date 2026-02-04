require('dotenv').config({ path: '.env.local' }); // โหลดค่า Config จาก .env
const mongoose = require('mongoose');
const axios = require('axios');

// ⚠️ เราต้อง Define Schema ซ้ำในนี้เพราะ Node Script ไม่รู้จัก Next.js Model
const MangaSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  imageUrl: String,
  synopsis: String,
  score: Number,
  status: String,
  author: String,
  genres: [String],
  isPremium: { type: Boolean, default: false },
  sourceUrl: String,
  chapters: [{
    chapterNum: Number,
    title: String,
    content: [String], // URL รูปภาพ
    updatedAt: Date
  }],
  updatedAt: { type: Date, default: Date.now }
});

const Manga = mongoose.models.Manga || mongoose.model('Manga', MangaSchema);

// --- 🐺 HUNTER BOT CONFIG ---
const TARGET_LIMIT = 10; // เริ่มที่ 10 เรื่องก่อน (กันโดนแบน IP)
const MANGADEX_API = 'https://api.mangadex.org';

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(">> [DB] Connected to MongoDB Atlas");
}

async function hunt() {
  const startTime = Date.now();
  console.log(`\n🐺 JPLUS HUNTER BOT v3.0 IS AWAKE...`);
  console.log(`>> TARGET: TOP ${TARGET_LIMIT} MANGA FROM MANGADEX\n`);

  try {
    await connectDB();

    // 1. [SCAN] - กวาดหามังงะน่าสนใจ
    const listRes = await axios.get(`${MANGADEX_API}/manga`, {
      params: { 
        limit: TARGET_LIMIT, 
        'includes[]': ['cover_art', 'author'],
        'availableTranslatedLanguage[]': ['en', 'th'],
        order: { followedCount: 'desc' }
      }
    });

    const mangaList = listRes.data.data;
    console.log(`>> [SCAN] Found ${mangaList.length} targets. Engaging...\n`);

    // 2. [ENGAGE] - เจาะลึกทีละเรื่อง
    for (const item of mangaList) {
      const title = Object.values(item.attributes.title)[0];
      console.log(`   🔸 Processing: ${title}`);

      // Metadata extraction
      const coverRel = item.relationships.find(r => r.type === 'cover_art');
      const authorRel = item.relationships.find(r => r.type === 'author');
      const fileName = coverRel?.attributes?.fileName;
      const imageUrl = fileName ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}.256.jpg` : null;

      // 3. [DEEP_DIVE] - ดึงข้อมูลตอน (Chapters) จริงๆ!
      // (ดึงมาแค่ 3 ตอนล่าสุด เพื่อ Demo ให้ดูว่าอ่านได้จริง)
      const feedRes = await axios.get(`${MANGADEX_API}/manga/${item.id}/feed`, {
        params: {
          limit: 3,
          translatedLanguage: ['en'],
          order: { chapter: 'desc' } // เอาตอนล่าสุด
        }
      });

      const realChapters = [];
      for (const ch of feedRes.data.data) {
         // ดึงรูปภาพในตอน (นี่คือหัวใจสำคัญ!)
         const atHome = await axios.get(`${MANGADEX_API}/at-home/server/${ch.id}`);
         const baseUrl = atHome.data.baseUrl;
         const hash = atHome.data.chapter.hash;
         const pages = atHome.data.chapter.data.map(file => `${baseUrl}/data/${hash}/${file}`);

         realChapters.push({
            chapterNum: parseFloat(ch.attributes.chapter) || 0,
            title: ch.attributes.title || `Chapter ${ch.attributes.chapter}`,
            content: pages, // ✅ ได้รูปภาพจริงแล้ว!
            updatedAt: new Date()
         });
      }

      // 4. [UPSERT] - บันทึกลง DB
      await Manga.findOneAndUpdate(
        { title: title },
        {
          title,
          imageUrl,
          synopsis: item.attributes.description.en || "No synopsis",
          score: (Math.random() * 2 + 8).toFixed(1),
          status: item.attributes.status.toUpperCase(),
          author: authorRel?.attributes?.name || "Unknown",
          chapters: realChapters.reverse(), // เรียง 1 -> ล่าสุด
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
      
      console.log(`      ✅ Secured: ${realChapters.length} chapters.`);
      
      // พักหายใจ 1 วินาที กันโดนบล็อก
      await new Promise(r => setTimeout(r, 1000));
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 MISSION COMPLETE in ${duration}s`);
    process.exit(0);

  } catch (err) {
    console.error(`\n💀 CRITICAL FAILURE: ${err.message}`);
    process.exit(1);
  }
}

hunt();