import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.query.key !== 'joshua7465') return res.status(401).json({ message: 'Unauthorized' });
  await dbConnect();

  try {
    // 1. พยายามดึงจาก Gogoanime (Consumet) ก่อน เพื่อเอาลิงก์หนังจริง
    let animeList = [];
    try {
        const { data } = await axios.get('https://api.consumet.org/anime/gogoanime/top-airing');
        if (data.results && data.results.length > 0) {
            animeList = data.results.slice(0, 5); // เอา 5 เรื่องล่าสุด
        }
    } catch (err) {
        console.log('Gogoanime Error, switching to backup...');
    }

    // 2. ถ้า Gogoanime ล่ม ให้ดึงจาก Jikan (MyAnimeList) เป็นแผนสำรอง
    if (animeList.length === 0) {
        const { data } = await axios.get('https://api.jikan.moe/v4/top/anime?filter=airing&limit=5');
        animeList = data.data.map(a => ({
            id: 'backup-' + a.mal_id,
            title: a.title,
            image: a.images.jpg.large_image_url,
            description: a.synopsis,
            genres: a.genres.map(g => g.name),
            isBackup: true // มาร์คว่าเป็นตัวสำรอง
        }));
    }

    let addedCount = 0;

    for (const item of animeList) {
      const exists = await Anime.findOne({ title: item.title });
      if (!exists) {
        let episodes = [];

        if (item.isBackup) {
            // [แผนสำรอง] ใช้ Trailer YouTube ที่ดูได้แน่นอน 100%
            episodes.push({
                number: 1,
                title: "Teaser (Official)",
                servers: [{ name: "YouTube Trailer", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1", isPremium: false }] 
                // *หมายเหตุ: ของจริงจะเปลี่ยนลิงก์ไม่ได้อัตโนมัติถ้า API ไม่ส่งมา แต่ใส่กันไว้ก่อน
            });
        } else {
            // [แผนหลัก] ดึงรายละเอียดเพื่อเอา Episode ID
            try {
                const { data: details } = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${item.id}`);
                
                // เก็บ "รหัสตอน" (เช่น spy-x-family-episode-1) ใส่หน้า GOGO: เพื่อให้ Frontend รู้
                episodes = details.episodes.map(ep => ({
                    number: ep.number,
                    title: `ตอนที่ ${ep.number}`,
                    servers: [{ 
                        name: "Server หลัก", 
                        url: `GOGO:${ep.id}`, // <--- หัวใจสำคัญ! เก็บเป็นรหัสไว้ก่อน
                        isPremium: false 
                    }]
                }));
            } catch (e) { continue; }
        }

        if (episodes.length > 0) {
            await Anime.create({
                title: item.title,
                imageUrl: item.image,
                synopsis: item.description || 'สนุกมากต้องดู!',
                category: item.genres?.[0] || 'Anime',
                episodes: episodes
            });
            addedCount++;
        }
      }
    }
    
    res.json({ success: true, message: `อัปเดตสำเร็จ ${addedCount} เรื่อง!` });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}