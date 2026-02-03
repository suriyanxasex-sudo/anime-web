import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Premium() {
  const { user, login } = useAuth();
  const router = useRouter();

  const buy = async () => {
    if(!user) return router.push('/login');
    if(confirm('Pay 99 THB?')) {
       await axios.post('/api/user/upgrade', { userId: user._id });
       login({...user, isPremium: true});
       router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="text-center pt-20">
        <h1 className="text-3xl font-bold mb-4">Upgrade to VIP</h1>
        <p className="mb-8">Unlock 1080p and Exclusive Servers</p>
        <button onClick={buy} className="bg-yellow-400 text-white px-8 py-3 rounded-full font-bold text-xl shadow hover:scale-105 transition">
           Get VIP Now (฿99)
        </button>
      </div>
    </div>
  );
}