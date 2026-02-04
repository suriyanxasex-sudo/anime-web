import { exec } from 'child_process';
import path from 'path';

/**
 * JPLUS_HUNTER_CONTROLLER v3.0
 * พัฒนาโดย: JOSHUA_MAYOE
 * วัตถุประสงค์: ปลุก Hunter Bot และชี้เป้าหมาย (Target) ให้ไปล่ามังงะ
 */

export default async function handler(req, res) {
  // 1. [METHOD_GUARD]
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "METHOD_NOT_ALLOWED" });
  }

  const { url, key, mangaTitle, targetChapters } = req.body;

  // 2. [SECURITY_CHECK] - รหัสลับต้องตรงกัน
  if (key !== 'joshua7465') {
    return res.status(401).json({ success: false, message: "ACCESS_DENIED: WRONG_KEY" });
  }

  // 3. [VALIDATION] - ต้องมีเป้าหมาย
  if (!url && !mangaTitle) {
    return res.status(400).json({ success: false, message: "MISSING_TARGET: ระบุ URL หรือชื่อเรื่อง" });
  }

  try {
    // หาไฟล์ hunter.js (ต้องตรงกับชื่อไฟล์จริงในโฟลเดอร์ scripts)
    const scriptPath = path.join(process.cwd(), 'scripts', 'hunter.js');
    
    // กำหนดเป้าหมาย (ส่ง URL ไปให้บอท)
    // การใส่ "" ครอบ URL สำคัญมาก กันกรณี URL มีตัวอักษรแปลกๆ
    const target = url || mangaTitle;
    const command = `node "${scriptPath}" "${target}"`;

    console.log(`[COMMAND] 🐺 Releasing the Hunter... Target: ${target}`);

    // 4. [EXECUTE_PROTOCOL] - สั่งรันแบบ Fire-and-Forget (ไม่รอเสร็จ)
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[HUNTER_DIED] 💀: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`[HUNTER_WARN] ⚠️: ${stderr}`);
      }
      // Log ผลลัพธ์ (ปกติจะไปโผล่ใน Console ของ Server)
      console.log(`[HUNTER_REPORT] 📜: ${stdout}`);
    });

    // 5. [IMMEDIATE_RESPONSE] - ตอบกลับทันที (UI จะได้ไม่ค้าง)
    return res.status(200).json({ 
      success: true, 
      message: `🐺 Hunter Bot deployed! Target: ${target}`,
      status: "HUNTING_IN_BACKGROUND"
    });

  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "SYSTEM_FAILURE", 
      error: error.message 
    });
  }
}