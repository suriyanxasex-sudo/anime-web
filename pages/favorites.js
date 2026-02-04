import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaHeart, FaArrowLeft, FaBookOpen, FaCrown, FaTrashAlt, FaExclamationCircle } from 'react-icons/fa';

export default function Favorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // 1. [AUTH_GUARD] - เช็คว่าล็อกอินยัง
  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  // 2. [DATA_SYNC] - ดึงข้อมูลทันทีที่ User พร้อม
  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // ใช้ API ตัวเดียวกับ toggle แต่ส่งไปแค่ username เพื่อขอ list
      const res = await axios.get(`/api/user/favorite?username=${user.username}`);
      setFavs(res.data.favorites || []);
    } catch (err) {
      console.error("SYNC_ERROR: UNABLE_TO_FETCH_COLLECTION", err);
    }
    setLoading(false);
  };

  // 3. [REMOVE_PROTOCOL] - ฟังก์ชันลบเรื่องที่เบื่อแล้ว
  const handleRemove = async (mangaId, e) => {
    e.preventDefault(); // กันไม่ให้ Link ทำงาน (เดี๋ยวเด้งไปหน้าอ่าน)
    e.stopPropagation();

    if (!confirm("CONFIRM_DELETION: ต้องการลบเรื่องนี้ออกจากคลังใช่หรือไม่?")) return;

    // ลบออกจากหน้าจอก่อนทันที (Optimistic UI)
    setFavs(prev => prev.filter(item => item._id !== mangaId));

    try {
      await axios.post('/api/user/favorite', { 
        username: user.username, 
        mangaId: mangaId,
        action: 'remove' // ส่ง Flag บอก Backend ว่าลบนะ
      });
    } catch (err) {
      alert("ERROR: ลบไม่สำเร็จ (โปรดเช็คอินเทอร์เน็ต)");
      fetchFavorites(); // โหลดใหม่ถ้าพลาด
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      
      {/* Aesthetic Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FB7299]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#00A1D6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
           <Link href="/">
             <button className="flex items-center gap-3 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] group bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-white/20">
               <FaArrowLeft className="group-hover:-translate-x-1 transition" /> Return_To_Base
             </button>
           </Link>
           {user.isPremium && (
             <div className="flex items-center gap-3 bg-[#FB7299]/10 px-6 py-2 rounded-full border border-[#FB7299]/30 shadow-[0_0_20px_rgba(251,114,153,0.2)]">
                <FaCrown className="text-[#FB7299] animate-bounce" />
                <span className="text-[10px] font-black tracking-widest text-[#FB7299] uppercase">VIP_Vault_Unlocked</span>
             </div>
           )}
        </div>

        {/* Header Section */}
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
           <div>
              <h2 className="text-[10px] font-black text-[#00A1D6] uppercase tracking-[0.5em] mb-3 flex items-center gap-2">
                <FaHeart /> User_Archive
              </h2>
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase">
                 My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FB7299] to-[#FF5D87]">Collection</span>
              </h1>
           </div>
           <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                Storage_Usage: {favs.length} Units
              </p>
           </div>
        </div>
        
        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
             <div className="w-12 h-12 border-4 border-[#FB7299] border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] animate-pulse">RETRIEVING_DATA...</p>
          </div>
        ) : favs.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem] bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <FaBookOpen className="text-4xl text-gray-700" />
            </div>
            <h3 className="text-xl font-black text-gray-400 uppercase italic mb-2 tracking-tighter">Archive Empty</h3>
            <p className="text-xs text-gray-600 font-bold mb-8 uppercase tracking-widest">No manga saved in your personal vault.</p>
            <Link href="/">
               <button className="bg-white text-black px-8 py-3 rounded-full font-black text-[10px] hover:scale-105 transition-transform shadow-xl uppercase tracking-widest">
                  Explore_Database
               </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
            {favs.map(item => (
              <div key={item._id} className="group relative">
                 <Link href={`/manga/${item._id}`}>
                    <div className="cursor-pointer">
                       {/* Image Card */}
                       <div className="relative aspect-[3/4.5] rounded-[1.5rem] overflow-hidden bg-[#111] shadow-2xl border border-white/5 group-hover:border-[#FB7299]/50 transition-all duration-500 group-hover:-translate-y-2">
                          <img 
                            src={item.imageUrl} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-700" 
                            alt={item.title}
                            loading="lazy"
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                             <div className="bg-[#FB7299] text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                               Continue_Reading
                             </div>
                          </div>
                       </div>

                       {/* Title Info */}
                       <div className="mt-4 px-1">
                          <h3 className="text-sm font-black text-white line-clamp-1 group-hover:text-[#FB7299] transition-colors leading-tight">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Completed' ? 'bg-green-500' : 'bg-[#00A1D6]'}`}></span>
                             <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                               {item.status || 'Ongoing'}
                             </p>
                          </div>
                       </div>
                    </div>
                 </Link>
                 
                 {/* Delete Button (Working!) */}
                 <button 
                    onClick={(e) => handleRemove(item._id, e)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white/50 hover:text-red-500 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-lg z-20"
                    title="Remove from collection"
                 >
                    <FaTrashAlt className="text-[10px]" />
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-24 py-8 text-center border-t border-white/5">
         <p className="text-[8px] text-gray-800 font-black uppercase tracking-[0.5em] hover:text-[#FB7299] transition-colors cursor-default">
           Jplus_Vault_System_v3.0
         </p>
      </div>
    </div>
  );
}