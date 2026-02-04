const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkDB() {
  if (!process.env.MONGODB_URI) { console.error("❌ ไม่เจอ MONGODB_URI"); process.exit(1); }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Connected...");

    // ลองดึงจาก Collection 'mangas' (MongoDB จะเติม s ให้เองอัตโนมัติ)
    const count = await mongoose.connection.db.collection('mangas').countDocuments();
    
    console.log(`\n📦 จำนวนมังงะในถัง: ${count} เรื่อง`);

    if (count > 0) {
      const examples = await mongoose.connection.db.collection('mangas').find().limit(3).toArray();
      console.log("ตัวอย่าง 3 เรื่องแรก:");
      examples.forEach(m => console.log(` - ${m.title} (Chapters: ${m.chapters?.length || 0})`));
    } else {
      console.log("❌ ว่างเปล่า! (Hunter อาจจะทำงานพลาด)");
    }

  } catch (e) { console.error(e); } 
  finally { await mongoose.connection.close(); }
}

checkDB();