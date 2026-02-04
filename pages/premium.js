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
    // เช็คแต้ม (ต้องมี 500 ถึงจะกดได้)
    if (user.points < 500) {
      alert("แต้มไม่พอครับลูกพี่! (ต้องใช้ 500 Points)");
      return;
    }

    try {
      // เรียก API ตัดแต้ม
      const res = await axios.post('/api/user/upgrade', { plan });
      if (res.data.success) {
        alert(`สำเร็จ! ยินดีต้อนรับสู่สถานะ ${plan}`);
        window.location.reload(); // รีเฟรชเพื่อโชว์สถานะใหม่
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ (Check API/Network)");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
      <div className="w-full max-w-xl flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black italic text-[#FB7299]">JPLUS VIP</h1>
        <div className="border border-[#FB7299] px-6 py-2 rounded-full bg-[#FB7299]/10">
          <span className="text-[#FB7299] font-black">POINTS: {user.points} 💎</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl w-full max-w-xl text-center border border-white/10 shadow-2xl">
        <h2 className="text-5xl font-black mb-4 italic uppercase tracking-tighter">Ultimate Pass</h2>
        <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest">Unlock Unlimited Reading</p>
        <button 
          onClick={() => handleUpgrade('VIP_PERMANENT')} 
          className="w-full bg-[#FB7299] hover:bg-[#ff8eb0] py-5 rounded-2xl font-black text-black text-xl transition-all active:scale-95"
        >
          UNLOCK NOW (500 PTS)
        </button>
      </div>
    </div>
  );
}