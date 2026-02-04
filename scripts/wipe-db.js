const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function wipe() {
  if (!process.env.MONGODB_URI) { 
    console.error("❌ FATAL: ไม่เจอ MONGODB_URI ใน .env.local"); 
    process.exit(1); 
  }

  try {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    const dbName = mongoose.connection.name;
    console.log(`🎯 Target Database: [ ${dbName} ]`);
    console.log("🔥 STARTING TOTAL PURGE PROTOCOL...");

    // 1. ดึงรายชื่อ Collection ทั้งหมดที่มีใน Database
    const collections = await mongoose.connection.db.collections();

    if (collections.length === 0) {
      console.log("✅ Database ว่างเปล่าอยู่แล้ว (ไม่มีอะไรให้ลบ)");
    } else {
      // 2. วนลูป "ระเบิดทิ้ง" ทีละห้อง
      for (let collection of collections) {
        console.log(`   💣 Dropping collection: ${collection.collectionName}`);
        await collection.drop(); // คำสั่ง Drop คือลบทั้งข้อมูลและโครงสร้างทิ้งทันที
      }
      console.log(`✨ SUCCESS: ล้างบางเรียบร้อย! Database [${dbName}] สะอาด 100%`);
    }

  } catch (e) { 
    console.error("☠️ ERROR:", e.message); 
  } finally { 
    await mongoose.connection.close(); 
    console.log("🔌 Disconnected.");
    process.exit(0); 
  }
}

wipe();