import { exec } from 'child_process';
import path from 'path';

/**
 * JPLUS_SCRAPER_WAKEUP_V2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * แก้ไข: ปิดบั๊ก 404 และเชื่อมต่อระบบสั่งการบอท
 */

export default async function handler(req, res) {
  // รับเฉพาะ POST ตามมาตรฐานความปลอดภัยของ Jplus
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "ลูกพี่ครับ ต้องใช้ POST เท่านั้นนะ!" });
  }

  try {
    // หาตำแหน่งไฟล์บอทในโปรเจกต์
    const scriptPath = path.join(process.cwd(), 'scripts', 'scraper-bot.js');

    console.log(`[COMMAND] Admin Joshua is waking up the bot at: ${scriptPath}`);

    // สั่งรันบอทแบบ Background Process
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[BOT_EXEC_ERROR]: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`[BOT_STDERR]: ${stderr}`);
        return;
      }
      console.log(`[BOT_STDOUT]: ${stdout}`);
    });

    // ตอบกลับหน้าบ้านทันทีเพื่อให้ปุ่มไม่ค้าง
    return res.status(200).json({ 
      success: true, 
      message: "✅ บอทตื่นแล้วครับลูกพี่! กำลังออกไปขุดมังงะมาเติมคลัง Jplus ให้เดี๋ยวนี้!",
      status: "RUNNING_IN_BACKGROUND"
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "ระบบสั่งการขัดข้องครับลูกพี่!",
      error: error.message 
    });
  }
}