// ไฟล์: pages/api/user/favorite.js
import dbConnect from '../../../lib/mongodb'; // ถอย 3 ขั้น (user -> api -> pages -> root)
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  
  const { username, animeId } = req.body;
  const user = await User.findOne({ username });
  
  if (!user) return res.status(404).json({ success: false });

  // แปลง animeId เป็น String เพื่อเทียบ
  const targetId = animeId.toString();
  
  // เช็คว่ามีไหม (ใช้ includes ไม่ได้กับ ObjectId บางทีต้องแปลงก่อน)
  const isFav = user.favorites.some(id => id.toString() === targetId);
  
  if (isFav) {
    // เอาออก
    user.favorites = user.favorites.filter(id => id.toString() !== targetId);
  } else {
    // เพิ่มเข้า
    user.favorites.push(animeId);
  }
  
  await user.save();
  
  // ส่งค่ากลับ
  const populatedUser = await User.findOne({ username }).populate('favorites');
  res.json({ success: true, favorites: populatedUser.favorites });
}