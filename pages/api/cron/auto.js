import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';
import axios from 'axios';

// ฟังก์ชันหน่วงเวลา
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  // รหัสลับสั่งบอท
  if (req.query.key !== 'joshua7465') return res.status(401).json({ message: 'Unauthorized' });
  
  await dbConnect();

  try {
    // 🌍 เปลี่ยนแหล่งดึง: ใช้ "recent-episodes" เพื่อดึงตอนที่เพิ่งมาใหม่จากทั่วโลก
    // นี่คือวิธีที่ใกล้เคียงคำว่า "ดึงจากทุกที่บนออนไลน์" มากที่สุดสำหรับ API ฟรี
    const { data } = await axios.get('https://api.consumet.org/anime/gogoanime/recent-episodes');
    
    if (!data.results || data.results.length === 0) {
       return res.status(500).json({ error: 'API ต้นทางไม่ส่งข้อมูล (ลองใหม่อีกครั้ง)' });
    }

    // ดึงเพิ่มขึ้นเป็น 10 เรื่อง (ระวัง Vercel ตัดถ้าดึงเยอะเกินไป)
    const newItems = data.results.slice(0, 10); 
    let addedCount = 0;

    for (const item of newItems) {
      // เช็คว่ามีเรื่องนี้หรือยัง
      const exists = await Anime.findOne({ title: item.title });
      
      if (!exists) {
        await sleep(1500); // พัก 1.5 วิ (เพื่อไม่ให้โดนบล็อก)

        try {
          // ดึงรายละเอียดลึก
          const detailRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${item.id}`);
          const details = detailRes.data;

          if (!details.episodes || details.episodes.length === 0) continue; 

          // แปลงข้อมูล
          const episodes = details.episodes.map(ep => ({
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
          }));

          // บันทึก
          await Anime.create({
            title: details.title,
            imageUrl: details.image,
            synopsis: details.description || 'อนิเมะใหม่ล่าสุด',
            category: details.genres?.[0] || 'New',
            episodes: episodes
          });
          
          addedCount++;
          console.log(`✅ เพิ่มเรื่องใหม่: ${item.title}`);

        } catch (err) {
          console.error(`ข้าม: ${item.title}`);
          continue;
        }
      }
    }
    
    res.json({ success: true, message: `ดูดอนิเมะใหม่สำเร็จ ${addedCount} เรื่อง!` });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}