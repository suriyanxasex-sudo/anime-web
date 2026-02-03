import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { FaCrown, FaSearch, FaFire, FaPlay, FaFilter } from 'react-icons/fa';

// Component กล่องโหลดเท่ๆ (Skeleton)
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
  const router = useRouter();
  const { user, login, loading: authLoading } = useAuth();

  // หมวดหมู่ที่มีให้เลือก
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
                await axios.get('/api/cron/auto?key=joshua7465');
                window.location.reload(); 
            }
        });
    }
  }, [user]);

  const handleUpgrade = async () => {
    if(confirm('ยืนยันสมัคร VIP ฟรี?')) {
      const res = await axios.post('/api/user/upgrade', { username: user.username });
      if(res.data.success) {
        alert('คุณเป็น VIP แล้ว! 💎');
        login(res.data.user);
      }
    }
  }

  // ระบบกรอง 2 ชั้น (ค้นหา + หมวดหมู่)
  const filteredAnimes = animes.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (a.category && a.category.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#18191C] text-white pb-20 font-sans">
      {/* Navbar ซ่อนไว้ หรือจะใส่กลับมาก็ได้ */}
      
      {/* Header & Search */}
      <div className="sticky top-0 z-50 bg-[#18191C]/95 backdrop-blur-sm p-4 shadow-md">
         <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                  className="w-full bg-[#2A2B2F] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FB7299] transition text-white placeholder-gray-500"
                  placeholder="ค้นหาอนิเมะ..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FB7299] to-[#00A1D6] p-[2px]">
               <div className="w-full h-full bg-[#18191C] rounded-full flex items-center justify-center font-bold">
                 {user.username[0].toUpperCase()}
               </div>
            </div>
         </div>
         
         {/* Category Chips (แถบหมวดหมู่) */}
         <div className="max-w-7xl mx-auto mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                  selectedCategory === cat 
                  ? 'bg-[#FB7299] text-white font-bold shadow-lg' 
                  : 'bg-[#2A2B2F] text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-8">
        
        {/* Banner VIP */}
        {!user.isPremium ? (
           <div className="bg-gradient-to-r from-[#F5D020] to-[#F53803] rounded-2xl p-6 relative overflow-hidden shadow-lg hover:scale-[1.01] transition cursor-pointer" onClick={handleUpgrade}>
              <div className="relative z-10 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><FaCrown /> สมัคร VIP Premium</h2>
                    <p className="text-white/90 text-xs mt-1">ปลดล็อก 4K และดูตอนพิเศษก่อนใคร</p>
                 </div>
                 <span className="bg-white text-[#F53803] px-4 py-2 rounded-full font-bold text-sm shadow">FREE</span>
              </div>
              <FaCrown className="absolute -bottom-4 -right-4 text-white/20 text-8xl rotate-12" />
           </div>
        ) : (
           <div className="bg-[#2A2B2F] border border-[#00A1D6]/30 rounded-xl p-4 flex items-center gap-3">
              <FaCrown className="text-[#00A1D6] text-xl" />
              <div><h2 className="font-bold text-sm text-[#00A1D6]">VIP Member Active</h2></div>
           </div>
        )}

        {/* Top 10 (แสดงเฉพาะตอนไม่ได้ค้นหา) */}
        {!searchTerm && selectedCategory === 'All' && !loading && (
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#FB7299]"><FaFire /> มาแรงวันนี้</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
               {topAnimes.map((a, index) => (
                 <Link key={a._id} href={`/watch/${a._id}`}>
                    <div className="min-w-[130px] relative group cursor-pointer">
                       <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                          <img src={a.imageUrl} className="w-full h-full object-cover" />
                          <div className="absolute top-0 left-0 bg-[#FB7299] text-white font-bold w-7 h-7 flex items-center justify-center rounded-br-lg shadow text-sm">
                             {index + 1}
                          </div>
                       </div>
                       <h3 className="mt-2 text-xs font-medium line-clamp-1 group-hover:text-[#FB7299]">{a.title}</h3>
                    </div>
                 </Link>
               ))}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div>
           <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#00A1D6]">
              <FaPlay /> {selectedCategory !== 'All' ? `${selectedCategory} Anime` : 'อัปเดตล่าสุด'}
           </h2>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {loading 
               ? [...Array(10)].map((_,i) => <SkeletonCard key={i} />) // แสดง Skeleton ตอนโหลด
               : filteredAnimes.map(a => (
               <Link key={a._id} href={`/watch/${a._id}`}>
                 <div className="bg-[#2A2B2F] rounded-xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer group">
                   <div className="aspect-[3/4] relative">
                      <img src={a.imageUrl} className="w-full h-full object-cover group-hover:opacity-80 transition" />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-[10px] px-1.5 py-0.5 rounded text-white">
                        {a.episodes?.length || 0} EP
                      </div>
                   </div>
                   <div className="p-3">
                      <h3 className="text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-[#FB7299] transition">
                        {a.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-1">{a.category || 'Anime'}</p>
                   </div>
                 </div>
               </Link>
             ))}
           </div>
           
           {!loading && filteredAnimes.length === 0 && (
              <div className="text-center py-20 text-gray-500 text-sm">ไม่พบอนิเมะในหมวดนี้</div>
           )}
        </div>
      </div>
    </div>
  );
}