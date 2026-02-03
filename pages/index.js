import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FaFire, FaBookOpen, FaUserCircle, FaTerminal } from 'react-icons/fa';

export default function Home() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // ดึงข้อมูลมังงะจาก API หลังบ้านเราเอง
    axios.get('/api/manga/list')
      .then(res => { setMangas(res.data); setLoading(false); })
      .catch(err => console.error("HOME_ERROR:", err));
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-[#FB7299] selection:text-white">
      {/* 🚀 NAVIGATION_BAR */}
      <nav className="p-5 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-8">
          <h1 className="text-4xl font-black italic tracking-tighter hover:scale-105 transition cursor-pointer">
            J<span className="text-[#FB7299]">plus</span>
          </h1>
          <div className="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            <span className="hover:text-[#FB7299] cursor-pointer transition">Browse</span>
            <span className="hover:text-[#FB7299] cursor-pointer transition">Manhwa</span>
            <span className="hover:text-[#FB7299] cursor-pointer transition">Schedule</span>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-green-500 uppercase">{user.username}_ONLINE</span>
              {user.username === 'joshua' && (
                <Link href="/admin">
                  <button className="p-2 bg-white/5 rounded-lg text-white hover:bg-[#FB7299] transition"><FaTerminal /></button>
                </Link>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-[#FB7299] px-6 py-2 rounded-full text-xs font-black hover:shadow-[0_0_20px_rgba(251,114,153,0.4)] transition duration-300">LOG_IN</button>
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* 🏆 TRENDING_SECTION */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
            <FaFire className="text-[#FB7299] animate-bounce" /> TRENDING_NOW
          </h2>
          <div className="h-px flex-1 bg-white/5 mx-6"></div>
          <span className="text-[10px] font-bold text-gray-500">VERSION_2.0.4</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <div className="w-12 h-12 border-4 border-[#FB7299]/20 border-t-[#FB7299] rounded-full animate-spin"></div>
             <p className="text-xs font-mono text-gray-500 animate-pulse">SYNCHRONIZING_DATABASE...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {mangas.map((m) => (
              <Link 
                href={{ pathname: `/read/${m.mangaId}`, query: { title: m.title } }} 
                key={m._id}
              >
                <div className="group cursor-pointer">
                  <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden bg-[#18191C] border border-white/5 group-hover:border-[#FB7299]/50 transition-all duration-500 group-hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                    <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-[#FB7299] border border-white/10">★ {m.rating}</div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#FB7299]/10 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                       <div className="bg-white text-black p-3 rounded-full translate-y-10 group-hover:translate-y-0 transition duration-500">
                          <FaBookOpen />
                       </div>
                    </div>
                  </div>
                  <div className="mt-4 px-1">
                    <h3 className="text-sm font-bold truncate group-hover:text-[#FB7299] transition duration-300 uppercase tracking-tight">{m.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 font-mono uppercase">Read Locally »</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}