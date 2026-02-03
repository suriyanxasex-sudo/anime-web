import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.query.key !== 'joshua7465') return res.status(401).json({ message: 'Unauthorized' });
  await dbConnect();

  try {
    // ดึงมังงะยอดนิยม (Popular Manga)
    const { data } = await axios.get('https://api.consumet.org/manga/mangareader/popular');
    
    const results = await Promise.all(data.results.slice(0, 10).map(async (item) => {
      try {
        // ดึงรายละเอียดตอน
        const { data: details } = await axios.get(`https://api.consumet.org/manga/mangareader/info?id=${item.id}`);
        
        const chapters = details.chapters.map(ch => ({
          number: ch.number,
          title: ch.title || `ตอนที่ ${ch.number}`,
          servers: [{ name: "Manga-Server", url: `ID:${ch.id}`, isPremium: false }]
        }));

        // ใช้ findOneAndUpdate เพื่อ "ทับ" ของเก่าให้หายสาบสูญ
        await Anime.findOneAndUpdate(
          { title: details.title },
          {
            title: details.title,
            imageUrl: details.image,
            synopsis: details.description,
            category: "Manga",
            episodes: chapters 
          },
          { upsert: true, new: true }
        );
        return true;
      } catch (e) { return false; }
    }));

    res.json({ success: true, message: `ล้างบางและลงมังงะใหม่แล้ว ${results.filter(Boolean).length} เรื่อง` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}