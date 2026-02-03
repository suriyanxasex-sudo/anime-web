import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaCrown, FaCheckCircle, FaArrowLeft, FaGem } from 'react-icons/fa';

export default function Premium() {
  const { user, login } = useAuth();
  const router = useRouter();

  const buy = async () => {
    if (!user) return router.push('/login');
    
    if (confirm('ยืนยันการชำระเงิน 99 บาท เพื่อเป็น Jplus VIP?')) {
      try {
        // ใช้ username ในการอัปเกรดตาม Logic API ใหม่ที่เราทำไว้
        const res = await axios.post('/api/user/upgrade', { username: user.username });
        
        if (res.data.success) {
          alert('ยินดีด้วย! คุณได้รับการอัปเกรดเป็น VIP เรียบร้อยแล้ว 💎');
          login({ ...user, isPremium: true });
          router.push('/');
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอัปเกรด: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FB7299]/5 rounded-full blur-[120px]"></div>
      
      <div className="max-w-md w-full relative z-10">
        <Link href="/">
          <button className="flex items-center gap-2 mb-10 text-gray-500 hover:text-white transition text-xs font-bold tracking-widest">
            <FaArrowLeft /> [BACK_TO_HOME]
          </button>
        </Link>

        <div className="bg-[#18191C] border border-[#FB7299]/20 rounded-[2rem] p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <FaGem className="text-[#FB7299]/10 text-6xl rotate-12" />
          </div>

          <div className="bg-gradient-to-tr from-[#FB7299] to-[#FF5D87] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg shadow-[#FB7299]/20">
             <FaCrown className="text-4xl text-white" />
          </div>

          <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase">Jplus <span className="text-[#FB7299]">VIP</span></h1>
          <p className="text-gray-500 text-xs mb-8 font-bold tracking-widest uppercase">The Ultimate Reading Experience</p>

          <ul className="text-left space-y-4 mb-10 text-sm">
             <li className="flex items-center gap-3 text-gray-300">
                <FaCheckCircle className="text-[#FB7299]" /> เข้าถึงมังฮวาตอนใหม่ล่าสุดก่อนใคร
             </li>
             <li className="flex items-center gap-3 text-gray-300">
                <FaCheckCircle className="text-[#FB7299]" /> อ่านแบบไม่มีโฆษณาคั่นกวนใจ
             </li>
             <li className="flex items-center gap-3 text-gray-300">
                <FaCheckCircle className="text-[#FB7299]" /> ตราสัญลักษณ์ VIP สุดเท่ในโปรไฟล์
             </li>
             <li className="flex items-center gap-3 text-gray-300">
                <FaCheckCircle className="text-[#FB7299]" /> รองรับภาพความละเอียดสูงสุด
             </li>
          </ul>

          <button 
            onClick={buy} 
            disabled={user?.isPremium}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl
            ${user?.isPremium 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
              : 'bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white hover:scale-[1.03] hover:shadow-[#FB7299]/30 active:scale-95'}`}
          >
            {user?.isPremium ? 'VIP_ALREADY_ACTIVE' : 'UPGRADE NOW (฿99)'}
          </button>

          <p className="mt-6 text-[9px] text-gray-600 italic">
            * การอัปเกรดมีผลทันทีหลังจากกดชำระเงินสำเร็จ (Demo Mode)
          </p>
        </div>
      </div>
    </div>
  );
}