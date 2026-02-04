import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext'; // ✅ IMPORT AUTH
import axios from 'axios';
import { FaChevronLeft, FaInfoCircle, FaCog, FaSearchPlus, FaSearchMinus, FaExpand, FaLock, FaTerminal, FaBug } from 'react-icons/fa';

export default function Reader() {
  const router = useRouter();
  const { id, ch } = router.query; // รับ id และ chapter
  const { user } = useAuth();
  
  // State
  const [pages, setPages] = useState([]);
  const [mangaTitle, setMangaTitle] = useState('LOADING_DATA...');
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [error, setError] = useState('');

  // 1. [DATA_INJECTION] - ดึงรูปภาพมาแสดง (แทน Iframe)
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(`[SYSTEM] Fetching Manga ID: ${id} Chapter: ${ch || 1}`);
        const res = await axios.get(`/api/manga/read?id=${id}&chapter=${ch || 1}`);
        
        if (res.data.pages) {
            setPages(res.data.pages);
            setMangaTitle(res.data.title || 'UNKNOWN_TITLE');
            
            // 📝 Save History
            if (user) {
                const historyData = {
                    id,
                    title: res.data.title,
                    timestamp: new Date().getTime(),
                    chapter: ch || 1
                };
                localStorage.setItem('JPLUS_LAST_READ', JSON.stringify(historyData));
            }
        }
      } catch (err) {
        console.error("Critical Failure:", err);
        setError("FAILED_TO_DECRYPT_SOURCE_DATA");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, ch, user]);

  // 2. [ZOOM_CONTROLLER] - ระบบซูมภาพ
  const handleZoom = (type) => {
    if (type === 'IN') setZoom(prev => Math.min(prev + 10, 200));
    if (type === 'OUT') setZoom(prev => Math.max(prev - 10, 50));
    if (type === 'RESET') setZoom(100);
  };

  // Proxy Helper
  const proxied = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 font-mono">
      <div className="relative">
          <div className="w-16 h-16 border-4 border-[#FB7299] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] text-white font-black animate-pulse">CORE</span>
          </div>
      </div>
      <p className="text-[#FB7299] font-black text-[10px] tracking-[0.4em] uppercase animate-pulse">Initializing_Reader_Protocol...</p>
    </div>
  );

  return (
    <div className="bg-[#050505] h-screen flex flex-col overflow-hidden font-mono selection:bg-[#FB7299]/30">
      
      {/* 🔴 HEADER_COMMAND_BAR */}
      <nav className="h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-4 md:px-6 z-[100] shadow-[0_5px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="flex items-center gap-3 text-[10px] font-black text-white bg-white/5 hover:bg-[#FB7299] px-5 py-2.5 rounded-xl transition-all duration-300 group shadow-lg border border-white/5 hover:border-[#FB7299]">
             <FaChevronLeft className="group-hover:-translate-x-1 transition" /> ABORT
          </button>
          
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>
          
          <div className="hidden md:flex flex-col">
            <h1 className="text-white font-black text-xs uppercase tracking-tighter truncate max-w-md italic">
              {mangaTitle}
            </h1>
            <span className="text-[8px] text-[#00A1D6] font-bold tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></span>
                LIVE_STREAM :: CH.{ch || 1}
            </span>
          </div>
        </div>

        {/* ⚙️ READER_SETTINGS_MODULE */}
        <div className="flex items-center gap-4 bg-[#111] px-4 py-1.5 rounded-xl border border-white/5 shadow-inner">
            <div className="flex items-center gap-3 border-r border-white/10 pr-3">
                <button onClick={() => handleZoom('OUT')} className="text-gray-500 hover:text-white transition p-1"><FaSearchMinus /></button>
                <span className="text-[10px] font-black text-[#FB7299] w-8 text-center">{zoom}%</span>
                <button onClick={() => handleZoom('IN')} className="text-gray-500 hover:text-white transition p-1"><FaSearchPlus /></button>
            </div>
            <div className="flex items-center gap-3">
                <FaExpand className="text-gray-600 cursor-pointer hover:text-[#00A1D6] transition text-xs" onClick={() => handleZoom('RESET')} title="Reset Zoom" />
                <FaBug 
                  className={`text-xs cursor-pointer transition ${debugMode ? 'text-[#00ff41]' : 'text-gray-600'}`} 
                  onClick={() => setDebugMode(!debugMode)} 
                  title="Debug Mode"
                />
            </div>
        </div>
      </nav>

      {/* 📖 IMAGE_CONTAINER (Replaces Iframe) */}
      <main className="flex-1 w-full bg-[#111] relative overflow-y-auto overflow-x-hidden scrollbar-hide">
        
        {/* Error State */}
        {error && (
            <div className="flex flex-col items-center justify-center h-full text-red-500 gap-4">
                <FaLock className="text-4xl" />
                <h2 className="text-xl font-black uppercase tracking-widest">{error}</h2>
            </div>
        )}

        {/* Images List */}
        {!error && (
            <div 
            className="w-full flex flex-col items-center min-h-full transition-transform duration-200 ease-out origin-top py-10" 
            style={{ transform: `scale(${zoom/100})` }}
            >
            {pages.map((url, i) => (
                <img 
                    key={i} 
                    src={proxied(url)} 
                    className="max-w-full md:max-w-[800px] shadow-2xl mb-1 select-none"
                    loading="lazy"
                    alt={`p-${i}`}
                />
            ))}
            
            {/* End of Chapter */}
            <div className="mt-10 mb-20 text-center">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em]">End_Of_Transmission</p>
                <div className="w-20 h-1 bg-white/10 mx-auto mt-4 rounded-full"></div>
            </div>
            </div>
        )}
        
        {/* DEBUG_CONSOLE */}
        {debugMode && (
          <div className="fixed bottom-14 left-4 z-[100] bg-black/95 border border-[#00ff41]/30 p-4 rounded-xl w-64 font-mono text-[9px] text-[#00ff41] shadow-2xl backdrop-blur-sm">
             <p className="mb-2 border-b border-[#00ff41]/20 pb-1 flex justify-between font-bold">
                <span>[ SYSTEM_DIAGNOSTICS ]</span>
                <span className="animate-pulse">● REC</span>
             </p>
             <div className="space-y-1 opacity-80">
                <p>TARGET_ID: {id}</p>
                <p>RENDER_SCALE: {(zoom/100).toFixed(2)}x</p>
                <p>PAGES_LOADED: {pages.length}</p>
                <p>MEM_USAGE: {pages.length * 1.2}MB (EST)</p>
                <p>USER_AUTH: {user ? 'GRANTED' : 'GUEST'}</p>
             </div>
          </div>
        )}
      </main>

      {/* 📱 FOOTER_STATUS_BAR */}
      <footer className="h-10 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between px-6 text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] z-50">
          <div className="flex items-center gap-2">
            <FaLock className="text-[#FB7299]" /> 
            <span className="text-gray-500">SECURE_CONNECTION_ESTABLISHED</span>
          </div>
          <div className="hidden md:block">
            OPERATOR: <span className="text-[#00A1D6]">{user?.username || 'ANONYMOUS'}</span>
          </div>
          <div>
            JPLUS v3.0
          </div>
      </footer>
    </div>
  );
}