import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { FaCrown, FaSearch, FaFire, FaBookOpen, FaSignOutAlt, FaBook } from 'react-icons/fa';

// Component กล่องโหลด (Skeleton) - ปรับให้ดูเป็นทรงหน้าปกหนังสือ
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
  const [mangas, setMangas] = useState([]);
  const [topMangas, setTopMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const router = useRouter();
  const { user, login, logout, loading: authLoading } = useAuth();

  // หมวดหมู่สำหรับมังงะ/มังฮวา
  const categories = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Manhwa', 'Manhua'];

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
        setLoading(true);
        axios.get('/api/animes').then(async (res) => {
            // ดึงข้อมูลมาแสดงเป็นมังงะ
            setTopMangas(res.data.slice(0, 5));
            setMangas(res.data);
            setLoading(false);

            if (res.data.length === 0) {
                console.log("คลังมังงะว่าง! กำลังเรียกบอท...");
                setIsAutoRunning(true);
                try {
                    // เรียกบอทมังงะตัวใหม่ที่เราเพิ่งแก้ไป
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
    if(confirm('ยืนยันสมัคร VIP เพื่ออ่านมังงะล่วงหน้า?')) {
      try {
        const res = await axios.post('/api/user/upgrade', { username: user.username });
        if(res.data.success) {
          alert('ยินดีด้วย! คุณเป็น Jplus VIP แล้ว 💎');
          login({ ...user, isPremium: true }); 
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการสมัคร');
      }
    }
  }

  const filteredMangas = mangas.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (m.category && m.category.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#18191C] text-white pb-20 font-sans">
      
      {/* --- Header --- */}
      <div className="sticky top-0 z-50 bg-[#18191C]/95 backdrop-blur-sm p-4 shadow-md border-b border-[#2A2B2F]">
         <div className="max-w-7xl mx-auto flex items-center gap-4">
            
            <div className="font-extrabold text-2xl tracking-tighter cursor-pointer hidden md:block select-none" onClick={() => window.location.reload()}>
               <span className="text-white">J</span>
               <span className="text-[#FB7299]">plus</span>
               <sup className="text-[10px] text-[#00A1D6] ml-0.5">MANGA</sup>
            </div>

            <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                  className="w-full bg-[#2A2B2F] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FB7299] transition text-white placeholder-gray-500"
                  placeholder="ค้นหามังงะ มังฮวา ใน Jplus..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-3">
                <button onClick={logout} className="bg-[#2A2B2F] text-gray-400 hover:text-red-500 p-2 rounded-full transition" title="ออกจากระบบ">
                    <FaSignOutAlt />
                </button>
                <Link href="/profile">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FB7299] to-[#00A1D6] p-[2px] cursor-pointer hover:scale-110 transition">
                       <div className="w-full h-full bg-[#18191C] rounded-full flex items-center justify-center font-bold overflow-hidden text-xs">
                         {user.profilePic ? (
                            <img src={user.profilePic} className="w-full h-full object-cover" />
                         ) : (
                            <div className="text-white">{user.username[0].toUpperCase()}</div>
                         )}
                       </div>
                    </div>
                </Link>
            </div>
         </div>

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
                <h2 className="text-xl font-bold text-[#FB7299] mb-2">📚 Jplus กำลังเรียงหนังสือ...</h2>
                <p className="text-gray-400 text-sm">กำลังดึงมังงะและมังฮวาใหม่ล่าสุด รอสักครู่ครับ Joshua...</p>
            </div>
        )}

        {/* Banner VIP */}
        {!user.isPremium ? (
           <div className="bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] rounded-2xl p-6 relative overflow-hidden shadow-lg hover:scale-[1.01] transition cursor-pointer" onClick={handleUpgrade}>
              <div className="relative z-10 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><FaCrown /> อัปเกรด Jplus MANGA VIP</h2>
                    <p className="text-white/90 text-xs mt-1">อ่านตอนใหม่ล่าสุดก่อนใคร และไม่มีโฆษณาคั่น</p>
                 </div>
                 <span className="bg-white text-[#4A00E0] px-4 py-2 rounded-full font-bold text-sm shadow">FREE UPGRADE</span>
              </div>
              <FaCrown className="absolute -bottom-4 -right-4 text-white/20 text-8xl rotate-12" />
           </div>
        ) : (
           <div className="bg-[#2A2B2F] border border-[#FB7299]/30 rounded-xl p-3 flex items-center gap-3">
              <FaCrown className="text-[#FB7299] text-xl" />
              <div><h2 className="font-bold text-sm text-[#FB7299]">Jplus MANGA VIP Active</h2></div>
           </div>
        )}

        {/* Section: มังงะมาแรง (Popular) */}
        {!searchTerm && selectedCategory === 'All' && !loading && !isAutoRunning && (
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#FB7299]"><FaFire /> มังงะมาแรงใน Jplus</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
               {topMangas.map((m, index) => (
                 <Link key={m._id} href={`/watch/${m._id}`}>
                    <div className="min-w-[140px] relative group cursor-pointer">
                       <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md">
                          <img src={m.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                          <div className="absolute top-0 left-0 bg-[#FB7299] text-white font-bold w-7 h-7 flex items-center justify-center rounded-br-lg shadow text-sm">{index + 1}</div>
                       </div>
                       <h3 className="mt-2 text-xs font-bold line-clamp-1 group-hover:text-[#FB7299]">{m.title}</h3>
                    </div>
                 </Link>
               ))}
            </div>
          </div>
        )}

        {/* Section: รายการมังงะทั้งหมด */}
        <div>
           <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#00A1D6]">
              <FaBookOpen /> {selectedCategory !== 'All' ? `${selectedCategory} Manga` : 'อัปเดตมังงะล่าสุด'}
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
             {loading 
               ? [...Array(10)].map((_,i) => <SkeletonCard key={i} />) 
               : filteredMangas.map(m => (
               <Link key={m._id} href={`/watch/${m._id}`}>
                 <div className="bg-[#2A2B2F] rounded-xl overflow-hidden shadow hover:shadow-2xl transition cursor-pointer group hover:-translate-y-1 border border-transparent hover:border-[#FB7299]/50">
                   <div className="aspect-[3/4] relative">
                      <img src={m.imageUrl} className="w-full h-full object-cover group-hover:opacity-90 transition" />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[9px] px-2 py-0.5 rounded-full text-white flex items-center gap-1">
                        <FaBook className="text-[#FB7299]" /> {m.episodes?.length || 0} ตอน
                      </div>
                   </div>
                   <div className="p-3">
                      <h3 className="text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-[#FB7299] transition">{m.title}</h3>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{m.category || 'Manga'}</p>
                   </div>
                 </div>
               </Link>
             ))}
           </div>
           {!loading && !isAutoRunning && filteredMangas.length === 0 && (
              <div className="text-center py-20 text-gray-500 text-sm">ไม่พบมังงะที่ค้นหา...</div>
           )}
        </div>
      </div>
    </div>
  );
}