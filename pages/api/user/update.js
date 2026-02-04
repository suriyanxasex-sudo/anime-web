import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ message: "Method Not Allowed" });
  try {
    await connectDB();
    const { username } = req.body;
    // อัปเดตข้อมูลของ Joshua (Role: Admin)
    const updatedUser = await User.findOneAndUpdate(
      { role: 'admin' }, 
      { username },
      { new: true, upsert: true }
    );
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}