import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaCrown, FaUserShield, FaSignOutAlt, FaBell, FaBars, FaTimes } from 'react-icons/fa';

/**
 * JPLUS_COMMAND_CENTER_NAVBAR v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * สถานะ: UPGRADED - Dynamic Scroll & Mobile Responsive
 */

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();

  // 🖱️ Scroll Detection: เปลี่ยนสี Navbar เมื่อเลื่อนหน้าจอ
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${search.trim()}`);
      setShowMobileSearch(false); // ปิด search มือถือเมื่อค้นหาเสร็จ
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-[#050505]/90 backdrop-blur-xl border-white/10 h-16 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent border-transparent h-20'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 h-full flex justify-between items-center">
          
          {/* 👑 [BRANDING] - โลโก้พร้อม Animation */}
          <Link href="/" className="group flex items-center gap-3 select-none">
            <div className={`p-2 rounded-xl bg-gradient-to-tr from-[#FB7299] to-[#FF5D87] shadow-lg shadow-[#FB7299]/20 transition-all duration-500 ${isScrolled ? 'scale-90' : 'group-hover:rotate-12'}`}>
              <FaCrown className="text-white text-lg md:text-xl" />
            </div>
            <h1 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase flex items-center">
              <span className="text-white">J</span>
              <span className="text-[#FB7299]">PLUS</span>
              <sup className="text-[#00A1D6] ml-0.5 text-[10px] hidden sm:block">GOD_MODE</sup>
            </h1>
          </Link>

          {/* 🔍 [DESKTOP SEARCH] - ซ่อนบนมือถือ */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500 group-focus-within:text-[#FB7299] transition-colors" />
            </div>
            <input 
              className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-2 rounded-full text-sm font-bold outline-none focus:border-[#FB7299]/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(251,114,153,0.1)] transition-all placeholder:text-gray-600" 
              placeholder="SEARCH_DATABASE..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </form>

          {/* 👤 [RIGHT SECTION] - ปุ่มควบคุม */}
          <div className="flex items-center gap-3">
            
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)} 
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white bg-white/5 rounded-full"
            >
              {showMobileSearch ? <FaTimes /> : <FaSearch />}
            </button>

            {user ? (
              <>
                {/* Notification Bell */}
                <button className="hidden sm:flex relative w-10 h-10 items-center justify-center text-gray-400 hover:text-[#FB7299] bg-white/5 rounded-full transition-colors border border-white/5 hover:border-[#FB7299]/30">
                  <FaBell />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FB7299] rounded-full animate-ping"></span>
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FB7299] rounded-full"></span>
                </button>

                {/* User Profile Pill */}
                <div className="flex items-center gap-3 pl-1 pr-1 py-1 bg-white/5 border border-white/10 rounded-full transition-all hover:border-white/20">
                  <div className="w-8 h-8 rounded-full border-2 border-[#FB7299] overflow-hidden">
                    <img 
                      src={user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="hidden lg:flex flex-col pr-3">
                    <span className="text-[10px] font-black text-white leading-none uppercase">{user.username}</span>
                    <span className="text-[8px] font-bold text-[#00A1D6] leading-none mt-0.5 uppercase">
                      {isAdmin ? 'ADMIN_OVERLORD' : (user.isPremium ? 'VIP MEMBER' : 'READER')}
                    </span>
                  </div>

                  {/* Admin Link (Icon Only on small screens) */}
                  {isAdmin && (
                    <Link href="/admin" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#00A1D6]/10 text-[#00A1D6] hover:bg-[#00A1D6] hover:text-white transition-all" title="Admin Panel">
                      <FaUserShield />
                    </Link>
                  )}

                  {/* Logout */}
                  <button onClick={logout} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all" title="Logout">
                    <FaSignOutAlt />
                  </button>
                </div>
              </>
            ) : (
              // Login / Join Buttons
              <div className="flex gap-2">
                <Link href="/login" className="hidden sm:flex px-5 py-2 rounded-full border border-white/10 text-white text-xs font-black uppercase hover:bg-white/10 transition-all">
                  Login
                </Link>
                <Link href="/register" className="px-5 py-2 rounded-full bg-[#FB7299] text-white text-xs font-black uppercase shadow-lg shadow-[#FB7299]/20 hover:scale-105 hover:bg-[#ff8eb0] transition-all">
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 📱 [MOBILE SEARCH OVERLAY] */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-[#0a0a0a] border-b border-white/10 overflow-hidden transition-all duration-300 ${showMobileSearch ? 'max-h-20 py-3' : 'max-h-0 py-0'}`}>
          <form onSubmit={handleSearch} className="px-4">
            <input 
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold outline-none focus:border-[#FB7299]" 
              placeholder="Search..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              autoFocus={showMobileSearch}
            />
          </form>
        </div>
      </nav>
      
      {/* Spacer เพื่อดันเนื้อหาลงมาไม่ให้โดน Navbar บัง */}
      <div className="h-20 md:h-24"></div>
    </>
  );
}