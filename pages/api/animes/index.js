import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';

export default async function handler(req, res) {
  await dbConnect();
  
  if (req.method === 'GET') {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { title: { $regex: search, $options: 'i' } };
    }
    const animes = await Anime.find(query).sort({ createdAt: -1 }).limit(20);
    res.json(animes);
  } else if (req.method === 'POST') {
    const anime = await Anime.create(req.body);
    res.json(anime);
  }
}