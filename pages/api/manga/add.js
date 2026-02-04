import connectDB from '../../../lib/mongodb';
import Manga from '../../../models/Manga';
import User from '../../../models/User';

/**
 * JPLUS_MANGA_FORGE v3.0
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: สร้างรายการมังงะใหม่ (เฉพาะ Admin เท่านั้นที่มีสิทธิ์)
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: "Method Not Allowed" });

  // 1. [AUTH_GUARD] - รับ userId เพื่อเช็คสิทธิ์
  const { userId, title, imageUrl, isPremium, sourceUrl } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: "UNAUTHORIZED: Access Denied" });
  }

  if (!title) {
    return res.status(400).json({ success: false, message: "MISSING_TITLE: กรุณาระบุชื่อเรื่อง" });
  }

  try {
    await connectDB();

    // 2. [ADMIN_CHECK] - ตรวจสอบว่าเป็นลูกพี่จริงไหม
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: "FORBIDDEN: You are not the Overlord!" });
    }

    // 3. [DUPLICATE_CHECK] - กันชื่อซ้ำ
    const existingManga = await Manga.findOne({ title: title.trim() });
    if (existingManga) {
      return res.status(400).json({ success: false, message: "DUPLICATE_ENTRY: มังงะเรื่องนี้มีอยู่แล้ว" });
    }

    // 4. [CREATION] - สร้างมังงะใหม่
    const newManga = await Manga.create({
      title: title.trim(),
      imageUrl: imageUrl || "https://via.placeholder.com/300x450?text=No+Cover",
      isPremium: isPremium || false,
      sourceUrl: sourceUrl || "",
      chapters: [], // เริ่มต้นเป็นว่างเปล่า รอ Hunter Bot มาเติม
      updatedAt: new Date()
    });

    console.log(`[MANGA_CREATED] Admin ${user.username} forged a new entry: ${title}`);

    return res.status(201).json({ 
      success: true, 
      message: "MANGA_FORGED_SUCCESSFULLY",
      data: newManga 
    });

  } catch (error) {
    console.error("Forge Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}