import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.json({ success: false, message: 'ชื่อนี้มีคนใช้แล้ว' });

  const newUser = await User.create({ username, password, role: 'user', isPremium: false });
  res.json({ success: true, user: newUser });
}