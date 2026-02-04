import mongoose from 'mongoose';

const MangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  isPremium: { type: Boolean, default: false },
  chapters: [{
    title: String,
    content: [String], // นี่คือที่เก็บ URL รูปภาพแต่ละหน้า
    updatedAt: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Manga || mongoose.model('Manga', MangaSchema);