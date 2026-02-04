import mongoose from 'mongoose';

const MangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, default: "https://via.placeholder.com/300x450" },
  isPremium: { type: Boolean, default: false },
  price: { type: Number, default: 50 },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Manga || mongoose.model('Manga', MangaSchema);