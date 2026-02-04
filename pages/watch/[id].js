import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaHome, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Watch() {
  const router = useRouter();
  const { id, ch = 1 } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadChapter = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/manga/read?id=${id}&chapter=${ch}`);
        setData(res.data);
      } catch (err) {
        console.error("Reader_Error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    loadChapter();
  }, [id, ch]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FB7299] font-black italic animate-bounce">SYNCING_JPLUS_PAGES...</div>;

  if (!data || !data.pages || data.pages.length === 0) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-10">
      <h2 className="text-2xl font-black mb-4 uppercase">Chapter_Not_Found</h2>
      <button onClick={() => router.push('/')} className="px-8 py-3 bg-[#FB7299] rounded-full font-bold">BACK TO HOME</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="sticky top-0 z-50 bg-black/90 p-4 border-b border-white/5 flex justify-between items-center">
        <button onClick={() => router.push('/')} className="text-xl"><FaHome /></button>
        <span className="font-black italic text-[#FB7299] uppercase">{data.title}</span>
        <div className="flex gap-4">
          <button disabled={parseInt(ch) <= 1} onClick={() => router.push(`/watch/${id}?ch=${parseInt(ch)-1}`)}><FaChevronLeft /></button>
          <button onClick={() => router.push(`/watch/${id}?ch=${parseInt(ch)+1}`)}><FaChevronRight /></button>
        </div>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col">
        {data.pages.map((url, i) => (
          <img key={i} src={url} alt={`Page ${i+1}`} className="w-full h-auto" loading="lazy" />
        ))}
      </div>
    </div>
  );
}