import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime'; // หรือโมเดลที่เก็บข้อมูลมังงะ/หนัง

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { key } = req.body;

  // ตรวจสอบรหัสลับ Joshua
  if (key !== 'joshua7465') {
    return res.status(403).json({ success: false, message: 'รหัสลับไม่ถูกต้อง' });
  }

  await dbConnect();

  try {
    // ล้างข้อมูลทั้งหมดในคอลเลกชันมังงะ/อนิเมะ
    await Anime.deleteMany({}); 
    
    res.status(200).json({ success: true, message: 'ล้างข้อมูลคลังมังงะเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด: ' + error.message });
  }
}