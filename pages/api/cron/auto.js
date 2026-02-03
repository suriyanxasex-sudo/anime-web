import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';
import axios from 'axios';

// ฟังก์ชันหน่วงเวลา (เพื่อให้ Server ไม่มองว่าเป็น Spam)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  // 1. ระบบความปลอดภัย (ต้องมีกุญแจถึงจะรันได้)
  if (req.query.key !== 'joshua7465') {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  
  await dbConnect();

  try {
    // 2. ดึงข้อมูลจาก Source (ดึง Top Airing)
    // หมายเหตุ: ดึงมาแค่ 2 เรื่องพอ เพื่อให้ทำงานเสร็จภายใน 10 วินาที (ข้อจำกัด Vercel Free)
    const { data } = await axios.get('https://api.consumet.org/anime/gogoanime/top-airing');
    
    if (!data.results || data.results.length === 0) {
       return res.status(500).json({ error: 'API ต้นทางไม่ส่งข้อมูล (ลองกดใหม่อีกครั้ง)' });
    }

    const newItems = data.results.slice(0, 2); // เอาแค่ 2 เรื่อง
    let addedCount = 0;

    for (const item of newItems) {
      // เช็คว่ามีเรื่องนี้ใน DB หรือยัง
      const exists = await Anime.findOne({ title: item.title });
      
      if (!exists) {
        await sleep(1000); // พัก 1 วินาที

        try {
          // ดึงรายละเอียดลึก (Server วิดีโอ)
          const detailRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${item.id}`);
          const details = detailRes.data;
          
          // แปลงข้อมูลให้เข้ากับ DB ของเรา
          const episodes = details.episodes?.map(ep => ({
            number: ep.number,
            title: `ตอนที่ ${ep.number}`,
            servers: [
              {
                name: "Server หลัก",
                url: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(item.title + ' ep ' + ep.number)}`,
                quality: "720p",
                isPremium: false
              }
            ]
          })) || [];

          // บันทึกลง Database
          await Anime.create({
            title: details.title,
            imageUrl: details.image,
            synopsis: details.description,
            category: details.genres?.[0] || 'Action',
            episodes: episodes
          });
          
          addedCount++;
          console.log(`Saved: ${item.title}`);

        } catch (err) {
          console.error(`ข้ามเรื่อง ${item.title}: ${err.message}`);
          continue; // ถ้าเรื่องนี้พัง ให้ข้ามไปเรื่องถัดไป
        }
      }
    }
    
    res.json({ success: true, message: `เพิ่มอนิเมะใหม่สำเร็จ ${addedCount} เรื่อง` });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}