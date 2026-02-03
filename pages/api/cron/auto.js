import dbConnect from '../../../lib/mongodb';
import Anime from '../../../models/Anime';
import axios from 'axios';

export default async function handler(req, res) {
  // รหัสลับ (ต้องตรงกับที่ตั้งไว้)
  if (req.query.key !== 'joshua7465') {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  
  await dbConnect();

  try {
    // 🌍 1. ดูดข้อมูลจาก Jikan API (MyAnimeList) - แหล่งที่ใหญ่ที่สุดในโลก
    // ดึง "อนิเมะยอดฮิตที่กำลังฉาย" (Top Airing)
    const response = await axios.get('https://api.jikan.moe/v4/top/anime?filter=airing&limit=10');
    const data = response.data.data;

    if (!data || data.length === 0) {
       return res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลได้' });
    }

    let addedCount = 0;

    // 2. วนลูปบันทึกลง Database
    for (const item of data) {
      // เช็คว่ามีเรื่องนี้หรือยัง
      const exists = await Anime.findOne({ title: item.title });
      
      if (!exists) {
        // สร้างตอน (Episodes) จำลองขึ้นมา (เพราะ MAL ไม่แจกลิงก์ดู)
        // เราจะใช้ระบบ "Smart Search" เพื่อหาคลิปดูได้จาก YouTube
        const episodes = [];
        const totalEp = item.episodes || 12; // ถ้าไม่บอกจำนวนตอน ให้สมมติว่ามี 12 ตอน

        for (let i = 1; i <= totalEp; i++) {
            if (i > 12) break; // เอาแค่ 12 ตอนพอ เดี๋ยว DB เต็ม
            episodes.push({
                number: i,
                title: `ตอนที่ ${i}`,
                servers: [
                    {
                        name: "Server YouTube (Official/Fan)",
                        // สูตรโกง: ค้นหาชื่อเรื่อง + ตอน ใน YouTube แบบฝัง
                        url: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(item.title + ' episode ' + i + ' eng sub')}`,
                        quality: "720p", 
                        isPremium: false
                    }
                ]
            });
        }

        // บันทึกลง Database
        await Anime.create({
            title: item.title,
            imageUrl: item.images.jpg.large_image_url, // รูปชัดระดับ HD
            synopsis: item.synopsis || 'ไม่มีเรื่องย่อ',
            category: item.genres[0]?.name || 'Anime',
            episodes: episodes
        });
        
        addedCount++;
      }
    }
    
    res.json({ 
        success: true, 
        message: `✅ ดูดอนิเมะจากทั่วโลกสำเร็จ ${addedCount} เรื่อง! (รีเฟรชหน้าเว็บได้เลย)` 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}