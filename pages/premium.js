import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PremiumPage() {
  const [user, setUser] = useState({ points: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/profile');
        setUser(res.data);
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, []);

  const handleUpgrade = async (plan) => {
    if (user.points < 500) { alert("แต้มไม่พอครับลูกพี่!"); return; }
    try {
      const res = await axios.post('/api/user/upgrade', { plan });
      if (res.data.success) {
        alert("อัปเกรดสำเร็จ!");
        window.location.reload();
      }
    } catch (err) { alert("Error: เชื่อมต่อ Server ไม่ได้"); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
      <div className="w-full max-w-xl flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black italic text-[#FB7299]">JPLUS VIP</h1>
        <div className="border border-[#FB7299] px-6 py-2 rounded-full">
          <span className="text-[#FB7299] font-black">POINTS: {user.points} 💎</span>
        </div>
      </div>
      <div className="bg-gray-900 p-8 rounded-3xl w-full max-w-xl text-center border border-gray-800">
        <h2 className="text-4xl font-black mb-4 italic">PREMIUM PASS</h2>
        <button onClick={() => handleUpgrade('VIP_LIFETIME')} className="w-full bg-[#FB7299] py-4 rounded-xl font-bold text-black text-xl hover:scale-105 transition-all">
          BUY NOW (500 PTS)
        </button>
      </div>
    </div>
  );
}