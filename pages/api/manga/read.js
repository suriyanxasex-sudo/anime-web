import connectDB from '../../../lib/mongodb';
import Manga from '../../../models/Manga';
import User from '../../../models/User';

/**
 * JPLUS_SECURE_READER v3.0
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: ส่งข้อมูลภาพมังงะ พร้อมระบบป้องกันการแอบอ่าน (Premium Guard)
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: "Method Not Allowed" });

  const { id, chapter, userId } = req.query; // ⚠️ ต้องส่ง userId มาด้วยนะ ถ้าจะอ่านเรื่อง Premium

  if (!id) return res.status(400).json({ message: "MISSING_MANGA_ID" });

  try {
    await connectDB();

    // 1. [FETCH_DATA] - ดึงข้อมูลมังงะ
    const manga = await Manga.findById(id);
    if (!manga) return res.status(404).json({ message: "Manga not found" });

    // 2. [CHAPTER_RESOLVER] - แปลงเลขตอนเป็น Index (Safe Mode)
    // หมายเหตุ: ระบบนี้ยังอิงตาม Array Index ตาม Scraper เดิมของลูกพี่
    // ถ้า Scraper เก็บ field 'chapterNumber' ไว้ จะเขียน Logic ได้แม่นกว่านี้
    const chNum = parseInt(chapter) || 1;
    const chIdx = chNum - 1;

    // เช็คว่ามีตอนที่ขอไหม
    if (!manga.chapters || !manga.chapters[chIdx]) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const targetChapter = manga.chapters[chIdx];

    // 3. [PREMIUM_GUARD] - ระบบป้องกันการขโมยอ่าน 🛡️
    if (manga.isPremium) {
      if (!userId) {
        return res.status(403).json({ message: "ACCESS_DENIED: กรุณาล็อกอินเพื่ออ่านเรื่อง Premium" });
      }

      // เช็คสิทธิ์ User
      const user = await User.findById(userId);
      
      // เงื่อนไขผ่าน: เป็น Admin หรือ เคยซื้อตอนนี้แล้ว
      const isOwner = user && (
        user.isAdmin || 
        (user.unlockedContent && user.unlockedContent.some(cId => cId.toString() === targetChapter._id.toString()))
      );

      if (!isOwner) {
        return res.status(402).json({ 
          message: "PAYMENT_REQUIRED: ตอนนี้ถูกล็อก กรุณาปลดล็อกก่อน",
          price: targetChapter.price || 50,
          chapterId: targetChapter._id
        });
      }
    }

    // 4. [CONTENT_DELIVERY] - ถ้าผ่านหมด ก็ส่งรูปไปเลย!
    if (!targetChapter.content || targetChapter.content.length === 0) {
      return res.status(404).json({ message: "NO_IMAGES_AVAILABLE" });
    }

    // (Optional) คำนวณตอนถัดไป/ก่อนหน้า เพื่อให้ Frontend ทำปุ่มง่ายขึ้น
    const nextCh = (manga.chapters[chNum]) ? chNum + 1 : null;
    const prevCh = (chNum > 1) ? chNum - 1 : null;

    return res.status(200).json({
      success: true,
      title: `${manga.title} - ${targetChapter.title || 'Chapter ' + chNum}`,
      pages: targetChapter.content,
      // Metadata สำหรับ Navigation
      meta: {
        current: chNum,
        next: nextCh,
        prev: prevCh,
        isPremium: manga.isPremium
      }
    });

  } catch (error) {
    console.error("Reader API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}