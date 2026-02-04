import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Manga from '../../../models/Manga';

/**
 * JPLUS_TRANSACTION_GATEWAY v3.0
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: ระบบปลดล็อกเนื้อหา (ตัดแต้ม) ที่แม่นยำและยุติธรรม
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: "Method Not Allowed" });
  
  const { userId, mangaId, chapterId } = req.body;

  if (!userId || !mangaId || !chapterId) {
    return res.status(400).json({ success: false, message: "MISSING_TRANSACTION_DATA" });
  }

  try {
    await connectDB();

    // 1. [USER_CHECK] - หาตัวคนซื้อ
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 2. [GOD_MODE_BYPASS] - ถ้าเป็น Admin (ลูกพี่เอง) ให้อ่านฟรีไปเลย
    if (user.isAdmin) {
      return res.status(200).json({ 
        success: true, 
        message: "ACCESS_GRANTED_BY_OVERLORD_DECREE", 
        remainingPoints: user.points 
      });
    }

    // 3. [DUPLICATE_CHECK] - เช็คว่าเคยซื้อไปแล้วหรือยัง?
    // (แปลง ObjectId เป็น String เพื่อความชัวร์ในการเปรียบเทียบ)
    const alreadyUnlocked = user.unlockedContent && user.unlockedContent.some(id => id.toString() === chapterId);
    
    if (alreadyUnlocked) {
      return res.status(200).json({ 
        success: true, 
        message: "ALREADY_OWNED", 
        remainingPoints: user.points 
      });
    }

    // 4. [PRODUCT_CHECK] - ดึงข้อมูลมังงะและตอนที่จะซื้อ
    const manga = await Manga.findById(mangaId);
    if (!manga) return res.status(404).json({ success: false, message: "Manga not found" });

    // ถ้ามังงะเรื่องนี้ "ไม่พรีเมียม" (isPremium = false) ให้ปลดล็อกฟรีๆ เลย
    if (!manga.isPremium) {
       return res.status(200).json({ success: true, message: "FREE_CONTENT_ACCESS" });
    }

    // หา Chapter ย่อย (Subdocument)
    const chapter = manga.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ success: false, message: "Chapter not found" });

    // 5. [PRICING_LOGIC] - กำหนดราคา (ถ้าไม่มีราคาในตอน ให้ใช้ราคามาตรฐาน 50)
    // ลูกพี่อาจต้องไปเพิ่ม field 'price' ใน Manga Schema ถ้าอยากกำหนดราคาแยกแต่ละตอน
    const price = chapter.price || 50; 

    // 6. [BALANCE_CHECK] - ตังค์พอไหม?
    if (user.points < price) {
      return res.status(403).json({ 
        success: false, 
        message: "INSUFFICIENT_FUNDS: แต้มไม่พอ! กรุณาเติมเงิน", 
        required: price,
        current: user.points
      });
    }

    // 7. [EXECUTE_TRANSACTION] - หักตังค์ + ยัดของใส่กระเป๋า
    user.points -= price;
    
    // ตรวจสอบว่ามี Array นี้หรือยัง ถ้าไม่มีให้สร้างใหม่
    if (!user.unlockedContent) user.unlockedContent = [];
    user.unlockedContent.push(chapterId);
    
    await user.save();

    console.log(`[SALE] User ${user.username} bought Chapter ${chapter.title || chapterId} for ${price} pts.`);

    return res.status(200).json({ 
      success: true, 
      message: "TRANSACTION_COMPLETE", 
      remainingPoints: user.points 
    });

  } catch (error) {
    console.error("Unlock Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}