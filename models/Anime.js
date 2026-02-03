import mongoose from 'mongoose';

/** * โครงสร้างข้อมูล Anime/Manga สำหรับระบบ Jplus
 * ใช้สำหรับเก็บข้อมูลที่ดึงมาจาก API ต่างประเทศ
 */
const AnimeSchema = new mongoose.Schema({
  mangaId: { 
    type: String, 
    required: true, 
    unique: true // ป้องกันมังงะซ้ำในหน้าแรก
  },
  title: { type: String, required: true },
  image: String,
  description: String,
  rating: { type: Number, default: 0 },
  type: { type: String, default: 'Manga' }, // Manga, Manhwa, etc.
  category: [String],
  lastUpdate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Anime || mongoose.model('Anime', AnimeSchema);