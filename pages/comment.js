import dbConnect from '../../../lib/mongodb';
import Comment from '../../../models/Comment';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { animeId } = req.query;
    const comments = await Comment.find({ animeId }).sort({ createdAt: -1 });
    return res.json(comments);
  }

  if (req.method === 'POST') {
    const { userId, username, profilePic, animeId, text } = req.body;
    const newComment = await Comment.create({
        userId, username, profilePic, animeId, text
    });
    return res.json({ success: true, comment: newComment });
  }
}