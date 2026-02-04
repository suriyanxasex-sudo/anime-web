import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function MangaList() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        // ใส่ timestamp เพื่อบังคับให้ไม่จำ Cache (จะได้เห็นข้อมูลล่าสุดเสมอ)
        const res = await axios.get(`/api/manga/all?t=${new Date().getTime()}`);
        // เช็คว่า data เป็น array จริงไหม กัน Error
        setManga(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch manga:", err);
        setManga([]);
      } finally {
        setLoading(false);
      }
    };
    fetchManga();
  }, []);

  // 1. Loading แบบ Skeleton (กรอบกระพริบ) ดูโปรขึ้น
  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4.5] bg-[#1a1a1a] rounded-3xl border border-white/5 mb-3"></div>
          <div className="h-3 bg-[#1a1a1a] rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );

  // 2. ถ้าไม่มีข้อมูล (Database ว่าง) ให้บอกตรงๆ
  if (manga.length === 0) return (
    <div className="w-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-[#333] rounded-3xl bg-[#0a0a0a]">
      <div className="text-4xl mb-4">📂</div>
      <h3 className="text-xl font-black text-gray-500 uppercase italic">No Manga Found</h3>
      <p className="text-gray-600 text-xs mt-2">Database is currently empty.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {manga.map((item) => (
        <Link key={item._id} href={`/watch/${item._id}`}>
          <div className="group cursor-pointer relative">
            {/* กรอบรูปภาพ */}
            <div className={`relative aspect-[3/4.5] rounded-3xl overflow-hidden border transition-all duration-500 ${item.isPremium ? 'border-[#FB7299] shadow-[0_0_15px_rgba(251,114,153,0.3)]' : 'border-white/10 group-hover:border-white/30'}`}>
              
              {/* 3. รูปภาพพร้อมระบบกันแตก (Fallback) */}
              <img 
                src={`/api/proxy?url=${encodeURIComponent(item.imageUrl)}`} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null; // กันลูป
                  e.target.src = "https://via.placeholder.com/300x450/111/555?text=NO+IMAGE"; // รูปสำรอง
                }}
              />

              {/* Gradient เงาพื้นหลังเพื่อให้ตัวหนังสืออ่านง่าย */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

              {/* Tag Premium */}
              {item.isPremium && (
                <div className="absolute top-3 right-3 bg-[#FB7299] text-black text-[9px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-wider transform group-hover:scale-110 transition-transform">
                  VIP
                </div>
              )}
            </div>

            {/* ชื่อเรื่องและรายละเอียด */}
            <div className="mt-3 px-1">
              <h3 className="text-[11px] md:text-xs font-bold uppercase truncate text-gray-200 group-hover:text-[#FB7299] transition-colors duration-300">
                {item.title}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <p className="text-[9px] text-gray-500 font-mono">
                  {item.chapters ? item.chapters.length : 0} CH
                </p>
                {/* สถานะอัปเดต (ถ้ามี field updatedAt) */}
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_lime]"></span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}