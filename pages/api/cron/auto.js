import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';
import axios from 'axios';

export default async function handler(req, res) {
  // Check Key เพื่อความปลอดภัย
  if (req.query.key !== 'joshua7465') return res.status(401).json({ message: 'Unauthorized' });
  
  await dbConnect();

  try {
    // 1. ดึง Top Airing จาก Gogoanime
    const { data } = await axios.get('https://api.consumet.org/anime/gogoanime/top-airing');
    
    if (!data.results) return res.json({ success: false, message: "No data found" });

    // 2. ใช้ Promise.all ยิงพร้อมกัน 10 เรื่อง (เพื่อความไว)
    const results = await Promise.all(data.results.slice(0, 10).map(async (item) => {
        try {
            // ดึงข้อมูลลึกเพื่อเอารายชื่อตอน
            const { data: details } = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${item.id}`);
            
            if (details.episodes && details.episodes.length > 0) {
                const episodes = details.episodes.map(ep => ({
                    number: ep.number,
                    title: `ตอนที่ ${ep.number}`,
                    servers: [{ 
                        name: "Gogo-Stream", 
                        // เก็บเป็น ID (เช่น ID:one-piece-episode-1) เพื่อส่งให้หน้าเว็บไปแปลงเป็นวิดีโอ
                        url: `ID:${ep.id}`, 
                        quality: "HD", 
                        isPremium: false 
                    }]
                }));

                // *** ทีเด็ด: ใช้ findOneAndUpdate แทน create ***
                // สั่งให้มัน "ทับ" ข้อมูลเดิมทันที (YouTube เก่าจะหายไป)
                await Anime.findOneAndUpdate(
                    { title: details.title }, 
                    {
                        title: details.title,
                        imageUrl: details.image,
                        synopsis: details.description,
                        category: details.genres?.[0],
                        episodes: episodes 
                    },
                    { upsert: true, new: true }
                );
                
                return true; 
            }
        } catch (e) {
            console.log('Error processing:', item.title);
        }
        return false;
    }));

    // นับจำนวนเรื่องที่ทำสำเร็จ
    const updatedCount = results.filter(Boolean).length;

    res.json({ success: true, message: `อัปเดตเสร็จสิ้น! ทับข้อมูลเก่าไป ${updatedCount} เรื่อง` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}