import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaHome, FaExpand, FaListUl, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function MangaReader() {
  const router = useRouter();
  const { id } = router.query;
  const [manga, setManga] = useState(null);
  const [currentChIdx, setCurrentChIdx] = useState(0);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // 1. ดึงข้อมูลมังงะตัวเต็มจาก Database ของเรา
  useEffect(() => {
    if (id) {
      axios.get(`/api/manga/${id}`)
        .then(res => {
          setManga(res.data);
          // ตั้งค่าตอนเริ่มต้น (อาจจะเริ่มที่ตอนแรกสุด)
          setCurrentChIdx(0); 
        })
        .catch(err => console.error("FAILED_TO_LOAD_MANGA_METADATA"));
    }
  }, [id]);

  // 2. ดึงรูปภาพของตอนปัจจุบัน (Multi-Source Logic)
  useEffect(() => {
    if (manga && manga.chapters && manga.chapters[currentChIdx]) {
      setLoading(true);
      const targetChapter = manga.chapters[currentChIdx];
      
      // ดึงข้อมูลรูปภาพ (เรียกผ่าน API ภายนอกหรือ Proxy ของเรา)
      // ในที่นี้ผมปรับให้รองรับข้อมูลที่เรา Scrape มาจากหลายแหล่ง
      axios.get(`https://api.consumet.org/manga/mangareader/read?chapterId=${targetChapter.sourceUrl.split('ID:')[1] || targetChapter.chapterNum}`)
        .then(res => {
          setPages(res.data || []);
          setLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(() => {
          // Fallback กรณี Source หลักพัง ให้บอทลองหาทางอื่น (จำลอง)
          setLoading(false);
        });
    }
  }, [manga, currentChIdx]);

  // ระบบซ่อน Controls อัตโนมัติเวลาเลื่อนอ่าน
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) setShowControls(false);
      else setShowControls(true);
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!manga) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#FB7299] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#FB7299] font-black text-xs tracking-[0.3em] italic animate-pulse underline decoration-2">JOSHUA_INITIALIZING_READER...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-[#FB7299]/30">
      
      {/* 🛠️ TOP NAVIGATION (STRIKING_UI) */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center transition-transform duration-500 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-6">
          <Link href="/">
            <button className="text-gray-500 hover:text-[#FB7299] transition-all transform hover:scale-110">
              <FaHome className="text-xl" />
            </button>
          </Link>
          <div className="hidden md:block">
            <h1 className="text-sm font-black italic tracking-tighter truncate max-w-[300px] text-white uppercase">{manga.title}</h1>
            <p className="text-[#FB7299] text-[9px] font-bold uppercase tracking-widest">Chapter: {manga.chapters[currentChIdx]?.chapterNum}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
          <button 
            disabled={currentChIdx === 0} 
            onClick={() => setCurrentChIdx(currentChIdx - 1)} 
            className="disabled:opacity-20 hover:text-[#FB7299] transition"
          >
            <FaArrowLeft />
          </button>
          
          <div className="flex items-center gap-2 px-4 border-x border-white/10 mx-2">
            <FaListUl className="text-[10px] text-gray-500" />
            <span className="text-xs font-black tracking-tighter">{currentChIdx + 1} / {manga.chapters.length}</span>
          </div>

          <button 
            disabled={currentChIdx === manga.chapters.length - 1} 
            onClick={() => setCurrentChIdx(currentChIdx + 1)} 
            className="disabled:opacity-20 hover:text-[#FB7299] transition"
          >
            <FaArrowRight />
          </button>
        </div>

        <button className="hidden md:block text-gray-500 hover:text-white transition">
          <FaExpand className="text-sm" />
        </button>
      </nav>

      {/* 📖 READER AREA */}
      <div className="max-w-3xl mx-auto pt-20 pb-20 px-0 md:px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
            <FaSpinner className="text-4xl text-[#FB7299] animate-spin" />
            <p className="text-[10px] font-black tracking-[0.4em] text-[#FB7299] uppercase animate-pulse">Synchronizing_Pages...</p>
          </div>
        ) : (
          <div className="flex flex-col bg-black shadow-[0_0_100px_rgba(0,0,0,1)]">
            {pages.length > 0 ? pages.map((page, index) => (
              <div key={index} className="relative group">
                <img 
                  src={page.img} 
                  alt={`Page ${index + 1}`} 
                  className="w-full h-auto select-none pointer-events-none" 
                  loading="lazy" 
                />
                {/* Page Number Overlay */}
                <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-black bg-black/60 text-white/40 px-3 py-1 rounded-full">
                  PAGE_{index + 1}
                </div>
              </div>
            )) : (
              <div className="text-center py-40 border-2 border-dashed border-white/5 m-6 rounded-[3rem]">
                <p className="text-gray-600 text-xs font-black italic uppercase tracking-widest">[ ERROR: CONTENT_UNAVAILABLE_IN_THIS_SOURCE ]</p>
                <button className="mt-6 text-[#FB7299] text-[10px] font-black underline">TRY_SOURCE_B</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ⚡ BOTTOM NAVIGATION (FLOATING) */}
      {!loading && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#111]/80 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-full shadow-2xl">
          <button 
            disabled={currentChIdx === 0} 
            onClick={() => setCurrentChIdx(currentChIdx - 1)}
            className="text-xs font-black tracking-widest uppercase disabled:opacity-20 hover:text-[#FB7299] transition"
          >
            PREV_EP
          </button>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <button 
            disabled={currentChIdx === manga.chapters.length - 1} 
            onClick={() => setCurrentChIdx(currentChIdx + 1)}
            className="text-xs font-black tracking-widest uppercase disabled:opacity-20 hover:text-[#FB7299] transition"
          >
            NEXT_EP
          </button>
        </div>
      )}
    </div>
  );
}