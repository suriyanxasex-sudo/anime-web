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
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/manga/read?id=${id}&chapter=${ch}`);
        setData(res.data);
      } catch (err) { console.error("Reader Error:", err); } 
      finally { setLoading(false); }
    };
    loadData();
  }, [id, ch]);

  const proxied = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#FB7299] font-black italic animate-pulse">
      LOADING_JPLUS_SYSTEM...
    </div>
  );

  if (!data || !data.pages || data.pages.length === 0) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-10 text-center">
      <h2 className="text-3xl font-black mb-4 text-red-500 uppercase">NO CONTENT</h2>
      <p className="text-gray-400 mb-6">Database ว่างเปล่าสำหรับตอนนี้<br/>กรุณารันบอท (Deep Scrape) ในหน้า Admin</p>
      <button onClick={() => router.push('/')} className="px-8 py-3 bg-white text-black font-black rounded-full">กลับหน้าหลัก</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-50 bg-black/90 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
        <button onClick={() => router.push('/')} className="hover:text-[#FB7299] transition-all"><FaHome /></button>
        <span className="font-black italic text-[#FB7299] uppercase truncate max-w-[200px]">{data.title}</span>
        <div className="flex gap-4">
          <button disabled={parseInt(ch) <= 1} onClick={() => router.push(`/watch/${id}?ch=${parseInt(ch)-1}`)} className="disabled:opacity-20"><FaChevronLeft /></button>
          <button onClick={() => router.push(`/watch/${id}?ch=${parseInt(ch)+1}`)}><FaChevronRight /></button>
        </div>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col gap-0.5 bg-black">
        {data.pages.map((url, i) => (
          <img key={i} src={proxied(url)} className="w-full h-auto" loading="lazy" alt={`Page ${i+1}`} onError={(e) => e.target.style.display='none'} />
        ))}
      </div>
    </div>
  );
}