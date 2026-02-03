import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaCrown, FaCheckCircle, FaArrowLeft, FaGem, FaShieldAlt, FaRocket } from 'react-icons/fa';

export default function Premium() {
  const { user, login } = useAuth();
  const router = useRouter();

  const buy = async () => {
    if (!user) return router.push('/login');
    
    if (confirm('CONFIRMATION: ยืนยันการชำระเงิน 99 บาท เพื่อเปิดใช้งาน JPLUS_VIP_MEMBERSHIP?')) {
      try {
        addLog(`INITIATING_TRANSACTION_FOR: ${user.username.toUpperCase()}`);
        const res = await axios.post('/api/user/upgrade', { username: user.username });
        
        if (res.data.success) {
          alert('SYSTEM_UPDATE: ยินดีด้วย! คุณได้รับการอัปเกรดเป็น VIP เรียบร้อยแล้ว 💎');
          login({ ...user, isPremium: true });
          router.push('/');
        }
      } catch (err) {
        alert('TRANSACTION_FAILED: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Particles Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FB7299]/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00A1D6]/5 rounded-full blur-[150px]"></div>

      <div className="max-w-2xl w-full relative z-10">
        <Link href="/">
          <button className="flex items-center gap-2 mb-12 text-gray-500 hover:text-[#FB7299] transition-all text-[10px] font-black tracking-[0.3em] uppercase">
            <FaArrowLeft /> [ ABORT_AND_RETURN_HOME ]
          </button>
        </Link>

        <div className="bg-[#121212]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 shadow-[0_0_50px_rgba(251,114,153,0.1)] relative overflow-hidden group">
          {/* Animated Glow Border */}
          <div className="absolute inset-0 border-2 border-[#FB7299]/0 group-hover:border-[#FB7299]/20 transition-all duration-700 rounded-[3rem]"></div>

          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
             <FaGem className="text-8xl rotate-12" />
          </div>

          <div className="text-center mb-10">
            <div className="bg-gradient-to-tr from-[#FB7299] to-[#FF5D87] w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-6 shadow-2xl shadow-[#FB7299]/30 border-4 border-white/10 group-hover:rotate-0 transition-transform duration-500">
               <FaCrown className="text-5xl text-white drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-black mb-3 tracking-tighter italic uppercase">Jplus <span className="text-[#FB7299]">VIP</span></h1>
            <p className="text-gray-600 text-[10px] font-black tracking-[0.5em] uppercase">Status: Unauthorized_Member</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: <FaRocket />, title: "EARLY_ACCESS", desc: "อ่านตอนใหม่ก่อนใคร 24 ชม." },
              { icon: <FaShieldAlt />, title: "NO_ADS_PROTOCOL", desc: "ล้างโฆษณาทุกประเภท" },
              { icon: <FaGem />, title: "HD_MASTERING", desc: "ภาพชัดระดับ 4K Ultra" },
              { icon: <FaCrown />, title: "VIP_BADGE", desc: "ยศพิเศษ Admin Joshua ยอมรับ" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#FB7299]/30 transition-all">
                <div className="text-[#FB7299] mt-1">{item.icon}</div>
                <div>
                  <h3 className="text-[10px] font-black text-white uppercase mb-1 tracking-widest">{item.title}</h3>
                  <p className="text-[9px] text-gray-500 font-bold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={buy} 
            disabled={user?.isPremium}
            className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-2xl relative overflow-hidden
            ${user?.isPremium 
              ? 'bg-gray-900 text-gray-700 cursor-not-allowed border border-white/5' 
              : 'bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white hover:scale-[1.02] active:scale-95 shadow-[#FB7299]/20'}`}
          >
            <span className="relative z-10">{user?.isPremium ? 'SYSTEM_LOCKED: VIP_ACTIVE' : 'INITIALIZE_UPGRADE (฿99)'}</span>
            {!user?.isPremium && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>}
          </button>

          <div className="mt-8 flex justify-center gap-6">
             <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest flex items-center gap-2 border-r border-white/5 pr-6">Encrypted_Payment</p>
             <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest flex items-center gap-2">Lifetime_Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}