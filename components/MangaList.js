import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaFire, FaPlayCircle, FaStar } from 'react-icons/fa';

/**
 * JPLUS_MANGA_GRID_SYSTEM v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: แสดงรายการมังงะจากฐานข้อมูลด้วย UI ระดับ High-End พร้อมระบบระบุสถานะ
 */

export default function MangaList() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลจาก API หลักที่บอทขุดมา (รองรับการทำ Pagination ในอนาคต)
    axios.get('/api/manga/all')
      .then(res => {
        setManga(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[GRID_ERROR] Failed to fetch archive:", err.message);
        setLoading(false);
      });
  }, []);

  // 🌀 [LOADING_STATE] - แอนิเมชันตอนกำลังโหลดข้อมูล
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <div className="w-12 h-12 border-4 border-[#FB7299] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FB7299] animate-pulse">
        Syncing_Database_Archives...
      </p>
    </div>
  );

  // ⚠️ [EMPTY_STATE] - กรณีไม่มีข้อมูลในคลัง
  if (manga.length === 0) return (
    <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/5">
      <p className="text-gray-600 font-black italic uppercase tracking-widest text-xs">
        [ NO_DATA_DETECTED_IN_CORE_SECTOR ]
      </p>
      <Link href="/admin/scraper" className="mt-4 inline-block text-[10px] text-[#00A1D6] underline uppercase font-bold">
        Wake up the scraper bot
      </Link>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
      {manga.map((item) => (
        <Link key={item._id} href={`/watch/${item._id}`}>
          <div className="group relative cursor-pointer">
            
            {/* 🖼️ [COVER_IMAGE_CONTAINER] */}
            <div className="relative aspect-[3/4.2] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl group-hover:shadow-[#FB7299]/20 transition-all duration-500">
              
              {/* Image with Zoom effect */}
              <img 
                src={item.imageUrl} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                alt={item.title} 
                loading="lazy"
              />

              {/* Overlay Gradient: ไล่เฉดดำด้านล่างให้อ่านชื่อง่ายขึ้น */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

              {/* 🏷️ [BADGES] - ป้ายบอกสถานะ */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {item.isPremium && (
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-[8px] font-black text-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <FaStar size={8} /> VIP
                  </span>
                )}
                {item.views > 1000 && (
                  <span className="bg-[#FB7299] text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <FaFire size={8} /> Hot
                  </span>
                )}
              </div>

              {/* Hover Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaPlayCircle className="text-white/80 text-5xl drop-shadow-2xl" />
              </div>
            </div>

            {/* 📝 [INFO_SECTION] */}
            <div className="mt-4 px-2">
              <h3 className="text-xs font-black uppercase tracking-tight text-white group-hover:text-[#FB7299] transition-colors line-clamp-1">
                {item.title}
              </h3>
              
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                  {item.category || 'MANGA_DB'}
                </span>
                <span className="text-[9px] text-[#00A1D6] font-bold">
                  VOL. {item.latestChapter || '01'}
                </span>
              </div>
            </div>

            {/* Bottom Glow: แสงชมพูฟุ้งด้านล่างตอนเอาเมาส์วาง */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-[#FB7299]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </Link>
      ))}
    </div>
  );
}