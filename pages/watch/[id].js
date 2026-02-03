import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaHome } from 'react-icons/fa';
import Link from 'next/link';

export default function Reader() {
  const router = useRouter();
  const { id } = router.query;
  const [manga, setManga] = useState(null);
  const [currentCh, setCurrentCh] = useState(0);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(id) axios.get(`/api/animes/${id}`).then(res => setManga(res.data));
  }, [id]);

  useEffect(() => {
    if (manga && manga.episodes[currentCh]) {
      setLoading(true);
      const chapterId = manga.episodes[currentCh].servers[0].url.split('ID:')[1];
      
      // ดึงรูปภาพทั้งหมดในตอนนี้
      axios.get(`https://api.consumet.org/manga/mangareader/read?chapterId=${chapterId}`)
           .then(res => {
             setPages(res.data);
             setLoading(false);
             window.scrollTo(0, 0); // เลื่อนขึ้นบนสุดเมื่อเปลี่ยนตอน
           });
    }
  }, [manga, currentCh]);

  if(!manga) return <div className="min-h-screen bg-black text-white flex items-center justify-center">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header สั่งการ */}
      <div className="bg-[#1f1f1f] p-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/"><FaHome className="text-xl"/></Link>
        <div className="text-center">
          <h1 className="text-sm font-bold truncate max-w-[200px]">{manga.title}</h1>
          <p className="text-[#FB7299] text-xs">ตอนที่ {manga.episodes[currentCh].number}</p>
        </div>
        <div className="flex gap-4">
          <button disabled={currentCh === 0} onClick={() => setCurrentCh(currentCh - 1)}><FaArrowLeft/></button>
          <button disabled={currentCh === manga.episodes.length - 1} onClick={() => setCurrentCh(currentCh + 1)}><FaArrowRight/></button>
        </div>
      </div>

      {/* หน้าอ่านมังงะ */}
      <div className="max-w-3xl mx-auto py-4">
        {loading ? (
          <div className="flex justify-center p-20 text-[#FB7299] animate-bounce">กำลังโหลดหน้ากระดาษ...</div>
        ) : (
          <div className="flex flex-col gap-0">
            {pages.map((page, index) => (
              <img 
                key={index} 
                src={page.img} 
                alt={`Page ${index + 1}`} 
                className="w-full h-auto"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>

      {/* ปุ่มเปลี่ยนตอนด้านล่าง */}
      <div className="p-10 flex justify-center gap-10 bg-[#1f1f1f]">
          {currentCh > 0 && <button onClick={() => setCurrentCh(currentCh - 1)} className="bg-[#FB7299] px-6 py-2 rounded-full">ตอนก่อนหน้า</button>}
          {currentCh < manga.episodes.length - 1 && <button onClick={() => setCurrentCh(currentCh + 1)} className="bg-[#FB7299] px-6 py-2 rounded-full">ตอนถัดไป</button>}
      </div>
    </div>
  );
}