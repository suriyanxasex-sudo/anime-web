import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';

export default async function handler(req, res) {
  const { query: { id }, method } = req;
  await dbConnect();

  if (method === 'GET') {
    try {
      // 1. ค้นหาข้อมูลล่าสุด
      const anime = await Anime.findById(id);
      
      if (!anime) {
        return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลอนิเมะ' });
      }

      // 2. อัปเดตยอดวิวแยกต่างหาก (เพื่อไม่ให้กวนข้อมูลที่จะส่งออก)
      await Anime.findByIdAndUpdate(id, { $inc: { views: 1 } });

      // 3. ส่งข้อมูลตัวที่ Get มาได้ออกไปตรงๆ
      res.status(200).json(anime);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (method === 'DELETE') {
    await Anime.findByIdAndDelete(id);
    res.json({ success: true });
  }
}