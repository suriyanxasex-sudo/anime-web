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
        console.log("Jplus_Reader_Data:", res.data); // เช็คลิ้งก์รูปใน Console ได้เลยลูกพี่
        setData(res.data);
      } catch (err) {
        console.error("Reader_Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadChapter();
  }, [id, ch]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[#FB7299] font-black italic animate-pulse">AUTHORIZING_JOSHUA_ACCESS...</div>
    </div>
  );

  if (!data || !data.pages || data.pages.length === 0) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <h2 className="text-xl font-black mb-4 uppercase">No_Pages_To_Load</h2>
      <button onClick={() => router.push('/')} className="px-10 py-3 bg-[#FB7299] rounded-2xl font-black italic">BACK_TO_HOME</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="sticky top-0 z-50 bg-black/95 p-4 border-b border-white/5 flex justify-between items-center">
        <button onClick={() => router.push('/')} className="hover:text-[#FB7299] transition-all"><FaHome /></button>
        <span className="font-black italic text-[#FB7299] uppercase tracking-tighter">{data.title}</span>
        <div className="flex gap-4">
          <button disabled={parseInt(ch) <= 1} onClick={() => router.push(`/watch/${id}?ch=${parseInt(ch)-1}`)} className="disabled:opacity-20"><FaChevronLeft /></button>
          <button onClick={() => router.push(`/watch/${id}?ch=${parseInt(ch)+1}`)}><FaChevronRight /></button>
        </div>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col gap-0.5">
        {data.pages.map((url, i) => (
          <img key={i} src={url} alt={`Joshua_Page_${i+1}`} className="w-full h-auto shadow-2xl" loading="lazy" />
        ))}
      </div>
    </div>
  );
}