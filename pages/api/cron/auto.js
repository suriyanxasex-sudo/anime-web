import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.query.key !== 'joshua7465') return res.status(401).json({ message: 'Unauthorized' });
  await dbConnect();

  try {
    // ดึง Top Airing จาก Gogoanime
    const { data } = await axios.get('https://api.consumet.org/anime/gogoanime/top-airing');
    
    let addedCount = 0;

    // เอามา 10 เรื่องเลย
    if (data.results) {
        for (const item of data.results.slice(0, 10)) {
            const exists = await Anime.findOne({ title: item.title });
            if (!exists) {
                // ดึงข้อมูลลึกเพื่อเอารายชื่อตอน
                try {
                    const { data: details } = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${item.id}`);
                    
                    if (details.episodes && details.episodes.length > 0) {
                        const episodes = details.episodes.map(ep => ({
                            number: ep.number,
                            title: `ตอนที่ ${ep.number}`,
                            servers: [{ 
                                name: "Gogo-Stream", 
                                // เก็บแค่ ID พอ (เช่น one-piece-episode-1000) เดี๋ยวหน้าเว็บจัดการต่อ
                                url: `ID:${ep.id}`, 
                                quality: "HD", 
                                isPremium: false 
                            }]
                        }));

                        await Anime.create({
                            title: details.title,
                            imageUrl: details.image,
                            synopsis: details.description,
                            category: details.genres?.[0],
                            episodes: episodes
                        });
                        addedCount++;
                    }
                } catch (e) { console.log('ข้าม ' + item.title); }
            }
        }
    }

    res.json({ success: true, message: `จัดให้แล้ว ${addedCount} เรื่อง` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}