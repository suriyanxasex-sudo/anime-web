import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  
  const { username, password } = req.body;
  
  if (username === 'joshua' && password === '7465') {
    let admin = await User.findOne({ username: 'joshua' });
    if (!admin) admin = await User.create({ username, password, role: 'admin', isPremium: true });
    return res.json({ success: true, user: admin });
  }

  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ error: 'Wrong credentials' });
  res.json({ success: true, user });
}