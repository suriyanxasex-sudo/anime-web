import { exec } from 'child_process';
import path from 'path';

/**
 * JPLUS_CRON_HANDLER v3.0
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: รับคำสั่งจาก Vercel Cron (GET) แล้วไปปลุก Hunter Bot
 */

export default async function handler(req, res) {
  // 1. [SECURITY_CHECK] - ตรวจสอบว่าเป็น Vercel Cron จริงไหม
  // (Vercel จะส่ง Header พิเศษมา หรือเราเช็คจาก Key ที่เราตั้งใน URL ก็ได้)
  const { key } = req.query;
  
  if (key !== 'joshua7465') {
    return res.status(401).json({ success: false, message: "UNAUTHORIZED_CRON_ACCESS" });
  }

  try {
    // 2. [EXECUTE_BOT] - สั่งรัน Hunter Bot
    // (เหมือนกับ admin/scrape.js แต่ Fix ค่า URL ไว้ที่หน้า Top Update ของ Mangadex)
    const scriptPath = path.join(process.cwd(), 'scripts', 'hunter.js');
    
    // สั่งให้บอทไปล่ามังงะหน้าแรก (ไม่ต้องระบุ URL เจาะจง ให้มันหาเองตาม Logic ใน hunter.js)
    const command = `node "${scriptPath}"`;

    console.log(`[CRON_JOB] 🕛 Midnight Protocol Initiated...`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[CRON_FAIL] 💀: ${error.message}`);
        return;
      }
      console.log(`[CRON_REPORT] 📜: ${stdout}`);
    });

    return res.status(200).json({ 
      success: true, 
      message: "Daily Hunt Initiated", 
      timestamp: new Date().toISOString() 
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}