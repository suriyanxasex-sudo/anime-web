import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaCrown, FaUserShield, FaSignOutAlt } from 'react-icons/fa';

/**
 * JPLUS_COMMAND_CENTER_NAVBAR v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ระบบนำทางหลักพร้อมการผสานอัตลักษณ์ผู้ใช้งานและระบบค้นหาอัจฉริยะ
 */

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${search.trim()}`);
    }
  };

  return (
    <nav className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[100] px-4 md:px-10 h-20 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      
      {/* 👑 [BRANDING] - อัปเกรดเป็น Jplus Manga+ */}
      <Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-105">
        <div className="bg-gradient-to-tr from-[#FB7299] to-[#FF5D87] p-2 rounded-xl shadow-lg shadow-[#FB7299]/20 group-hover:rotate-12 transition-all">
          <FaCrown className="text-white text-xl" />
        </div>
        <h1 className="text-2xl font-black italic tracking-tighter uppercase hidden sm:block">
          J<span className="text-[#FB7299]">plus</span><sup className="text-[#00A1D6] ml-1 text-xs">+</sup>
        </h1>
      </Link>

      {/* 🔍 [SEARCH_ENGINE] - ดีไซน์ดุดันขึ้น */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-10 relative group">
        <input 
          className="w-full bg-white/5 border border-white/10 text-white pl-6 pr-12 py-2.5 rounded-2xl outline-none focus:border-[#FB7299]/50 focus:bg-white/10 transition-all font-bold text-sm" 
          placeholder="SEARCH_MANGA_OR_AUTHOR..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FB7299] transition-colors">
          <FaSearch />
        </button>
      </form>

      {/* 👤 [IDENTITY_CONTROLS] - ระบบจัดการสมาชิกและแอดมิน */}
      <div className="flex gap-3 md:gap-6 items-center">
        
        {user && !user.isPremium && (
          <Link href="/premium" className="hidden lg:flex items-center gap-2 text-[10px] font-black bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1.5 rounded-full animate-pulse shadow-lg shadow-yellow-500/20 uppercase">
            Upgrade_to_VIP
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-4 bg-white/5 pl-2 pr-4 py-1.5 rounded-2xl border border-white/10">
            {/* User Avatar - ดึงจาก API หรือใช้ Seed ตามชื่อ */}
            <div className="w-9 h-9 rounded-xl border-2 border-[#FB7299] overflow-hidden">
              <img 
                src={user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                alt="Identity" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="hidden sm:flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">{user.username}</span>
              {isAdmin ? (
                <Link href="/admin" className="text-[9px] text-[#00A1D6] font-black flex items-center gap-1 uppercase group">
                  <FaUserShield className="group-hover:animate-spin" /> Admin_Panel
                </Link>
              ) : (
                <span className={`text-[9px] font-black uppercase ${user.isPremium ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {user.isPremium ? '💎 Premium_Member' : 'Standard_Reader'}
                </span>
              )}
            </div>

            <div className="h-4 w-[1px] bg-white/10 ml-2"></div>

            <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors ml-1 p-2">
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="bg-white/5 border border-white/10 text-white px-6 py-2 rounded-2xl font-black text-xs uppercase hover:bg-white/10 transition-all">
              Login
            </Link>
            <Link href="/register" className="bg-[#FB7299] text-white px-6 py-2 rounded-2xl font-black text-xs uppercase shadow-xl shadow-[#FB7299]/20 hover:scale-105 transition-all">
              Join
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}