import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FaList, FaPlayCircle, FaArrowLeft, FaHeart, FaRegHeart, FaPaperPlane } from 'react-icons/fa';

export default function Watch() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [anime, setAnime] = useState(null);
  const [currentEp, setCurrentEp] = useState(0);
  const [videoUrl, setVideoUrl] = useState(''); // เก็บลิงก์วิดีโอตัวจริง
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  // 1. โหลดข้อมูลหนัง
  useEffect(() => {
    if(id) {
      axios.get(`/api/animes/${id}`).then(res => {
          setAnime(res.data);
      });
    }
  }, [id]);

  // 2. [ระบบ Smart Player] แปลงรหัส GOGO เป็นลิงก์ดูหนัง
  useEffect(() => {
    if (anime && anime.episodes[currentEp]) {
        const serverUrl = anime.episodes[currentEp].servers[0].url;
        
        if (serverUrl.startsWith('GOGO:')) {
            // ถ้าเป็นรหัส GOGO ให้ไปดึงลิงก์ดูสดๆ มาเดี๋ยวนั้นเลย
            setIsLoadingVideo(true);
            const episodeId = serverUrl.split('GOGO:')[1];
            
            axios.get(`https://api.consumet.org/anime/gogoanime/watch/${episodeId}`)
                 .then(res => {
                     // ดึงลิงก์ Embed จาก Referer (วิธีลับ!)
                     const embedLink = res.data.headers?.Referer; 
                     setVideoUrl(embedLink || 'https://www.youtube.com/embed/error'); // ถ้าหาไม่เจอใส่ error ไว้
                     setIsLoadingVideo(false);
                 })
                 .catch(() => {
                     // ถ้าเซิฟเวอร์หลักล่ม ให้ใช้ลิงก์สำรอง (Trailer)
                     setVideoUrl('https://www.youtube.com/embed/M7lc1UVf-VE'); 
                     setIsLoadingVideo(false);
                 });
        } else {
            // ถ้าเป็นลิงก์ปกติ (YouTube) ก็เล่นเลย
            setVideoUrl(serverUrl);
        }
    }
  }, [anime, currentEp]);

  if(!anime) return <div className="min-h-screen bg-[#18191C] flex items-center justify-center text-white">Loading...</div>;
  const activeEpisode = anime.episodes[currentEp];

  return (
    <div className="min-h-screen bg-[#18191C] text-white font-sans pb-10">
      <div className="bg-[#2A2B2F] p-4 flex items-center gap-4 shadow-md sticky top-0 z-50">
          <Link href="/"><button className="text-gray-400 hover:text-white"><FaArrowLeft /></button></Link>
          <h1 className="text-sm font-bold line-clamp-1 text-gray-200">{anime.title} <span className="text-[#FB7299]">EP {activeEpisode?.number}</span></h1>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:flex gap-6">
        <div className="flex-1">
           {/* จอหนัง */}
           <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative">
              {isLoadingVideo ? (
                  <div className="absolute inset-0 flex items-center justify-center text-[#FB7299] animate-pulse">
                      กำลังดึงสัญญาณดาวเทียม... (รอแป๊บ)
                  </div>
              ) : (
                  <iframe src={videoUrl} className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay; encrypted-media"></iframe>
              )}
           </div>
           
           <div className="mt-4 mb-8">
              <h2 className="text-xl font-bold text-[#00A1D6]">{anime.title}</h2>
              <p className="text-gray-400 text-xs mt-2">{anime.synopsis}</p>
           </div>
        </div>

        <div className="lg:w-80 mt-6 lg:mt-0 flex-shrink-0">
           <div className="bg-[#2A2B2F] rounded-xl p-4 h-[500px] flex flex-col">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-300"><FaList /> ตอนทั้งหมด</h3>
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