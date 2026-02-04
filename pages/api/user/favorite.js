import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import Manga from '../../../models/Manga'; // ⚠️ ต้อง Import Manga มาด้วย ไม่งั้น Populate ไม่ติด

/**
 * JPLUS_FAVORITE_CONTROLLER v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: จัดการรายการโปรดแบบ RESTful (GET = ดึง, POST = แก้ไข)
 */

export default async function handler(req, res) {
  await dbConnect();

  // 🟢 [METHOD: GET] - ดึงรายการโปรดทั้งหมด (Fetch Collection)
  if (req.method === 'GET') {
    const { username } = req.query;

    if (!username) return res.status(400).json({ success: false, message: 'MISSING_USERNAME' });

    try {
      // ค้นหา User และขยายข้อมูล (Populate) ตัว Favorites ให้กลายเป็น Object มังงะเต็มๆ
      const user = await User.findOne({ username: username.toLowerCase() })
                             .populate('favorites'); // Mongoose จะวิ่งไปดูใน Manga Collection ให้เอง
      
      if (!user) return res.status(404).json({ success: false, message: 'USER_NOT_FOUND' });

      // กรองค่า null ทิ้ง (เผื่อมังงะเรื่องนั้นโดนลบจาก DB ไปแล้ว แต่ ID ยังค้างใน User)
      const cleanFavorites = user.favorites.filter(item => item !== null);

      return res.status(200).json({ 
        success: true, 
        count: cleanFavorites.length,
        favorites: cleanFavorites 
      });

    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // 🟠 [METHOD: POST] - เพิ่ม/ลบ รายการ (Add/Remove)
  if (req.method === 'POST') {
    const { username, mangaId, action } = req.body; // รับ action: 'add' หรือ 'remove'

    if (!username || !mangaId) return res.status(400).json({ success: false, message: 'MISSING_DATA' });

    try {
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, message: 'USER_NOT_FOUND' });

      // แปลง ID เป็น String เพื่อให้เช็คง่ายๆ
      const exists = user.favorites.map(id => id.toString()).includes(mangaId);

      // --- LOGIC การจัดการ Favorites ---
      
      // 1. สั่งลบ (Explicit Remove) หรือ มีอยู่แล้วและไม่ได้สั่งเพิ่ม (Toggle Remove)
      if (action === 'remove' || (exists && action !== 'add')) {
        if (exists) {
          user.favorites.pull(mangaId); // ใช้คำสั่ง pull ของ Mongoose เพื่อดึงออก
          await user.save();
          return res.status(200).json({ success: true, message: 'REMOVED', action: 'remove' });
        } else {
          // สั่งลบ แต่ไม่มีของอยู่แล้ว (ก็ถือว่าสำเร็จ)
          return res.status(200).json({ success: true, message: 'ALREADY_REMOVED', action: 'remove' });
        }
      } 
      
      // 2. สั่งเพิ่ม (Add)
      else {
        if (!exists) {
          user.favorites.push(mangaId);
          await user.save();
          return res.status(200).json({ success: true, message: 'ADDED', action: 'add' });
        } else {
          return res.status(200).json({ success: true, message: 'ALREADY_IN_COLLECTION', action: 'add' });
        }
      }

    } catch (error) {
      console.error(`[FAV_ERROR] ${error.message}`);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // ถ้าส่ง Method อื่นมา
  return res.status(405).json({ success: false, message: 'METHOD_NOT_ALLOWED' });
}