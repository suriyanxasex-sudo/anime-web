// ไฟล์: pages/api/comment.js
import dbConnect from '../../lib/mongodb'; // ถอย 2 ขั้น (api -> pages -> root)
import Comment from '../../models/Comment'; // ถอย 2 ขั้นไปหา models

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { animeId } = req.query;
    // ดึงคอมเมนต์
    const comments = await Comment.find({ animeId }).sort({ createdAt: -1 });
    return res.json(comments);
  }

  if (req.method === 'POST') {
    const { userId, username, profilePic, animeId, text } = req.body;
    // สร้างคอมเมนต์ใหม่
    const newComment = await Comment.create({
        userId, username, profilePic, animeId, text
    });
    return res.json({ success: true, comment: newComment });
  }
}