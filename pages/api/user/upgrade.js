import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'METHOD_NOT_ALLOWED' });

  const { username } = req.body;
  await dbConnect();

  try {
    // ค้นหาและอัปเกรด User เป็น Premium
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { isPremium: true, upgradeDate: new Date() },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'USER_NOT_FOUND_IN_SYSTEM' });
    }

    console.log(`[VIP_SYSTEM] User ${username} has been upgraded to PREMIUM_STATUS`);

    return res.status(200).json({ 
      success: true, 
      message: 'UPGRADE_SUCCESSFUL',
      isPremium: updatedUser.isPremium 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}