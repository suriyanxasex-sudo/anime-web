import connectDB from '../../../lib/mongodb';
import Manga from '../../../models/Manga';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: "Method Not Allowed" });
  try {
    await connectDB();
    const { title, imageUrl, isPremium } = req.body;
    const newManga = await Manga.create({
      title,
      imageUrl: imageUrl || "https://via.placeholder.com/300x450",
      isPremium: isPremium || false,
      updatedAt: new Date()
    });
    return res.status(201).json({ success: true, data: newManga });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}