import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  profilePic: { type: String },
  animeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);