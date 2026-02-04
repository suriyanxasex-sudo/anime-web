import mongoose from 'mongoose';

/**
 * JPLUS_COMMENT_SCHEMA v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ระบบคอมเมนต์อัจฉริยะ รองรับการสปอยล์และ Moderation
 */

const CommentSchema = new mongoose.Schema({
  // 1. 🔗 RELATION (เชื่อมโยงข้อมูล)
  mangaId: { 
    type: mongoose.Schema.Types.ObjectId, // ⚡️ แก้เป็น ObjectId เพื่อ Link กับ MangaSchema
    ref: 'Manga', 
    required: true, 
    index: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 2. 👤 CACHED PROFILE (เก็บชื่อ/รูป ไว้เลย ไม่ต้องเสียเวลา Join ตาราง User บ่อยๆ)
  username: { type: String, required: true },
  profilePic: { type: String, default: "" },

  // 3. 💬 CONTENT (เนื้อหา)
  text: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [1000, 'Comment too long (max 1000 chars)'] 
  },
  
  // 4. 🛡️ MODERATION & FEATURES (ระบบคุมความประพฤติ)
  isSpoiler: { type: Boolean, default: false }, // กดสปอยล์แล้วข้อความจะเบลอ
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // เก็บว่าใครกดไลก์ไปแล้ว (กันปั๊มไลก์)
  
  status: { 
    type: String, 
    default: "ACTIVE", 
    enum: ["ACTIVE", "HIDDEN", "BANNED"] // สถานะคอมเมนต์
  },
  
  deviceInfo: { type: String, default: "Unknown_Device" }, // เก็บข้อมูลเครื่องที่พิมพ์ (iPhone, Android, PC)
  
  // 5. 🧵 THREAD (เผื่ออนาคตทำระบบตอบกลับ)
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },

}, { 
  timestamps: true, // สร้าง createdAt, updatedAt อัตโนมัติ
  versionKey: false 
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);