import mongoose from 'mongoose';

/**
 * JPLUS_COMMENT_SCHEMA v3.0
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * สถานะ: UPGRADED - Social Features & Spoiler Protection
 */

const CommentSchema = new mongoose.Schema({
  // 1. Who? (คนเม้น)
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: { type: String, required: true }, // เก็บไว้โชว์เลย ไม่ต้อง join บ่อยๆ (Performance)
  profilePic: { type: String },
  
  // 2. Where? (เม้นที่ไหน)
  // ⚡️ FIX: แก้จาก animeId เป็น mangaId ให้ตรงกับโปรเจกต์
  mangaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Manga', 
    required: true 
  },
  chapterIndex: { type: Number }, // (Optional) ถ้าเม้นในตอน ให้ระบุเลขตอนด้วย
  
  // 3. What? (เนื้อหา)
  text: { 
    type: String, 
    required: [true, 'Comment cannot be empty'],
    trim: true,
    maxlength: [1000, 'Comment is too long (max 1000 chars)']
  },
  
  // 4. Features (ลูกเล่น)
  isSpoiler: { type: Boolean, default: false }, // ซ่อนข้อความถ้าสปอยล์
  likes: { type: Number, default: 0 }, // ยอดไลก์
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // เก็บว่าใครไลก์ไปแล้วบ้าง

}, { 
  timestamps: true // ✅ สร้าง createdAt, updatedAt อัตโนมัติ
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);