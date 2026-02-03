import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaHeart, FaArrowLeft, FaBookOpen, FaCrown, FaTrashAlt } from 'react-icons/fa';

export default function Favorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/user/favorite', { username: user.username, animeId: null });
      setFavs(res.data.favorites || []);
    } catch (err) {
      console.error("SYNC_ERROR: UNABLE_TO_FETCH_COLLECTION");
    }
    setLoading(false);
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-mono relative overflow-hidden">
      {/* Aesthetic Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#FB7299]/5 rounded-full blur-[100px]"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
           <Link href="/">
             <button className="flex items-center gap-3 text-gray-600 hover:text-[#FB7299] transition-all text-[10px] font-black uppercase tracking-[0.3em] group">
               <FaArrowLeft className="group-hover:-translate-x-2 transition" /> [ RETURN_TO_CORE_HUB ]
             </button>
           </Link>
           {user.isPremium && (
             <div className="flex items-center gap-3 bg-gradient-to-r from-[#FB7299]/20 to-transparent px-6 py-2 rounded-full border border-[#FB7299]/30">
                <FaCrown className="text-[#FB7299] animate-bounce" />
                <span className="text-[10px] font-black tracking-widest text-[#FB7299] uppercase">Premium_Vault_Active</span>
             </div>
           )}
        </div>

        {/* Header Section */}
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
           <div>
              <h2 className="text-[10px] font-black text-[#FB7299] uppercase tracking-[0.5em] mb-3">User_Archive</h2>
              <h1 className="text-5xl font-black italic tracking-tighter flex items-center gap-4">
                 MY <span className="text-[#FB7299]">COLLECTION</span>
              </h1>
           </div>
           <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Storage_Status: {favs.length}/UNLIMITED</p>
           </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
             <div className="w-16 h-16 border-4 border-[#FB7299] border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-[#FB7299] tracking-[0.3em] animate-pulse">SYNCHRONIZING_ARCHIVE...</p>
          </div>
        ) : favs.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/5 backdrop-blur-sm">
            <FaBookOpen className="mx-auto text-7xl text-gray-800 mb-8 opacity-20" />
            <h3 className="text-xl font-black text-gray-500 uppercase italic mb-8 tracking-tighter">[ Your_Library_Is_Empty ]</h3>
            <Link href="/">
               <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs hover:bg-[#FB7299] hover:text-white transition-all shadow-xl shadow-white/5 uppercase tracking-widest">
                  Explore_New_Manga
               </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {favs.map(item => (
              <div key={item._id} className="group relative">
                 <Link href={`/watch/${item._id}`}>
                    <div className="cursor-pointer">
                       <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group-hover:border-[#FB7299]/50 transition-all duration-500">
                          <img 
                            src={item.imageUrl} 
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                            alt={item.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                             <div className="bg-[#FB7299] text-white text-[9px] font-black px-3 py-1 rounded-lg shadow-lg uppercase tracking-widest">Read_Now</div>
                          </div>
                       </div>
                       <h3 className="mt-4 text-sm font-black text-white line-clamp-1 group-hover:text-[#FB7299] transition leading-tight">{item.title}</h3>
                       <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 tracking-widest">{item.status || 'Ongoing'}</p>
                    </div>
                 </Link>
                 {/* Quick Delete Option (Optional Admin Style) */}
                 <button className="absolute -top-2 -right-2 bg-black border border-white/10 p-2 rounded-xl text-gray-700 hover:text-red-500 hover:border-red-500/50 transition-all opacity-0 group-hover:opacity-100 shadow-xl">
                    <FaTrashAlt className="text-[10px]" />
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-20 py-10 text-center border-t border-white/5">
         <p className="text-[9px] text-gray-800 font-black uppercase tracking-[0.5em]">Jplus_Manga_Personal_Vault_v2.5</p>
      </div>
    </div>
  );
}