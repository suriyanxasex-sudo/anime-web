import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  try {
    await connectDB();
    // หา User หรือสร้างใหม่ถ้ายังไม่มี
    let user = await User.findOne({ role: 'admin' });
    if (!user) {
      user = await User.create({ username: "JOSHUA_OVERLORD", points: 1000, role: 'admin' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}