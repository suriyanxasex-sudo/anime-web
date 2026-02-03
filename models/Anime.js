import mongoose from 'mongoose';

const ServerSchema = new mongoose.Schema({
  name: { type: String, default: 'Server 1' },
  url: String,
  quality: { type: String, default: '720p' },
  isPremium: { type: Boolean, default: false }
});

const EpisodeSchema = new mongoose.Schema({
  number: Number,
  title: String,
  servers: [ServerSchema]
});

const AnimeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: String,
  synopsis: String,
  category: String,
  views: { type: Number, default: 0 },
  episodes: [EpisodeSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Anime || mongoose.model('Anime', AnimeSchema);