import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function MangaList() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลมังงะทั้งหมดจาก API ที่บอทไปดึงมา
    axios.get('/api/manga/all')
      .then(res => {
        setManga(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-[#FB7299] animate-pulse">LOADING_MANGA_DATA...</div>;

  if (manga.length === 0) return (
    <div className="text-center py-20 border-2 border-dashed border-gray-900 rounded-3xl text-gray-600">
      [ NO_MANGA_FOUND_IN_DATABASE ]
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {manga.map((item) => (
        <Link key={item._id} href={`/watch/${item._id}`}>
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 group-hover:border-[#FB7299] transition duration-300 shadow-2xl">
              <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={item.title} />
            </div>
            <h3 className="mt-3 text-sm font-bold line-clamp-1 group-hover:text-[#FB7299] transition">{item.title}</h3>
            <p className="text-[10px] text-gray-500 uppercase mt-1">{item.category || 'Manga'}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}