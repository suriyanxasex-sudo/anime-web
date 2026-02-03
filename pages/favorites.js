import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaHeart, FaArrowLeft, FaBookOpen } from 'react-icons/fa';

export default function Favorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // ป้องกันคนไม่ได้ Login เข้าหน้านี้
  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
        setLoading(true);
        // ดึงข้อมูลรายการโปรดล่าสุดจาก API ที่เราแก้ให้ดึงข้อมูลจากโมเดล Anime (Manga)
        axios.post('/api/user/favorite', { username: user.username, animeId: null })
             .then(res => {
                setFavs(res.data.favorites || []);
                setLoading(false);
             })
             .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#18191C] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <Link href="/">
          <button className="flex items-center gap-2 mb-8 text-gray-500 hover:text-[#FB7299] transition text-sm">
            <FaArrowLeft /> [BACK_TO_HOME]
          </button>
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-10 border-b border-[#2A2B2F] pb-6">
           <h1 className="text-3xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
              <FaHeart className="text-[#FB7299] animate-pulse" /> My <span className="text-[#FB7299]">Collection</span>
           </h1>
           <div className="text-[10px] bg-[#2A2B2F] px-3 py-1 rounded-full text-gray-400">
              TOTAL: {favs.length} ITEMS
           </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-20 text-[#FB7299] animate-spin text-4xl">
             <FaBookOpen />
          </div>
        ) : favs.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-[#2A2B2F] rounded-3xl">
            <FaBookOpen className="mx-auto text-5xl text-gray-800 mb-4" />
            <div className="text-gray-500 text-sm">คลังส่วนตัวยังว่างเปล่า... ไปหามังฮวาสนุกๆ มาเก็บไว้สิ!</div>
            <Link href="/">
               <button className="mt-6 bg-[#FB7299] px-6 py-2 rounded-full font-bold text-xs hover:brightness-110 transition">
                  EXPLORE NOW
               </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {favs.map(a => (
               <Link key={a._id} href={`/watch/${a._id}`}>
                  <div className="group cursor-pointer">
                     <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-transparent group-hover:border-[#FB7299] transition duration-300">
                        <img 
                          src={a.imageUrl} 
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                          alt={a.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                           <span className="text-[10px] font-bold text-white bg-[#FB7299] px-2 py-0.5 rounded shadow">READ_NOW</span>
                        </div>
                     </div>
                     <h3 className="mt-3 text-[13px] font-bold line-clamp-1 group-hover:text-[#FB7299] transition">{a.title}</h3>
                     <p className="text-[10px] text-gray-600 uppercase mt-1">{a.category || 'Manga'}</p>
                  </div>
               </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}