const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

// 🔥 CONFIG: ใส่เว็บที่ลูกพี่จะดูดตรงนี้
const TARGET = {
  url: 'https://www.nekopost.net/manga/12345', // <--- เปลี่ยนเป็น URL เรื่องที่จะดูด
  selectors: {
    // อันนี้ตัวอย่างของ Nekopost (ถ้าเว็บอื่น ต้องคลิกขวา Inspect แก้ Class เอาเองนะลูกพี่)
    title: '.project-info-header h1',    
    cover: '.project-info-header img',
    chapterList: '.chapter-list-item a',
    chapterImages: '#page-content img' // Class รูปในหน้าอ่าน
  }
};

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
  if (!process.env.MONGODB_URI) { console.error("❌ ไม่เจอ MONGODB_URI (อย่าลืม set ค่าก่อนรัน)"); process.exit(1); }
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`🤖 HUNTER BOT STARTED: ${TARGET.url}`);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');

  try {
    // 1. ไปหน้าหลัก
    await page.goto(TARGET.url, { waitUntil: 'networkidle2', timeout: 60000 });

    const data = await page.evaluate((sel) => {
      const title = document.querySelector(sel.title)?.innerText.trim() || 'Unknown';
      const cover = document.querySelector(sel.cover)?.src || '';
      const chapters = Array.from(document.querySelectorAll(sel.chapterList)).map(a => ({
        title: a.innerText.trim(),
        sourceUrl: a.href
      })).reverse(); // เรียงตอน 1 ขึ้นก่อน
      return { title, imageUrl: cover, chapters };
    }, TARGET.selectors);

    console.log(`✅ เจอเรื่อง: ${data.title} (${data.chapters.length} ตอน)`);

    // เตรียม Array เก็บข้อมูล
    const finalChapters = [];

    // 2. วนลูปดูดรูปทีละตอน
    for (const ch of data.chapters) {
      console.log(`   👉 กำลังเจาะ: ${ch.title}`);
      const chPage = await browser.newPage();
      
      try {
        await chPage.goto(ch.sourceUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // รอรูปโหลดแป๊บนึง
        await new Promise(r => setTimeout(r, 2000));

        const images = await chPage.evaluate((sel) => {
          return Array.from(document.querySelectorAll(sel)).map(img => 
            img.src || img.dataset.src || img.getAttribute('data-original')
          ).filter(src => src);
        }, TARGET.selectors.chapterImages);

        if (images.length > 0) {
          console.log(`      📸 ได้มา ${images.length} รูป`);
          finalChapters.push({ title: ch.title, content: images, sourceUrl: ch.sourceUrl });
        } else {
          console.log(`      ⚠️ ไม่เจอรูป (ข้าม)`);
        }
      } catch (e) { console.error(`      ❌ Error: ${e.message}`); }
      
      await chPage.close();
    }

    // 3. บันทึกลง DB
    if (finalChapters.length > 0) {
      // ลบของเก่าออกก่อน (ถ้ามีชื่อซ้ำ)
      await Manga.findOneAndDelete({ title: data.title });
      
      await Manga.create({
        title: data.title,
        imageUrl: data.imageUrl,
        isPremium: true,
        sourceUrl: TARGET.url,
        chapters: finalChapters
      });
      console.log(`🎉 SUCCESS: บันทึกข้อมูลเสร็จสิ้น!`);
    }

  } catch (err) { console.error("FATAL ERROR:", err); }
  finally { await browser.close(); mongoose.connection.close(); process.exit(0); }
}
run();