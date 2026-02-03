import dbConnect from '../../lib/mongodb';
import Comment from '../../models/Comment';

export default async function handler(req, res) {
  await dbConnect(); // เชื่อมต่อฐานข้อมูลก่อนเริ่มงาน

  // --- ส่วนการดึงคอมเมนต์ (GET) ---
  if (req.method === 'GET') {
    try {
      const { animeId } = req.query;
      
      // ดึงคอมเมนต์ของมังงะเรื่องนี้ โดยเรียงจากใหม่ไปเก่า (Latest First)
      const comments = await Comment.find({ animeId }).sort({ createdAt: -1 });
      
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'ดึงคอมเมนต์ไม่สำเร็จ' });
    }
  }

  // --- ส่วนการเพิ่มคอมเมนต์ใหม่ (POST) ---
  if (req.method === 'POST') {
    try {
      const { userId, username, profilePic, animeId, text } = req.body;

      // ตรวจสอบเบื้องต้นว่ามีข้อความไหม (ป้องกันคอมเมนต์ว่าง)
      if (!text || text.trim() === '') {
        return res.status(400).json({ success: false, message: 'กรุณาพิมพ์ข้อความ' });
      }

      // สร้างคอมเมนต์ใหม่ลงฐานข้อมูล
      const newComment = await Comment.create({
          userId, 
          username, 
          profilePic, 
          animeId, 
          text: text.trim() // ตัดช่องว่างหน้าหลังออกให้สะอาด
      });

      return res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'ส่งคอมเมนต์ไม่สำเร็จ' });
    }
  }

  // ถ้าเป็น Method อื่นที่ไม่ใช่ GET หรือ POST
  return res.status(405).json({ message: 'Method Not Allowed' });
}