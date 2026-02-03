import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaFire, FaPlayCircle, FaCrown } from 'react-icons/fa';

export default function MangaList() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { search } = router.query;

  useEffect(() => {
    setLoading(true);
    const endpoint = search ? `/api/manga/all?search=${search}` : '/api/manga/all';
    axios.get(endpoint)
      .then(res => { setManga(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search]);

  if (loading) return <div className="text-center py-40 text-[#FB7299] font-black uppercase italic animate-pulse">Syncing_Premium_Archives...</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
      {manga.map((item) => (
        <Link key={item._id} href={`/watch/${item._id}`}>
          <div className="group relative cursor-pointer">
            <div className={`relative aspect-[3/4.2] rounded-[2rem] overflow-hidden border transition-all duration-500 shadow-2xl ${item.isPremium ? 'border-yellow-500/50 shadow-yellow-500/10' : 'border-white/5 shadow-black'}`}>
              <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {item.isPremium && (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                    <FaCrown className="text-[10px]" />
                    <span className="text-[9px] font-black uppercase">PREMIUM</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaPlayCircle className={`text-5xl ${item.isPremium ? 'text-yellow-400' : 'text-white/80'}`} />
              </div>
            </div>
            <div className="mt-4 px-2">
              <h3 className={`text-xs font-black uppercase tracking-tight line-clamp-1 ${item.isPremium ? 'group-hover:text-yellow-400' : 'group-hover:text-[#FB7299]'}`}>
                {item.title}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}