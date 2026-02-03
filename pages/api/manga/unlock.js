import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Manga from '../../../models/Manga';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: "Method Not Allowed" });
  const { userId, mangaId, chapterId } = req.body;

  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === 'admin') return res.status(200).json({ success: true, message: "Welcome Overlord Joshua" });
    if (user.unlockedContent.includes(chapterId)) return res.status(200).json({ success: true, message: "Already Unlocked" });

    const manga = await Manga.findById(mangaId);
    const chapter = manga.chapters.id(chapterId);
    const price = chapter.price || 50;

    if (user.points < price) {
      return res.status(403).json({ success: false, message: "แต้มไม่พอ กรุณาเติมเงินผ่าน PromptPay ของ Joshua", required: price });
    }

    user.points -= price;
    user.unlockedContent.push(chapterId);
    await user.save();

    return res.status(200).json({ success: true, message: "ปลดล็อกสำเร็จ!", remainingPoints: user.points });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}