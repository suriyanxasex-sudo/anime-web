import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import Anime from '../../../models/Anime'; // ต้อง import มาเพื่อให้ populate ทำงานได้

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
  
  await dbConnect();
  
  try {
    const { username, animeId } = req.body;
    
    // 1. หา User ก่อน
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้' });

    // 2. ตรวจสอบสถานะ (Toggle Logic)
    const targetId = animeId.toString();
    const isFav = user.favorites.some(id => id.toString() === targetId);
    
    if (isFav) {
      // ถ้ามีอยู่แล้วให้ "เอาออก"
      await User.updateOne(
        { username },
        { $pull: { favorites: animeId } }
      );
    } else {
      // ถ้ายังไม่มีให้ "เพิ่มเข้า"
      await User.updateOne(
        { username },
        { $addToSet: { favorites: animeId } } // $addToSet ป้องกันข้อมูลซ้ำ
      );
    }
    
    // 3. ดึงข้อมูลใหม่แบบ Populate เพื่อส่งกลับไปแสดงผลหน้าบ้านทันที
    // เราต้องดึงข้อมูลจากโมเดล Anime (ที่เราใช้เก็บมังงะ) มาโชว์รูปและชื่อเรื่อง
    const updatedUser = await User.findOne({ username }).populate({
      path: 'favorites',
      model: 'Anime' 
    });

    res.status(200).json({ 
      success: true, 
      isFavorite: !isFav, 
      favorites: updatedUser.favorites 
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}