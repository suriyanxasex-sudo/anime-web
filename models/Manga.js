import mongoose from 'mongoose';

const MangaSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  isPremium: Boolean,
  sourceUrl: { type: String, default: "" }, // เก็บลิ้งก์ต้นทาง
  chapters: [{ 
    title: String, 
    content: [String], // เก็บลิ้งก์รูปภาพ
    sourceUrl: String  // เก็บลิ้งก์ตอนต้นทาง
  }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Manga || mongoose.model('Manga', MangaSchema);