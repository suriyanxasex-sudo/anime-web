const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// Schema ชั่วคราว
const MangaSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  imageUrl: String,
  synopsis: String,
  status: String,
  author: String,
  genres: [String],
  isPremium: { type: Boolean, default: false },
  chapters: [{
    chapterNum: Number,
    title: String,
    content: [String],
    updatedAt: Date
  }],
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 }
}, { strict: false });

const Manga = mongoose.models.Manga || mongoose.model('Manga', MangaSchema);

// 🔥 ปรับจูนความแรงตรงนี้
const TARGET_LIMIT = 50; // เพิ่มเป็น 50 เรื่อง (ถ้าเยอะกว่านี้อาจรอนาน)
const MANGADEX_API = 'https://api.mangadex.org';

async function hunt() {
  console.log(`\n🐺 JPLUS HUNTER (UNLEASHED): Waking up...`);

  if (!process.env.MONGODB_URI) { console.error("❌ ไม่เจอ MONGODB_URI"); process.exit(1); }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Database Connected.");

    // 1. กวาดหามังงะ
    const listRes = await axios.get(`${MANGADEX_API}/manga`, {
      params: { 
        limit: TARGET_LIMIT, 
        'includes[]': ['cover_art', 'author'],
        'availableTranslatedLanguage[]': ['en', 'th'], // ✅ เอาทั้งอังกฤษและไทย
        order: { followedCount: 'desc' },
        'contentRating[]': ['safe', 'suggestive'] 
      }
    });

    const mangaList = listRes.data.data;
    console.log(`>> 🎯 เจอเป้าหมายทั้งหมด ${mangaList.length} เรื่อง! ลุยเลย...\n`);

    for (const item of mangaList) {
      const title = Object.values(item.attributes.title)[0];
      
      // ข้ามเรื่องที่ไม่มีชื่อ
      if (!title) continue;

      const coverRel = item.relationships.find(r => r.type === 'cover_art');
      const fileName = coverRel?.attributes?.fileName;
      const imageUrl = fileName ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}.512.jpg` : null;

      console.log(`   🔸 Hunting: ${title}...`);

      // 2. ดูดตอน (จัดเต็ม 500 ตอนล่าสุด)
      const feedRes = await axios.get(`${MANGADEX_API}/manga/${item.id}/feed`, {
        params: {
          limit: 500, // ⚡️ ดูดมา 500 ตอน (แทบจะทุกตอนที่มี)
          translatedLanguage: ['en', 'th'], // ✅ เอาทั้งอังกฤษและไทย
          order: { chapter: 'desc' }
        }
      });

      const realChapters = [];
      
      // ถ้าไม่มีสักตอน ข้ามไปเลย จะได้ไม่รก Database
      if (feedRes.data.data.length === 0) {
        console.log(`      ⚠️ ไม่พบตอนในภาษาที่ระบุ (ข้าม)`);
        continue;
      }

      for (const ch of feedRes.data.data) {
         try {
           // ดึงรูปภาพแต่ละหน้า (Image Extraction)
           const atHome = await axios.get(`${MANGADEX_API}/at-home/server/${ch.id}`);
           const baseUrl = atHome.data.baseUrl;
           const hash = atHome.data.chapter.hash;
           const pages = atHome.data.chapter.data.map(file => `${baseUrl}/data/${hash}/${file}`);

           if (pages.length > 0) {
             realChapters.push({
                chapterNum: parseFloat(ch.attributes.chapter) || 0,
                title: ch.attributes.title || `Chapter ${ch.attributes.chapter}`,
                content: pages,
                updatedAt: new Date()
             });
           }
         } catch (e) {
           // เงียบไว้ ถ้าดึงรูปไม่ได้ (เช่น เน็ตกระตุก)
         }
      }

      // 3. บันทึกลง DB
      if (realChapters.length > 0) {
        await Manga.findOneAndUpdate(
          { title: title },
          {
            title,
            imageUrl,
            synopsis: item.attributes.description.en || "No synopsis",
            chapters: realChapters.reverse(), // เรียง 1 -> ใหม่
            updatedAt: new Date(),
            isPremium: Math.random() < 0.2 // สุ่ม 20% เป็น Premium
          },
          { upsert: true, new: true }
        );
        console.log(`      ✅ Secured ${realChapters.length} chapters.`);
      } else {
        console.log(`      ❌ Failed to secure content.`);
      }
      
      // พัก 1 วิ (กันโดนแบน)
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n🎉 MISSION COMPLETE: จัดเต็มให้แล้วครับลูกพี่!`);
    process.exit(0);

  } catch (err) {
    console.error(`💀 ERROR: ${err.message}`);
    process.exit(1);
  }
}

hunt();