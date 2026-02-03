import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaTerminal, FaRobot, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function Admin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const runBot = async () => {
    if(!confirm('ยืนยันการรันบอทเพื่อดึงมังงะชุดใหม่?')) return;
    
    setLoading(true);
    try { 
        // เรียกใช้ API Cron ที่เราแก้ให้ดึงมังงะ/มังฮวา
        const res = await axios.get('/api/cron/auto?key=joshua7465'); 
        alert(`สำเร็จ: ${res.data.message}`); 
    } 
    catch(e) { 
        const reason = e.response?.data?.error || e.message;
        alert(`เกิดข้อผิดพลาด: ${reason}`); 
    }
    setLoading(false);
  };

  // ตรวจสอบสิทธิ์ Admin (ชื่อ Joshua เท่านั้น)
  if(user?.username !== 'joshua') return (
    <div className="min-h-screen bg-[#18191C] flex flex-col items-center justify-center p-10 text-center">
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
        <h1 className="text-white font-bold text-2xl">Access Denied</h1>
        <p className="text-gray-500 mt-2">เฉพาะ Joshua เท่านั้นที่มีสิทธิ์เข้าถึงหน้านี้</p>
        <Link href="/"><button className="mt-6 text-[#FB7299] flex items-center gap-2"><FaArrowLeft /> กลับหน้าหลัก</button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#18191C] text-white font-sans">
      <div className="max-w-4xl mx-auto p-6 md:p-20">
        
        <div className="flex items-center gap-4 mb-10">
            <div className="bg-[#FB7299] p-3 rounded-xl shadow-lg shadow-[#FB7299]/20">
                <FaTerminal className="text-2xl text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-extrabold tracking-tighter">Jplus <span className="text-[#FB7299]">Console</span></h1>
                <p className="text-gray-500 text-sm">ระบบจัดการหลังบ้านสำหรับ Admin Joshua</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* กล่องควบคุมบอท */}
            <div className="bg-[#2A2B2F] p-8 rounded-2xl border border-gray-800 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <FaRobot className="text-[#00A1D6] text-2xl" />
                    <h2 className="text-xl font-bold">Manga Scraper Bot</h2>
                </div>
                
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    สั่งให้บอทวิ่งไปขูดข้อมูลมังงะ มังฮวา และมังงะเกาหลีจาก MangaReader 
                    เพื่อนำมาอัปเดตลงในคลังข้อมูล Jplus ของเรา
                </p>

                <button 
                    onClick={runBot} 
                    disabled={loading} 
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg
                    ${loading 
                        ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-[#00A1D6] to-[#FB7299] hover:shadow-[#FB7299]/20 hover:brightness-110'}`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            กำลังประมวลผล...
                        </span>
                    ) : '🚀 START MANGA BOT'}
                </button>
            </div>

            {/* ส่วนข้อมูลระบบ (Stat) */}
            <div className="bg-[#2A2B2F] p-8 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-center">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">System Status</h3>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-[#FB7299]">ONLINE</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full mb-2 animate-pulse"></div>
                </div>
                <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Database</span>
                        <span className="text-green-400">Connected</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Manga API</span>
                        <span className="text-green-400">Ready</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-10 text-center">
            <Link href="/">
                <button className="text-gray-600 hover:text-white transition text-sm">
                    ← Back to Jplus Manga Home
                </button>
            </Link>
        </div>

      </div>
    </div>
  );
}