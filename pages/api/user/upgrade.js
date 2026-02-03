import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  const { userId } = req.body;
  const user = await User.findByIdAndUpdate(userId, { isPremium: true }, { new: true });
  res.json({ success: true, user });
}