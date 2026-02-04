import mongoose from 'mongoose';

/**
 * JPLUS_UNIFIED_SCHEMA v4.0 (THE ONE)
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: โมเดลเดียวจบ เก็บครบทุกอย่าง (Manga + Premium + Stats)
 */

const MangaSchema = new mongoose.Schema({
  // 1. 🆔 IDENTITY (ข้อมูลระบุตัวตน)
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    index: true, // ค้นหาไวปานวาร์ป
    trim: true 
  },
  
  // 2. 🎨 VISUALS (รูปภาพ)
  imageUrl: { 
    type: String, 
    required: [true, 'Cover image is required'] 
  },
  
  // 3. 📝 METADATA (รายละเอียด - รวมร่างจาก Anime.js)
  description: { 
    type: String, 
    default: "No description available." 
  },
  author: { 
    type: String, 
    default: "Unknown" 
  },
  type: { 
    type: String, 
    default: 'Manga',
    enum: ['Manga', 'Manhwa', 'Manhua', 'Novel'] // ประเภท
  },
  tags: [String], // หมวดหมู่ (Action, Drama, Isekai)
  
  // 4. 💎 STATUS & ECONOMY (ระบบ VIP และสถิติ)
  isPremium: { 
    type: Boolean, 
    default: false // ถ้าเป็น true ต้องจ่ายตังค์ถึงจะอ่านได้
  },
  rating: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  status: { 
    type: String, 
    default: 'Ongoing',
    enum: ['Ongoing', 'Completed', 'Hiatus']
  },

  // 5. 🤖 SYSTEM (ระบบบอท)
  sourceUrl: { type: String, default: "" }, // ลิ้งก์ต้นฉบับ (Neko/Mangadex) เอาไว้ให้ Hunter Bot ตามไปดูด

  // 6. 📚 CONTENT (เนื้อหา)
  chapters: [{
    title: String,
    chapterNumber: Number,
    content: [String], // ลิ้งก์รูปภาพในตอน
    sourceUrl: String, // ลิ้งก์ตอนต้นฉบับ
    createdAt: { type: Date, default: Date.now }
  }]

}, { 
  timestamps: true // ✅ สร้าง createdAt และ updatedAt ให้อัตโนมัติ
});

// ส่งออกแค่ตัวเดียว "Manga" จบ!
export default mongoose.models.Manga || mongoose.model('Manga', MangaSchema);