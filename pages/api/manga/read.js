import connectDB from '../../../lib/mongodb';
import Manga from '../../../models/Manga';

export default async function handler(req, res) {
  const { id, chapter } = req.query;
  try {
    await connectDB();
    const manga = await Manga.findById(id);
    if (!manga) return res.status(404).json({ message: "Manga not found" });

    // หา Index ของตอน (เริ่มที่ 0)
    const chIdx = parseInt(chapter) - 1;
    const targetChapter = manga.chapters && manga.chapters[chIdx];

    // ถ้าหาตอนไม่เจอ หรือตอนนั้นไม่มีรูปภาพ
    if (!targetChapter || !targetChapter.content || targetChapter.content.length === 0) {
      return res.status(404).json({ message: "No content in this chapter" });
    }

    return res.status(200).json({
      title: `${manga.title} - ${targetChapter.title}`,
      pages: targetChapter.content // ส่ง Array ของ URL รูปภาพออกไป
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}