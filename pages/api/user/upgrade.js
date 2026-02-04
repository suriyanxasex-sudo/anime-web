import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

/**
 * JPLUS_TRANSACTION_CORE v3.0
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ระบบตัดแต้มที่ปลอดภัยที่สุดในจักรวาล (มีเช็คเงินก่อนหัก)
 */

export default async function handler(req, res) {
  // 1. [SECURITY_CHECK] - รับเฉพาะ POST เท่านั้น
  if (req.method !== 'POST') return res.status(405).json({ message: "Method Not Allowed" });

  const { userId, amount = 500 } = req.body; // รับ ID คนที่จะโดนหัก และจำนวนเงิน

  if (!userId) {
    return res.status(400).json({ success: false, message: "ERROR: Missing User ID" });
  }

  try {
    await connectDB();

    // 2. [BALANCE_CHECK] - ดึงข้อมูลมาดูก่อนว่ารวยพอไหม
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "USER_NOT_FOUND" });
    }

    // ถ้าแต้มไม่พอ (เช่น มี 200 จะซื้อของ 500)
    if (targetUser.points < amount) {
      return res.status(400).json({ 
        success: false, 
        message: "INSUFFICIENT_FUNDS: กรุณาเติมเงินก่อน (แต้มไม่พอ)" 
      });
    }

    // 3. [EXECUTE_TRANSACTION] - หักแต้มจริง
    targetUser.points -= amount;
    await targetUser.save(); // บันทึกข้อมูล

    console.log(`[TRANSACTION] ${targetUser.username} paid ${amount} points. Remaining: ${targetUser.points}`);

    return res.status(200).json({ 
      success: true, 
      points: targetUser.points,
      message: "TRANSACTION_COMPLETE"
    });

  } catch (error) {
    console.error("Transaction Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}