import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PremiumPage() {
  const [user, setUser] = useState({ points: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/profile');
        setUser(res.data);
      } catch (err) { console.error("User_Fetch_Err:", err); }
    };
    fetchUser();
  }, []);

  const handleUpgrade = async (plan) => {
    if (user.points < 500) {
      alert("แต้มไม่พอครับลูกพี่ Joshua! ไปเติมก่อน");
      return;
    }
    try {
      const res = await axios.post('/api/user/upgrade', { plan });
      if (res.data.success) {
        alert(`อัปเกรดเป็น ${plan} สำเร็จ!`);
        window.location.reload();
      }
    } catch (err) {
      alert("การทำรายการล้มเหลว กรุณาเช็ค API");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
      <div className="w-full max-w-xl flex justify-between items-center mb-20">
        <h1 className="text-3xl font-black italic text-[#FB7299]">JPLUS VIP</h1>
        <div className="bg-[#FB7299]/20 border border-[#FB7299] px-6 py-2 rounded-full">
          <span className="text-[#FB7299] font-black">MY_POINTS: {user.points} 💎</span>
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] w-full max-w-xl text-center">
        <h2 className="text-5xl font-black mb-4 italic uppercase">VIP_PASS</h2>
        <p className="text-gray-500 mb-10 uppercase tracking-widest text-[10px]">UNLOCK EVERYTHING FOREVER</p>
        <button onClick={() => handleUpgrade('VIP_PERMANENT')} className="w-full bg-[#FB7299] py-6 rounded-3xl font-black italic text-xl hover:scale-105 transition-all">
          GET ACCESS (500 PTS)
        </button>
      </div>
    </div>
  );
}