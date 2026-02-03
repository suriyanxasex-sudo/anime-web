import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { FaList, FaPlayCircle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function Watch() {
  const router = useRouter();
  const { id } = router.query;
  const [anime, setAnime] = useState(null);
  const [currentEp, setCurrentEp] = useState(0); // เก็บ index ของตอนปัจจุบัน
  
  useEffect(() => {
    if(id) {
      axios.get(`/api/animes/${id}`).then(res => setAnime(res.data));
    }
  }, [id]);

  if(!anime) return <div className="min-h-screen bg-[#18191C] text-white flex items-center justify-center">Loading...</div>;

  const activeEpisode = anime.episodes[currentEp];

  return (
    <div className="min-h-screen bg-[#18191C] text-white font-sans">
      {/* Header กลับหน้าหลัก */}
      <div className="bg-[#2A2B2F] p-4 flex items-center gap-4 shadow-md sticky top-0 z-50">
        <Link href="/">
           <button className="text-gray-400 hover:text-white"><FaArrowLeft /></button>
        </Link>
        <h1 className="text-sm font-bold line-clamp-1 text-gray-200">
            {anime.title} <span className="text-[#FB7299]">EP {activeEpisode?.number}</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:flex gap-6">
        
        {/* --- 📺 Video Player (ซ้าย/บน) --- */}
        <div className="flex-1">
           <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
              {activeEpisode ? (
                 <iframe 
                   src={activeEpisode.servers[0].url} 
                   className="w-full h-full" 
                   frameBorder="0" 
                   allowFullScreen
                 ></iframe>
              ) : (
                 <div className="flex items-center justify-center h-full text-gray-500">เลือกตอนเพื่อรับชม</div>
              )}
           </div>
           
           <div className="mt-4">
              <h2 className="text-xl font-bold text-[#00A1D6]">{anime.title}</h2>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">{anime.synopsis || 'ไม่มีเรื่องย่อ'}</p>
           </div>
        </div>

        {/* --- 📜 Playlist (ขวา/ล่าง) --- */}
        <div className="lg:w-80 mt-6 lg:mt-0 flex-shrink-0">
           <div className="bg-[#2A2B2F] rounded-xl p-4 h-[500px] flex flex-col">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-300">
                 <FaList /> รายการตอน ({anime.episodes.length})
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                 {anime.episodes.map((ep, index) => (
                    <div 
                      key={index}
                      onClick={() => setCurrentEp(index)}
                      className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition ${
                        currentEp === index 
                        ? 'bg-[#FB7299] text-white shadow-lg' 
                        : 'bg-[#18191C] text-gray-400 hover:bg-[#3E3F45]'
                      }`}
                    >
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