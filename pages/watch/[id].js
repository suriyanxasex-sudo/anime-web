import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FaList, FaPlayCircle, FaArrowLeft } from 'react-icons/fa';

export default function Watch() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [anime, setAnime] = useState(null);
  const [currentEp, setCurrentEp] = useState(0);
  const [embedUrl, setEmbedUrl] = useState(''); // ลิงก์ Player เถื่อน
  const [loadingVideo, setLoadingVideo] = useState(false);

  // 1. โหลดข้อมูลหนัง
  useEffect(() => {
    if(id) {
      axios.get(`/api/animes/${id}`).then(res => setAnime(res.data));
    }
  }, [id]);

  // 2. ระบบขโมย Player (Extraction)
  useEffect(() => {
    if (anime && anime.episodes[currentEp]) {
        const serverData = anime.episodes[currentEp].servers[0].url;
        
        if (serverData.startsWith('ID:')) {
            setLoadingVideo(true);
            const episodeId = serverData.split('ID:')[1];
            
            // เรียก API ไปถามหาลิงก์ Embed จริงๆ
            axios.get(`https://api.consumet.org/anime/gogoanime/watch/${episodeId}`)
                 .then(res => {
                     // *** จุดทีเด็ด ***
                     // เราจะเอา headers.Referer มาใช้ เพราะนั่นคือลิงก์ Embed Player ของจริง
                     // (เช่น https://embtaku.pro/streaming.php?id=...)
                     const realEmbed = res.data.headers?.Referer;
                     
                     if (realEmbed) {
                         setEmbedUrl(realEmbed);
                     } else {
                         // ถ้าไม่มี Referer ให้ลองเอา source ตัวแรก
                         setEmbedUrl(res.data.sources[0]?.url);
                     }
                     setLoadingVideo(false);
                 })
                 .catch(err => {
                     console.error(err);
                     setLoadingVideo(false);
                     // ถ้าพังจริงๆ
                 });
        } else {
            // เผื่อเป็นลิงก์เก่า
            setEmbedUrl(serverData);
        }
    }
  }, [anime, currentEp]);

  if(!anime) return <div className="min-h-screen bg-[#18191C] flex items-center justify-center text-white">กำลังโหลด...</div>;
  const activeEpisode = anime.episodes[currentEp];

  return (
    <div className="min-h-screen bg-[#18191C] text-white font-sans pb-10">
      <div className="bg-[#2A2B2F] p-4 flex items-center gap-4 shadow-md sticky top-0 z-50">
          <Link href="/"><button className="text-gray-400 hover:text-white"><FaArrowLeft /></button></Link>
          <h1 className="text-sm font-bold line-clamp-1 text-gray-200">{anime.title} <span className="text-[#FB7299]">EP {activeEpisode?.number}</span></h1>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:flex gap-6">
        <div className="flex-1">
           {/* จอหนัง (Iframe Embed) */}
           <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative">
              {loadingVideo ? (
                  <div className="absolute inset-0 flex items-center justify-center text-[#FB7299] animate-pulse">
                      กำลังจูนสัญญาณเถื่อน... ใจร่มๆ...
                  </div>
              ) : embedUrl ? (
                  <iframe 
                    src={embedUrl} 
                    className="w-full h-full" 
                    frameBorder="0" 
                    allowFullScreen 
                    scrolling="no"
                    // sandbox="allow-scripts allow-same-origin allow-presentation" 
                    // ^ ถ้าเปิด Sandbox บางที Player จะเล่นไม่ได้ แต่ถ้าปิดโฆษณาอาจจะเด้ง (ลองเปิดแบบนี้ไปก่อน)
                  ></iframe>
              ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-red-500">
                      ไม่สามารถดึงสัญญาณภาพได้ (Source Error)
                  </div>
              )}
           </div>
           
           <div className="mt-4 mb-8">
              <h2 className="text-xl font-bold text-[#00A1D6]">{anime.title}</h2>
              <div className="mt-2 text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                หมายเหตุ: เนื่องจากเราดึงสัญญาณสด ถ้ามีโฆษณาเด้งให้กดปิดเอานะครับ (เหมือนเว็บดูหนังทั่วไป)
              </div>
              <p className="text-gray-400 text-xs mt-2">{anime.synopsis}</p>
           </div>
        </div>

        <div className="lg:w-80 mt-6 lg:mt-0 flex-shrink-0">
           <div className="bg-[#2A2B2F] rounded-xl p-4 h-[500px] flex flex-col">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-300"><FaList /> เลือกตอน</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                 {anime.episodes.map((ep, index) => (
                    <div key={index} onClick={() => setCurrentEp(index)}
                      className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition ${currentEp === index ? 'bg-[#FB7299] text-white' : 'bg-[#18191C] text-gray-400 hover:bg-[#3E3F45]'}`}>
                       <FaPlayCircle className={currentEp === index ? 'text-white' : 'text-gray-600'} />
                       <div className="text-xs font-bold">ตอนที่ {ep.number}</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}