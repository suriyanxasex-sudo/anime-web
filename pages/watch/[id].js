import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaHome } from 'react-icons/fa';
import Link from 'next/link';

export default function MangaReader() {
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
      
      // ดึงรูปภาพทั้งหมดจากตอนนี้
      axios.get(`https://api.consumet.org/manga/mangareader/read?chapterId=${chapterId}`)
           .then(res => {
             setPages(res.data);
             setLoading(false);
             window.scrollTo(0, 0); 
           }).catch(() => setLoading(false));
    }
  }, [manga, currentCh]);

  if(!manga) return <div className="min-h-screen bg-black text-white flex items-center justify-center italic animate-pulse">Joshua กำลังเตรียมหน้ากระดาษ...</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <div className="bg-[#1f1f1f] p-4 flex justify-between items-center sticky top-0 z-50 border-b border-[#333]">
        <Link href="/"><FaHome className="text-xl text-gray-400 hover:text-[#FB7299]"/></Link>
        <div className="text-center">
          <h1 className="text-sm font-bold truncate max-w-[150px]">{manga.title}</h1>
          <p className="text-[#FB7299] text-[10px]">EPISODE {manga.episodes[currentCh].number}</p>
        </div>
        <div className="flex gap-4">
          <button disabled={currentCh === 0} onClick={() => setCurrentCh(currentCh - 1)} className="disabled:opacity-20"><FaArrowLeft/></button>
          <button disabled={currentCh === manga.episodes.length - 1} onClick={() => setCurrentCh(currentCh + 1)} className="disabled:opacity-20"><FaArrowRight/></button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex justify-center p-20 text-[#FB7299] animate-bounce">กำลังดึงรูปภาพ...</div>
        ) : (
          <div className="flex flex-col bg-black">
            {pages.map((page, index) => (
              <img key={index} src={page.img} alt={`Page ${index + 1}`} className="w-full h-auto" loading="lazy" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}