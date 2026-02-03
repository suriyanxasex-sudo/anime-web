import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { FaCrown, FaSearch, FaFire, FaPlay, FaSignOutAlt } from 'react-icons/fa';

// Component กล่องโหลด (Skeleton)
const SkeletonCard = () => (
  <div className="bg-[#2A2B2F] rounded-xl overflow-hidden shadow animate-pulse">
    <div className="aspect-[3/4] bg-gray-700/50"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
    </div>
  </div>
);

export default function Home() {
  const [animes, setAnimes] = useState([]);
  const [topAnimes, setTopAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const router = useRouter();
  const { user, login, logout, loading: authLoading } = useAuth();

  const categories = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy'];

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
        setLoading(true);
        axios.get('/api/animes').then(async (res) => {
            setTopAnimes(res.data.slice(0, 5));
            setAnimes(res.data);
            setLoading(false);

            if (res.data.length === 0) {
                console.log("Database ว่าง! กำลังเรียกบอท...");
                setIsAutoRunning(true);
                try {
                    await axios.get('/api/cron/auto?key=joshua7465');
                    window.location.reload(); 
                } catch (err) {
                    console.error("บอททำงานพลาด:", err);
                    setIsAutoRunning(false);
                }
            }
        });
    }
  }, [user]);

  const handleUpgrade = async () => {
    if(confirm('ยืนยันสมัคร VIP ฟรี?')) {
      try {
        const res = await axios.post('/api/user/upgrade', { username: user.username });
        if(res.data.success) {
          alert('ยินดีด้วย! คุณเป็น VIP แล้ว 💎');
          login({ ...user, isPremium: true }); 
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการสมัคร');
      }
    }
  }

  const filteredAnimes = animes.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (a.category && a.category.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#18191C] text-white pb-20 font-sans">
      
      {/* --- Header --- */}
      <div className="sticky top-0 z-50 bg-[#18191C]/95 backdrop-blur-sm p-4 shadow-md">
         <div className="max-w-7xl mx-auto flex items-center gap-4">
            
            {/* ✨ LOGO ใหม่: Jplus ✨ */}
            <div className="font-extrabold text-2xl tracking-tighter cursor-pointer hidden md:block select-none" onClick={() => window.location.reload()}>
               <span className="text-white">J</span>
               <span className="text-[#FB7299]">plus</span>
               <sup className="text-[10px] text-[#00A1D6] ml-0.5">+</sup>
            </div>

            {/* ช่องค้นหา */}
            <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                  className="w-full bg-[#2A2B2F] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FB7299] transition text-white placeholder-gray-500"
                  placeholder="ค้นหาอนิเมะใน Jplus..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* ส่วนขวา: โปรไฟล์ + ปุ่ม Logout */}
            <div className="flex items-center gap-3">
                <button onClick={logout} className="bg-[#2A2B2F] text-gray-400 hover:text-red-500 p-2 rounded-full transition" title="ออกจากระบบ">
                    <FaSignOutAlt />
                </button>
                <Link href="/profile">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FB7299] to-[#00A1D6] p-[2px] cursor-pointer hover:scale-110 transition">
                       <div className="w-full h-full bg-[#18191C] rounded-full flex items-center justify-center font-bold overflow-hidden">
                         {user.profilePic ? (
                            <img src={user.profilePic} className="w-full h-full object-cover" onError={(e)=>{e.target.style.display='none'}} />
                         ) : (
                            <div className="text-white">{user.username[0].toUpperCase()}</div>
                         )}
                       </div>
                    </div>
                </Link>
            </div>
         </div>

         {/* แถบหมวดหมู่ */}
         <div className="max-w-7xl mx-auto mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat ? 'bg-[#FB7299] text-white shadow-lg' : 'bg-[#2A2B2F] text-gray-400 hover:bg-gray-700'}`}>
                {cat}
              </button>
            ))}
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {isAutoRunning && (
            <div className="bg-[#2A2B2F] border border-[#FB7299] p-6 rounded-xl text-center animate-pulse">
                <h2 className="text-xl font-bold text-[#FB7299] mb-2">🚀 Jplus กำลังจูนสัญญาณ...</h2>
                <p className="text-gray-400 text-sm">กำลังดึงอนิเมะใหม่ล่าสุดจากทั่วโลก รอสักครู่ครับ...</p>
            </div>
        )}

        {!user.isPremium ? (
           <div className="bg-gradient-to-r from-[#F5D020] to-[#F53803] rounded-2xl p-6 relative overflow-hidden shadow-lg hover:scale-[1.01] transition cursor-pointer" onClick={handleUpgrade}>
              <div className="relative z-10 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><FaCrown /> อัปเกรด Jplus VIP</h2>
                    <p className="text-white/90 text-xs mt-1">ดูชัดระดับ 4K และดูตอนพิเศษก่อนใคร</p>
                 </div>
                 <span className="bg-white text-[#F53803] px-4 py-2 rounded-full font-bold text-sm shadow">FREE</span>
              </div>
              <FaCrown className="absolute -bottom-4 -right-4 text-white/20 text-8xl rotate-12" />
           </div>
        ) : (
           <div className="bg-[#2A2B2F] border border-[#00A1D6]/30 rounded-xl p-3 flex items-center gap-3">
              <FaCrown className="text-[#00A1D6] text-xl" />
              <div><h2 className="font-bold text-sm text-[#00A1D6]">Jplus VIP Active</h2></div>
           </div>
        )}

        {!searchTerm && selectedCategory === 'All' && !loading && !isAutoRunning && (
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#FB7299]"><FaFire /> มาแรงใน Jplus</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
               {topAnimes.map((a, index) => (
                 <Link key={a._id} href={`/watch/${a._id}`}>
                    <div className="min-w-[130px] relative group cursor-pointer">
                       <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                          <img src={a.imageUrl} className="w-full h-full object-cover" />
                          <div className="absolute top-0 left-0 bg-[#FB7299] text-white font-bold w-8 h-8 flex items-center justify-center rounded-br-lg shadow text-lg">{index + 1}</div>
                       </div>
                       <h3 className="mt-2 text-xs font-medium line-clamp-1 group-hover:text-[#FB7299]">{a.title}</h3>
                    </div>
                 </Link>
               ))}
            </div>
          </div>
        )}

        <div>
           <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#00A1D6]">
              <FaPlay /> {selectedCategory !== 'All' ? `${selectedCategory} Anime` : 'อัปเดตล่าสุด'}
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {loading 
               ? [...Array(10)].map((_,i) => <SkeletonCard key={i} />) 
               : filteredAnimes.map(a => (
               <Link key={a._id} href={`/watch/${a._id}`}>
                 <div className="bg-[#2A2B2F] rounded-xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer group hover:-translate-y-1">
                   <div className="aspect-[3/4] relative">
                      <img src={a.imageUrl} className="w-full h-full object-cover group-hover:opacity-80 transition" />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-[10px] px-1.5 py-0.5 rounded text-white">{a.episodes?.length || 0} EP</div>
                   </div>
                   <div className="p-3">
                      <h3 className="text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-[#FB7299] transition">{a.title}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">{a.category || 'Anime'}</p>
                   </div>
                 </div>
               </Link>
             ))}
           </div>
           {!loading && !isAutoRunning && filteredAnimes.length === 0 && (
              <div className="text-center py-20 text-gray-500 text-sm">ไม่พบอนิเมะในหมวดนี้</div>
           )}
        </div>
      </div>
    </div>
  );
}