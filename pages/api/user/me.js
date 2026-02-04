import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import Manga from '../../../models/Manga'; // ต้อง Import เพื่อ Populate

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const { userId } = req.query; // รับ userId จาก Frontend

  if (!userId) return res.status(401).json({ message: 'No Token Provided' });

  await dbConnect();

  try {
    // 1. ค้นหา User และ "Populate" (แปลง ID เป็นข้อมูลจริง) ของ favorites
    const user = await User.findById(userId)
      .select('-password') // ไม่เอารหัสผ่าน
      .populate('favorites', 'title imageUrl slug chapters'); // ดึงเฉพาะข้อมูลจำเป็นของมังงะ

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isPremium: user.isPremium,
        points: user.points,
        profilePic: user.profilePic,
        favorites: user.favorites, // ✅ ส่งรายการมังงะจริงกลับไป
        unlockedContent: user.unlockedContent
      }
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}