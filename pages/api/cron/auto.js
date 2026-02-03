import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime'; // ใช้ Model เดิมได้ แค่เปลี่ยนไส้ใน
import axios from 'axios';

export default async function handler(req, res) {
  if (req.query.key !== 'joshua7465') return res.status(401).json({ message: 'Unauthorized' });
  await dbConnect();

  try {
    // ดึงมังงะยอดนิยมจาก MangaReader
    const { data } = await axios.get('https://api.consumet.org/manga/mangareader/popular');
    
    const results = await Promise.all(data.results.slice(0, 10).map(async (item) => {
      try {
        // ดึงรายละเอียดตอนและรูปภาพในตอน
        const { data: details } = await axios.get(`https://api.consumet.org/manga/mangareader/info?id=${item.id}`);
        
        const chapters = details.chapters.map(ch => ({
          number: ch.number,
          title: ch.title || `ตอนที่ ${ch.number}`,
          servers: [{ 
            name: "Manga-Server", 
            url: `ID:${ch.id}`, // เก็บ ID ตอนไว้ไปดึงรูป
            isPremium: false 
          }]
        }));

        await Anime.findOneAndUpdate(
          { title: details.title },
          {
            title: details.title,
            imageUrl: details.image,
            synopsis: details.description,
            category: "Manga",
            episodes: chapters // ใช้ field episodes เก็บข้อมูลตอนแทน
          },
          { upsert: true, new: true }
        );
        return true;
      } catch (e) { return false; }
    }));

    res.json({ success: true, message: `ดึงมังงะใหม่แล้ว ${results.filter(Boolean).length} เรื่อง` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}