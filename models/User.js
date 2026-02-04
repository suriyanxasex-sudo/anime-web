import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, default: "JOSHUA_OVERLORD" },
  points: { type: Number, default: 1000 }, // เริ่มต้นให้ 1000 แต้ม
  role: { type: String, default: 'admin' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);