import connectDB from '../../../lib/mongodb';
import Manga from '../../../models/Manga';

export default async function handler(req, res) {
  const { id, chapter } = req.query;
  try {
    await connectDB();
    const manga = await Manga.findById(id);
    if (!manga) return res.status(404).json({ message: "Manga Not Found" });

    const chIdx = parseInt(chapter) - 1;
    const targetChapter = manga.chapters && manga.chapters[chIdx];

    return res.status(200).json({
      title: `${manga.title} - Chapter ${chapter}`,
      pages: targetChapter ? targetChapter.content : []
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}