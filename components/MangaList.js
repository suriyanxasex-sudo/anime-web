import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaCrown, FaPlayCircle } from 'react-icons/fa';

/**
 * JPLUS_MANGA_LIST_V2.6
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * ระบบดึงข้อมูลจาก Database จริง 100%
 */

export default function MangaList() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        // เพิ่ม timestamp เพื่อป้องกันการจำค่าเก่า (Cache Busting)
        const res = await axios.get(`/api/manga/all?t=${new Date().getTime()}`);
        setManga(res.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchManga();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="w-12 h-12 border-4 border-[#FB7299] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#FB7299] font-black uppercase italic tracking-widest animate-pulse">Syncing_Database...</p>
    </div>
  );

  if (manga.length === 0) return (
    <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem]">
      <p className="text-gray-600 font-black uppercase tracking-[0.5em]">No_Data_Found_In_Database</p>
      <p className="text-[10px] text-gray-700 mt-2 uppercase">Please use Admin Dashboard to add manga or wake up the bot</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
      {manga.map((item) => (
        <Link key={item._id} href={`/watch/${item._id}`}>
          <div className="group relative cursor-pointer">
            <div className={`relative aspect-[3/4.2] rounded-[2rem] overflow-hidden border transition-all duration-500 shadow-2xl ${item.isPremium ? 'border-yellow-500/50' : 'border-white/5'}`}>
              <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              
              {/* ป้าย Premium ทองคำ */}
              {item.isPremium && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <FaCrown className="text-[10px]" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">PREMIUM</span>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaPlayCircle className={`text-5xl ${item.isPremium ? 'text-yellow-400' : 'text-white/80'}`} />
              </div>
            </div>
            <div className="mt-4 px-2">
              <h3 className={`text-xs font-black uppercase tracking-tight line-clamp-1 ${item.isPremium ? 'text-yellow-500' : 'text-white'}`}>
                {item.title}
              </h3>
              <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">Status: {item.isPremium ? 'VIP_ONLY' : 'FREE'}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}