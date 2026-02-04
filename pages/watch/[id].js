import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext'; // เรียกใช้ Auth เพื่อบันทึกประวัติ
import axios from 'axios';
import Link from 'next/link';
import { FaHome, FaChevronLeft, FaChevronRight, FaList, FaCog, FaArrowLeft } from 'react-icons/fa';

export default function Watch() {
  const router = useRouter();
  const { id, ch } = router.query; // id = mangaId, ch = chapterNumber
  const { user } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true); // สถานะซ่อน/โชว์เมนู

  // 1. [DATA_FETCHING] - ดึงข้อมูลมังงะ + รูปภาพ
  useEffect(() => {
    if (!id) return;
    
    const loadData = async () => {
      setLoading(true);
      try {
        // เรียก API อ่านมังงะ
        const res = await axios.get(`/api/manga/read?id=${id}&chapter=${ch || 1}`);
        setData(res.data);
        
        // ⚡️ [HISTORY_TRACKER] - ถ้ามี User ให้บันทึกประวัติการอ่านเงียบๆ
        if (user) {
           axios.post('/api/user/history', {
             userId: user._id,
             mangaId: id,
             chapter: ch || 1
           }).catch(err => console.warn("Failed to save history"));
        }

      } catch (err) { 
        console.error("Reader Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, [id, ch, user]);

  // 2. [KEYBOARD_CONTROLS] - กดลูกศรซ้ายขวาเพื่อเปลี่ยนตอน
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!data) return;
      if (e.key === 'ArrowRight') handleNextChapter();
      if (e.key === 'ArrowLeft') handlePrevChapter();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data]);

  // ฟังก์ชันนำทาง
  const handleNextChapter = () => {
    // (Logic นี้ลูกพี่ต้องปรับให้ตรงกับ API ว่ารู้ได้ไงว่าตอนต่อไปคือเลขอะไร)
    // เบื้องต้นใช้ +1 ไปก่อน แต่ดีที่สุดคือ Backend ควรส่ง nextChapterId มาให้
    const nextCh = parseFloat(ch || 1) + 1;
    router.push(`/watch/${id}?ch=${nextCh}`);
  };

  const handlePrevChapter = () => {
    const prevCh = parseFloat(ch || 1) - 1;
    if (prevCh >= 1) router.push(`/watch/${id}?ch=${prevCh}`);
  };

  // ฟังก์ชัน Proxy รูปภาพ (กันติด CORS)
  const proxied = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

  // 3. [LOADING_STATE] - หน้าโหลดแบบเท่ๆ
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-sans z-50">
       <div className="w-16 h-16 border-4 border-[#FB7299] border-t-transparent rounded-full animate-spin mb-4"></div>
       <div className="text-[#FB7299] font-black italic animate-pulse tracking-widest text-xs">
          LOADING_ARTWORKS...
       </div>
    </div>
  );

  // 4. [ERROR_STATE] - กรณีไม่เจอข้อมูล
  if (!data || !data.pages || data.pages.length === 0) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-10 text-center font-sans">
      <h2 className="text-4xl font-black mb-4 text-[#FB7299] italic">NO CONTENT</h2>
      <p className="text-gray-500 mb-8 text-sm uppercase tracking-widest">
        This chapter is empty or encrypted.
      </p>
      <button onClick={() => router.push(`/manga/${id}`)} className="px-8 py-3 bg-white text-black font-black rounded-full hover:bg-[#FB7299] hover:text-white transition-all">
         RETURN TO MANGA PAGE
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111] text-white selection:bg-[#FB7299]/30">
      
      {/* 🔥 [IMMERSIVE_HEADER] - เมนูด้านบน (ซ่อนได้) */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center shadow-2xl">
          
          <div className="flex items-center gap-4">
             <button onClick={() => router.push(`/manga/${id}`)} className="text-gray-400 hover:text-white transition-colors">
                <FaArrowLeft />
             </button>
             <div className="flex flex-col">
                <h1 className="text-xs font-black text-[#FB7299] uppercase tracking-widest line-clamp-1">
                   {data.title}
                </h1>
                <span className="text-sm font-bold text-white">
                   Chapter {ch || 1}
                </span>
             </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3 text-gray-400 hover:text-white bg-white/5 rounded-full">
               <FaList />
            </button>
            <Link href="/">
               <button className="p-3 text-gray-400 hover:text-[#FB7299] bg-white/5 rounded-full">
                  <FaHome />
               </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 📖 [READER_AREA] - พื้นที่อ่านมังงะ */}
      {/* onClick เพื่อสลับโหมดซ่อนเมนู */}
      <div 
        className="max-w-[800px] mx-auto min-h-screen bg-[#111] cursor-pointer"
        onClick={() => setShowControls(!showControls)}
      >
        {/* ใช้ flex-col และ gap-0 เพื่อให้ภาพต่อกันเนียนกริบ */}
        <div className="flex flex-col w-full">
          {data.pages.map((url, i) => (
            <img 
              key={i} 
              src={proxied(url)} 
              className="w-full h-auto block select-none" // block เพื่อลบช่องว่างบรรทัด
              loading="lazy" 
              alt={`Page ${i+1}`} 
            />
          ))}
        </div>
      </div>

      {/* 🔥 [IMMERSIVE_FOOTER] - เมนูด้านล่าง (ซ่อนได้) */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 p-4 pb-8">
           <div className="max-w-[800px] mx-auto flex items-center justify-between gap-4">
              
              {/* ปุ่มย้อนกลับ */}
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrevChapter(); }}
                disabled={parseFloat(ch) <= 1}
                className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                 <FaChevronLeft /> Prev
              </button>

              {/* ตัวบอกเลขตอน */}
              <div className="text-center px-4">
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Current</span>
                 <p className="text-xl font-black text-[#FB7299]">CH.{ch || 1}</p>
              </div>

              {/* ปุ่มถัดไป */}
              <button 
                onClick={(e) => { e.stopPropagation(); handleNextChapter(); }}
                className="flex-1 bg-[#FB7299] hover:bg-[#FF5D87] text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-[#FB7299]/20 flex items-center justify-center gap-2"
              >
                 Next <FaChevronRight />
              </button>

           </div>
        </div>
      </div>

      {/* Next Chapter Trigger (พื้นที่ด้านล่างสุด เผื่อคนอ่านเพลินเลื่อนเลย) */}
      <div className="max-w-[800px] mx-auto p-10 text-center bg-[#050505]">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-6">End of Chapter {ch || 1}</p>
          <button 
            onClick={handleNextChapter}
            className="w-full py-4 border border-white/10 rounded-2xl text-white hover:bg-white/5 transition-all uppercase font-black tracking-widest"
          >
             Read Next Chapter
          </button>
      </div>

    </div>
  );
}