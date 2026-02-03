import mongoose from 'mongoose';

const MangaSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, index: true }, 
  imageUrl: { type: String, required: true },
  synopsis: { type: String, default: "เนื้อหายังไม่ได้รับการสรุปในระบบฐานข้อมูลหลัก" },
  score: { type: Number, default: 0 },
  status: { type: String, default: "ONGOING" }, 
  author: { type: String, default: "Unknown Artist" },
  genres: [{ type: String }],
  // ระบบเก็บข้อมูลตอนแบบละเอียด (Multi-Source Support)
  chapters: [{
    chapterNum: { type: Number, required: true },
    chapterTitle: { type: String },
    sourceUrl: { type: String },
    provider: { type: String }, 
    scrapedDate: { type: Date, default: Date.now }
  }],
  metadata: {
    totalChaptersFound: { type: Number, default: 0 },
    lastSyncStatus: String,
    executionTimeMs: Number
  }
}, { 
  timestamps: true,
  versionKey: false 
});

export default mongoose.models.Manga || mongoose.model('Manga', MangaSchema);