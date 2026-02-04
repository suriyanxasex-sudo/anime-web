import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function MangaList() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await axios.get(`/api/manga/all?t=${new Date().getTime()}`);
        setManga(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchManga();
  }, []);

  if (loading) return <div className="text-center py-20 text-[#FB7299] font-black italic uppercase">Syncing_Database...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {manga.map((item) => (
        <Link key={item._id} href={`/watch/${item._id}`}>
          <div className="group cursor-pointer">
            <div className={`relative aspect-[3/4.5] rounded-3xl overflow-hidden border ${item.isPremium ? 'border-yellow-500' : 'border-white/5'}`}>
              <img 
                src={`/api/proxy?url=${encodeURIComponent(item.imageUrl)}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80"></div>
            </div>
            <h3 className="mt-3 text-[10px] font-black uppercase truncate text-white italic">{item.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}