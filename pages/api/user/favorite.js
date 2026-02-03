import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import Manga from '../../../models/Manga';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'METHOD_NOT_ALLOWED' });

  const { username, animeId } = req.body;
  if (!username) return res.status(400).json({ success: false, message: 'IDENTIFIER_REQUIRED' });

  await dbConnect();

  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'USER_NOT_FOUND' });

    // กรณีที่ 1: ดึงข้อมูลรายการโปรดทั้งหมด (Populate ข้อมูลมังงะจาก Model Manga)
    if (!animeId) {
      // ดึง User และขยายข้อมูล (Populate) จาก ID ใน array favorites ให้เป็นข้อมูลมังงะตัวเต็ม
      const userWithFavs = await User.findOne({ username: username.toLowerCase() })
                                     .populate('favorites'); 
      
      console.log(`[FAV_SYSTEM] Fetched ${userWithFavs.favorites.length} items for ${username}`);
      return res.status(200).json({ success: true, favorites: userWithFavs.favorites });
    }

    // กรณีที่ 2: เพิ่มหรือลบรายการโปรด (Toggle System)
    const isExist = user.favorites.includes(animeId);
    if (isExist) {
      // ถ้ามีอยู่แล้วให้ลบออก
      user.favorites = user.favorites.filter(id => id.toString() !== animeId);
      await user.save();
      return res.status(200).json({ success: true, message: 'REMOVED_FROM_COLLECTION', action: 'remove' });
    } else {
      // ถ้ายังไม่มีให้เพิ่มเข้าไป
      user.favorites.push(animeId);
      await user.save();
      return res.status(200).json({ success: true, message: 'ADDED_TO_COLLECTION', action: 'add' });
    }

  } catch (error) {
    console.error(`[CRITICAL_FAV_ERR] ${error.message}`);
    return res.status(500).json({ success: false, message: 'DATABASE_ERROR', error: error.message });
  }
}