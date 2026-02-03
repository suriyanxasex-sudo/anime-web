import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaInfoCircle, FaCog, FaSearchPlus, FaSearchMinus, FaExpand, FaLock, FaTerminal } from 'react-icons/fa';

export default function Reader() {
  const router = useRouter();
  const { id, title, source } = router.query;
  const [zoom, setZoom] = useState(100);
  const [isReady, setIsReady] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const iframeRef = useRef(null);

  // 1. ระบบจำประวัติการอ่านระดับลึก (Enhanced Tracking System)
  useEffect(() => {
    if (id && title) {
      const readHistory = {
        id,
        title,
        source: source || 'GLOBAL_INDEX',
        timestamp: new Date().getTime(),
        lastZoom: zoom
      };
      localStorage.setItem('JPLUS_LAST_READ', JSON.stringify(readHistory));
      setIsReady(true);
      console.log(`[READER_LOG] Establishing connection to source: ${id}`);
    }
  }, [id, title, source, zoom]);

  // 2. ระบบปรับขนาดอัจฉริยะ (Adaptive Zoom)
  const handleZoom = (type) => {
    if (type === 'IN') setZoom(prev => Math.min(prev + 10, 200));
    if (type === 'OUT') setZoom(prev => Math.max(prev - 10, 50));
    if (type === 'RESET') setZoom(100);
  };

  if (!id && isReady) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-[#FB7299] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#FB7299] font-black text-[10px] tracking-[0.4em] uppercase">Loading_Secure_Stream...</p>
    </div>
  );

  return (
    <div className="bg-[#050505] h-screen flex flex-col overflow-hidden font-mono selection:bg-[#FB7299]/30">
      
      {/* 🔴 HEADER_COMMAND_BAR */}
      <nav className="h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-6 z-[100] shadow-2xl">
        <div className="flex items-center gap-6">
          <Link href="/">
            <button className="flex items-center gap-3 text-[10px] font-black text-white bg-white/5 hover:bg-[#FB7299] px-5 py-2.5 rounded-2xl transition-all duration-300 group shadow-lg">
              <FaChevronLeft className="group-hover:-translate-x-1 transition" /> EXIT_SESSION
            </button>
          </Link>
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>
          <div className="hidden md:flex flex-col">
            <h1 className="text-white font-black text-xs uppercase tracking-tighter truncate max-w-lg italic">
              {title || 'UNNAMED_ID_IDENTIFIED'}
            </h1>
            <span className="text-[8px] text-[#FB7299] font-bold tracking-[0.2em]">{id} | SOURCE_ACTIVE</span>
          </div>
        </div>

        {/* ⚙️ READER_SETTINGS_MODULE */}
        <div className="flex items-center gap-6 bg-[#111] px-6 py-2 rounded-2xl border border-white/5 shadow-inner">
            <div className="flex items-center gap-4 border-r border-white/10 pr-4">
                <button onClick={() => handleZoom('OUT')} className="text-gray-500 hover:text-white transition"><FaSearchMinus /></button>
                <span className="text-[10px] font-black text-[#00A1D6] w-10 text-center">{zoom}%</span>
                <button onClick={() => handleZoom('IN')} className="text-gray-500 hover:text-white transition"><FaSearchPlus /></button>
            </div>
            <div className="flex items-center gap-4">
                <FaExpand className="text-gray-600 cursor-pointer hover:text-white transition text-xs" onClick={() => handleZoom('RESET')} />
                <FaTerminal 
                  className={`text-xs cursor-pointer transition ${debugMode ? 'text-[#00ff41]' : 'text-gray-600'}`} 
                  onClick={() => setDebugMode(!debugMode)} 
                />
                <FaCog className="text-gray-600 cursor-pointer hover:rotate-180 transition-all duration-700 text-sm" />
            </div>
        </div>
      </nav>

      {/* 📖 DEEP_STREAM_VIEWER */}
      <main className="flex-1 w-full bg-black relative overflow-hidden group">
        <div 
          className="w-full h-full flex justify-center transition-transform duration-300 ease-out" 
          style={{ transform: `scale(${zoom/100})`, transformOrigin: 'top center' }}
        >
            {/* ระบบเจาะทะลวงดึงข้อมูลจาก MangaDex หรือ Source อื่นๆ */}
            <iframe
              ref={iframeRef}
              src={`https://mangadex.org/book/${id}`}
              className="w-full max-w-[1200px] h-full border-none shadow-[0_0_150px_rgba(0,0,0,1)] bg-white"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            ></iframe>
        </div>
        
        {/* 🛡️ SECURITY_OVERLAY (ป้องกันการคลิกนอกเหนือคำสั่ง) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FB7299] via-[#00A1D6] to-[#FB7299] z-[60]"></div>
        
        {/* DEBUG_CONSOLE: สำหรับ Admin Joshua เท่านั้น */}
        {debugMode && (
          <div className="absolute bottom-10 left-10 z-[100] bg-black/90 border border-[#00ff41]/30 p-6 rounded-3xl w-80 font-mono text-[10px] text-[#00ff41] shadow-2xl backdrop-blur-xl">
             <p className="mb-2 border-b border-[#00ff41]/20 pb-2 flex justify-between">
                <span>[ JPLUS_DEBUG_CORE ]</span>
                <span className="animate-pulse">● LIVE</span>
             </p>
             <p className="mb-1 italic text-[#00ff41]/50">ID: {id}</p>
             <p className="mb-1 italic text-[#00ff41]/50">ZOOM_LVL: {zoom}</p>
             <p className="mb-1 italic text-[#00ff41]/50">BUFFER: STABLE</p>
             <p className="mt-4 text-white font-black underline cursor-pointer">FORCE_RELOAD_ASSET.SH</p>
          </div>
        )}
      </main>

      {/* 📱 FOOTER_STATUS_BAR */}
      <footer className="h-10 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between px-8 text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">
          <div className="flex items-center gap-2">
            <FaLock className="text-[#FB7299]/30" /> 
            <span>Encrypted_Protocol_v2.5</span>
          </div>
          <div className="hidden md:block">
            AUTHORIZED_FOR: {user?.username || 'GUEST_USER'}
          </div>
          <div>
            JPLUS_MANGA_PLATFORM © 2026
          </div>
      </footer>
    </div>
  );
}