import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';
import axios from 'axios';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.query.key !== 'joshua7465') return res.status(401).json({ message: 'Unauthorized' });
  
  await dbConnect();

  try {
    // ดึงแค่ 2 เรื่องพอ เพื่อความเร็ว
    const { data } = await axios.get('https://api.consumet.org/anime/gogoanime/top-airing');
    
    if (!data.results || data.results.length === 0) {
       return res.status(500).json({ error: 'API ต้นทางไม่ส่งข้อมูลมา' });
    }

    const newItems = data.results.slice(0, 2); 
    let addedCount = 0;

    for (const item of newItems) {
      const exists = await Anime.findOne({ title: item.title });
      
      if (!exists) {
        await sleep(1000); // พักแค่ 1 วิพอ

        try {
          const detailRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${item.id}`);
          const details = detailRes.data;
          
          const episodes = details.episodes?.map(ep => ({
            number: ep.number,
            title: `ตอนที่ ${ep.number}`,
            servers: [
              {
                name: "Free Server",
                url: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(item.title + ' ep ' + ep.number)}`,
                quality: "720p",
                isPremium: false
              }
            ]
          })) || [];

          await Anime.create({
            title: details.title,
            imageUrl: details.image,
            synopsis: details.description,
            category: details.genres?.[0] || 'Action',
            episodes: episodes
          });
          
          addedCount++;
        } catch (err) {
          console.error(`Skip ${item.title}: ${err.message}`);
          continue; 
        }
      }
    }
    
    res.json({ success: true, message: `เพิ่มสำเร็จ ${addedCount} เรื่อง` });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}