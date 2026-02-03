import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  isPremium: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  // เก็บเป็น Array ของ ID ที่อ้างอิงไปยัง Model Manga (หรือ Anime เดิม)
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manga' }], 
  metadata: {
    lastLogin: { type: Date, default: Date.now }
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);