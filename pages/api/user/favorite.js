import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  
  const { username, animeId } = req.body;
  const user = await User.findOne({ username });
  
  if (!user) return res.status(404).json({ success: false });

  // เช็คว่ามีอยู่แล้วไหม? ถ้ามีให้ลบออก (Unlike), ถ้าไม่มีให้เพิ่ม (Like)
  const isFav = user.favorites.includes(animeId);
  
  if (isFav) {
    user.favorites = user.favorites.filter(id => id.toString() !== animeId);
  } else {
    user.favorites.push(animeId);
  }
  
  await user.save();
  
  // ส่งข้อมูลรายการโปรดล่าสุดกลับไป
  const populatedUser = await User.findOne({ username }).populate('favorites');
  res.json({ success: true, favorites: populatedUser.favorites });
}