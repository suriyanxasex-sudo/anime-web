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
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    loadData();
  }, [id, ch]);

  const getProxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#FB7299] font-black italic">
      BYPASSING_PROTECTION...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-50 bg-black/95 p-4 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
        <button onClick={() => router.push('/')} className="hover:text-[#FB7299] transition-all"><FaHome /></button>
        <span className="font-black italic text-[#FB7299] uppercase tracking-tighter">{data?.title}</span>
        <div className="flex gap-4">
          <button disabled={parseInt(ch) <= 1} onClick={() => router.push(`/watch/${id}?ch=${parseInt(ch)-1}`)}><FaChevronLeft /></button>
          <button onClick={() => router.push(`/watch/${id}?ch=${parseInt(ch)+1}`)}><FaChevronRight /></button>
        </div>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col gap-0.5">
        {data?.pages?.map((url, i) => (
          <img key={i} src={getProxyUrl(url)} className="w-full h-auto" loading="lazy" alt="manga-page" />
        ))}
      </div>
    </div>
  );
}