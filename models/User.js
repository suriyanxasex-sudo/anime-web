import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'admin' หรือ 'user'
  isPremium: { type: Boolean, default: false },
  profilePic: { type: String },
  // --- เพิ่มบรรทัดนี้ ---
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }] 
});

export default mongoose.models.User || mongoose.model('User', UserSchema);