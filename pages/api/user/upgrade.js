import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");
  try {
    await connectDB();
    const updatedUser = await User.findOneAndUpdate(
      { role: 'admin' },
      { $inc: { points: -500 } }, // หัก 500 แต้ม
      { new: true }
    );
    return res.status(200).json({ success: true, points: updatedUser.points });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}