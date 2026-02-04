import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import MangaList from '../components/MangaList';
import Head from 'next/head'; 
import { FaFire, FaGlobeAsia, FaLayerGroup } from 'react-icons/fa';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { search } = router.query; // 🔍 รับคำค้นหาจาก Navbar (เช่น ?search=naruto)

  // 🔓 [GUEST_PROTOCOL] - ผมคอมเมนต์ตัวดีดออกให้แล้วครับ
  // เพื่อให้แขกขาจรเข้ามาดูปกมังงะสวยๆ ได้ (กระตุ้นให้อยากสมัคร)
  /*
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); 
    }
  }, [user, loading, router]);
  */

  // ถ้า AuthContext กำลังโหลด ให้โชว์หน้าว่างๆ ไปก่อน (หรือใช้ Loading ของ AuthProvider)
  if (loading) return null; 

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FB7299]/30 font-sans">
      <Head>
        <title>JPLUS MANGA+ | The Ultimate Streaming DB</title>
      </Head>

      <Navbar />

      <main className="relative max-w-[1800px] mx-auto px-4 md:px-8 pb-20 pt-6">
        
        {/* 🌟 HERO BANNER (ป้ายยาหน้าแรก) - โชว์เฉพาะตอนไม่ได้ค้นหา */}
        {!search && (
          <div className="relative mb-16 rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-[#FB7299] to-[#FF4D80] p-8 md:p-14 shadow-[0_20px_60px_rgba(251,114,153,0.3)] group">
            
            {/* Text Content */}
            <div className="relative z-10 flex flex-col items-start gap-4 max-w-2xl">
               <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20 animate-pulse flex items-center gap-2">
                 <FaFire /> Trending_Now
               </span>
               <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-lg leading-tight">
                 Explore the <br/> <span className="text-black/20 group-hover:text-white/30 transition-colors duration-500">Unseen</span> World
               </h1>
               <p className="text-sm md:text-base font-bold text-white/90 leading-relaxed max-w-lg">
                 JPLUS DATABASE V3.0 - เข้าถึงคลังมังงะระดับโลกด้วยความเร็วแสง ระบบแปลภาษาอัตโนมัติและเซิร์ฟเวอร์ความเร็วสูงจากสิงคโปร์
               </p>
            </div>

            {/* Decor Icon */}
            <div className="absolute right-[-50px] bottom-[-80px] text-[350px] text-black/10 rotate-12 group-hover:rotate-[20deg] group-hover:scale-110 transition-all duration-700 pointer-events-none">
              <FaGlobeAsia />
            </div>
            
            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none"></div>
          </div>
        )}

        {/* 📂 CONTENT HEADER */}
        <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-3">
              {search ? (
                <>🔍 Results for: <span className="text-[#FB7299] underline decoration-4 decoration-[#FB7299]/30">"{search}"</span></>
              ) : (
                <>Recommended <span className="text-[#FB7299]">Manga</span></>
              )}
            </h2>
            <p className="text-gray-500 text-[10px] font-bold mt-2 tracking-[0.4em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00A1D6] rounded-full animate-pulse"></span>
              {search ? 'Querying_Database...' : 'Global_Synchronization_Active'}
            </p>
          </div>
          
          {/* Filter Icon (Decoration) */}
          <div className="hidden md:flex items-center gap-2 text-gray-600">
             <FaLayerGroup className="text-lg" />
          </div>
        </div>

        {/* 📚 MANGA LIST GRID */}
        {/* ส่งค่า search ไปให้ MangaList กรองข้อมูล (ลูกพี่ต้องไปแก้ MangaList ให้รับ prop นี้นะ) */}
        <MangaList searchQuery={search} />
        
      </main>
    </div>
  );
}