import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';

export default async function handler(req, res) {
  const { query: { id }, method } = req;
  await dbConnect();

  if (method === 'GET') {
    const anime = await Anime.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    res.json(anime);
  } else if (method === 'DELETE') {
    await Anime.findByIdAndDelete(id);
    res.json({ success: true });
  }
}