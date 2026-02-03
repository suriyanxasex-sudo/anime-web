import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext'; // ตรวจสอบ path นี้ให้ตรงกับเครื่องคุณ
import { FaList, FaPlayCircle, FaArrowLeft, FaServer } from 'react-icons/fa';

export default function Watch() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth(); // ถ้าไม่ได้ใช้ระบบสมาชิก บรรทัดนี้ลบได้ครับ
  
  const [anime, setAnime] = useState(null);
  const [currentEp, setCurrentEp] = useState(0);
  const [embedUrl, setEmbedUrl] = useState('');
  const [loadingVideo, setLoadingVideo] = useState(false);
  
  // State สำหรับเลือก Server (ค่าเริ่มต้นคือ vidcloud)
  const [serverName, setServerName] = useState('vidcloud'); 

  // 1. โหลดข้อมูลหนังจาก Database เราเอง
  useEffect(() => {
    if(id) {
      axios.get(`/api/animes/${id}`).then(res => setAnime(res.data));
    }
  }, [id]);

  // 2. ระบบ "Extraction" (เอารหัส ID ไปแลกเป็นลิงก์วิดีโอ)
  useEffect(() => {
    if (anime && anime.episodes[currentEp]) {
        const serverData = anime.episodes[currentEp].servers[0].url;
        
        // เช็กว่าเป็นรหัส ID หรือไม่
        if (serverData.startsWith('ID:')) {
            setLoadingVideo(true);
            setEmbedUrl(''); // เคลียร์จอเก่า
            const episodeId = serverData.split('ID:')[1];
            
            // เรียก API ไปขอลิงก์ Embed จริงๆ
            axios.get(`https://api.consumet.org/anime/gogoanime/watch/${episodeId}?server=${serverName}`)
                 .then(res => {
                      // พยายามหาลิงก์ที่ดีที่สุด (Referer > url)
                      const realEmbed = res.data.headers?.Referer || res.data.sources[0]?.url;
                      
                      if (realEmbed) {
                          setEmbedUrl(realEmbed);
                      } else {
                          console.error("No link found");
                      }
                      setLoadingVideo(false);
                 })
                 .catch(err => {
                      console.error("Server Error:", err);
                      setLoadingVideo(false);
                 });
        } else {
            // เผื่อเป็นลิงก์แบบเก่า (YouTube) หรือลิงก์ตรง
            setEmbedUrl(serverData);
        }
    }
  }, [anime, currentEp, serverName]); 

  if(!anime) return <div className="min-h-screen bg-[#18191C] flex items-center justify-center text-white">กำลังโหลด...</div>;
  const activeEpisode = anime.episodes[currentEp];

  return (
    <div className="min-h-screen bg-[#18191C] text-white font-sans pb-10">
      {/* Header */}
      <div className="bg-[#2A2B2F] p-4 flex items-center gap-4 shadow-md sticky top-0 z-50">
          <Link href="/"><button className="text-gray-400 hover:text-white"><FaArrowLeft /></button></Link>
          <h1 className="text-sm font-bold line-clamp-1 text-gray-200">{anime.title} <span className="text-[#FB7299]">EP {activeEpisode?.number}</span></h1>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:flex gap-6">
        <div className="flex-1">
           {/* จอหนัง */}
           <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative">
              {loadingVideo ? (
                  <div className="absolute inset-0 flex items-center justify-center text-[#FB7299] animate-pulse">
                      กำลังดึงสัญญาณจาก Server: {serverName.toUpperCase()}...
                  </div>
              ) : embedUrl ? (
                  <iframe 
                    src={embedUrl} 
                    className="w-full h-full" 
                    frameBorder="0" 
                    allowFullScreen 
                    scrolling="no"
                  ></iframe>
              ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 gap-2">
                      <p>ไม่พบสัญญาณภาพ ลองกดเปลี่ยน Server ด้านล่างครับ</p>
                  </div>
              )}
           </div>
           
           {/* ปุ่มเปลี่ยน Server */}
           <div className="mt-4 flex flex-wrap gap-2 items-center bg-[#2A2B2F] p-3 rounded-lg">
              <span className="text-xs text-gray-400 flex items-center gap-1"><FaServer/> Server:</span>
              {['vidcloud', 'gogocdn', 'streamsb', 'streamtape'].map((sv) => (
                  <button 
                    key={sv}
                    onClick={() => setServerName(sv)}
                    className={`px-3 py-1 rounded text-xs transition ${serverName === sv ? 'bg-[#FB7299] text-white' : 'bg-[#3E3F45] text-gray-300 hover:bg-gray-600'}`}
                  >
                    {sv.toUpperCase()}
                  </button>
              ))}
           </div>

           <div className="mt-4 mb-8">
              <h2 className="text-xl font-bold text-[#00A1D6]">{anime.title}</h2>
              <p className="text-gray-400 text-xs mt-2">{anime.synopsis}</p>
           </div>
        </div>

        {/* Playlist ด้านขวา */}
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