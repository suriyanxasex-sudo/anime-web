import Link from 'next/link';
import { FaLock, FaCrown, FaShieldAlt } from 'react-icons/fa';

/**
 * JPLUS_CONTENT_GATEKEEPER v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ควบคุมการเข้าถึงเนื้อหาระดับพรีเมียม และสร้างแรงจูงใจในการสมัคร VIP
 */

export default function Player({ src, isPremium, userHasAccess }) {
  
  // 🚫 [RESTRICTED_ACCESS_PROTOCOL] - กรณีเนื้อหาเป็น VIP แต่ผู้ใช้ไม่มีสิทธิ์
  if (isPremium && !userHasAccess) {
    return (
      <div className="w-full aspect-video bg-[#0a0a0a] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white relative overflow-hidden rounded-[2.5rem] shadow-2xl">
        
        {/* Visual Decor: แสงฟุ้งพื้นหลัง */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-[#FB7299]/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-[#00A1D6]/5 rounded-full blur-[80px]"></div>

        <div className="relative z-10 text-center px-6">
          <div className="bg-gradient-to-tr from-[#FB7299] to-[#FF5D87] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#FB7299]/20 rotate-3">
            <FaLock className="text-3xl text-white" />
          </div>

          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
            Jplus <span className="text-[#FB7299]">VIP</span> Exclusive
          </h2>
          
          <p className="text-gray-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            This sector is restricted to authorized members only
          </p>

          <Link href="/premium">
            <button className="group relative bg-white text-black px-10 py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all hover:bg-[#FB7299] hover:text-white hover:scale-105 active:scale-95 shadow-xl">
              <span className="flex items-center gap-2">
                <FaCrown className="group-hover:animate-bounce" /> Upgrade_Now (฿99)
              </span>
            </button>
          </Link>
          
          <p className="mt-6 text-[9px] text-gray-700 font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
            <FaShieldAlt /> Secured_By_Jplus_Shield_v2.5
          </p>
        </div>
      </div>
    );
  }

  // ✅ [AUTHORIZED_ACCESS_PROTOCOL] - กรณีได้รับอนุญาตให้เข้าถึง
  return (
    <div className="relative w-full aspect-video group">
      {/* หน้ากากป้องกันการคลิกขวา (ถ้าต้องการ) */}
      <iframe 
        src={src} 
        className="w-full h-full rounded-[2rem] border border-white/5 shadow-2xl bg-black" 
        allowFullScreen 
        frameBorder="0"
        title="Jplus_Stream_Core"
      ></iframe>
      
      {/* Overlay ตกแต่งขอบตอนเอาเมาส์วาง */}
      <div className="absolute inset-0 border-2 border-[#FB7299]/0 group-hover:border-[#FB7299]/20 transition-all duration-700 rounded-[2rem] pointer-events-none"></div>
    </div>
  );
}