import Link from 'next/link';
import { useState } from 'react';
import { FaLock, FaCrown, FaShieldAlt, FaPlay, FaCircleNotch } from 'react-icons/fa';

/**
 * JPLUS_ULTIMATE_PLAYER v3.0
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * สถานะ: UPGRADED - เพิ่ม Loading State และดีไซน์ระดับ GOD
 */

export default function Player({ src, isPremium, userHasAccess }) {
  const [isLoading, setIsLoading] = useState(true);

  // 🚫 [ACCESS DENIED] - หน้าจอล็อคสำหรับ VIP
  if (isPremium && !userHasAccess) {
    return (
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
        
        {/* Background Effect (Blured) */}
        <div className="absolute inset-0 bg-[#0a0a0a] z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#FB7299]/20 via-transparent to-[#00A1D6]/20 blur-[100px] animate-pulse"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
          
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-[#FB7299] blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-tr from-[#FB7299] to-[#FF4D80] rounded-3xl rotate-6 flex items-center justify-center shadow-2xl shadow-[#FB7299]/30 border border-white/20">
              <FaLock className="text-4xl text-white drop-shadow-md" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase mb-2 drop-shadow-lg">
            VIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FB7299] to-white">ACCESS ONLY</span>
          </h2>
          
          <p className="text-gray-400 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-8 border-b border-white/10 pb-4">
            Restricted Area • Authorized Personnel Only
          </p>

          <Link href="/premium">
            <button className="relative overflow-hidden group/btn bg-white text-black pl-8 pr-10 py-4 rounded-full font-black text-sm tracking-widest uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(251,114,153,0.6)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FB7299] to-[#FF4D80] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-3 group-hover/btn:text-white transition-colors">
                <FaCrown className="text-lg animate-bounce" /> 
                Unlock_Now <span className="text-[10px] opacity-60 ml-1"> (฿99)</span>
              </span>
            </button>
          </Link>
          
          <div className="mt-8 flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest opacity-60">
            <FaShieldAlt /> Secured by Jplus_Gatekeeper
          </div>
        </div>
      </div>
    );
  }

  // ✅ [ACCESS GRANTED] - เครื่องเล่น
  return (
    <div className="relative w-full aspect-video group rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl">
      
      {/* Loading Spinner (โชว์ตอนกำลังโหลด iframe) */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
          <FaCircleNotch className="text-4xl text-[#FB7299] animate-spin mb-4" />
          <p className="text-[#FB7299] text-xs font-black animate-pulse tracking-widest">LOADING STREAM...</p>
        </div>
      )}

      {/* Main Player */}
      <iframe 
        src={src} 
        className={`relative z-10 w-full h-full transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        allowFullScreen 
        frameBorder="0"
        onLoad={() => setIsLoading(false)} // โหลดเสร็จค่อยโชว์
        title="Jplus_Stream_Core"
      ></iframe>
      
      {/* Decorative Glow on Hover */}
      <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-[#FB7299]/30 rounded-3xl transition-all duration-500 z-20"></div>
    </div>
  );
}