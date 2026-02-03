import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  animeId: { type: String, required: true, index: true }, // ID มังงะที่คอมเมนต์
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  profilePic: { type: String, default: "" },
  text: { type: String, required: true, trim: true },
  likes: { type: Number, default: 0 },
  isSpoiler: { type: Boolean, default: false }, // ระบบดักสปอยล์
  deviceInfo: { type: String, default: "Jplus_Web_Client" },
  status: { type: String, default: "ACTIVE" } // ACTIVE, BANNED, PENDING
}, { 
  timestamps: true, // เก็บเวลาสร้างและแก้ไขอัตโนมัติ
  versionKey: false 
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);