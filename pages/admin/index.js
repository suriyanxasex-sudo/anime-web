import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaTerminal, FaRobot, FaDatabase, FaSkull, FaServer, FaUsers, FaMicrochip, FaBroom, FaPowerOff } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const terminalEndRef = useRef(null);
  
  // State
  const [target, setTarget] = useState('https://www.nekopost.net/manga/...');
  const [isWorking, setIsWorking] = useState(false);
  const [logs, setLogs] = useState([
    '>> SYSTEM_BOOT_SEQUENCE_COMPLETE', 
    '>> CONNECTED_TO_MAINFRAME',
    '>> WAITING_FOR_COMMAND...'
  ]);
  const [stats, setStats] = useState({ users: 0, mangas: 0, server: 'ONLINE' });

  // 1. [SECURITY_CHECK] - เช็คว่าเป็น Admin ตัวจริงหรือไม่ (ใช้ isAdmin จาก DB)
  useEffect(() => {
    if (!loading) {
      if (!user || !user.isAdmin) {
        // ดีดคนที่ไม่ใช่ Admin ออกไปหน้าแรก
        router.push('/');
      } else {
        fetchStats();
      }
    }
  }, [user, loading, router]);

  // Scroll Terminal ลงล่างสุดเสมอ
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // ดึงสถิติระบบ (Mockup - เดี๋ยวลูกพี่ไปทำ API มาใส่จริง)
  const fetchStats = async () => {
    // const res = await axios.get('/api/admin/stats'); 
    // setStats(res.data);
    // (จำลองข้อมูลไปก่อน)
    setStats({ users: 12, mangas: 5, server: 'STABLE' });
  };

  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // 2. [HUNTER_PROTOCOL] - สั่งบอททำงาน
  const runDeepScraper = async () => {
    if(!target) return addLog("ERROR: TARGET_URL_MISSING");
    
    setIsWorking(true);
    addLog(`>> INITIATING HUNTER BOT ON: ${target}`);
    
    try {
      const res = await axios.post('/api/admin/scrape', { 
        url: target, // ส่ง URL แทนชื่อเรื่อง (แม่นกว่า)
        key: 'joshua7465' // (ยังต้องใช้อยู่ แต่เดี๋ยวเราไปซ่อนใน Header วันหลัง)
      });
      addLog(`>> SUCCESS: ${res.data.message}`);
      fetchStats(); // อัปเดตตัวเลข
    } catch (err) {
      addLog(`>> FATAL_ERROR: ${err.response?.data?.message || err.message}`);
    }
    setIsWorking(false);
  };

  // 3. [NUKE_PROTOCOL] - สั่งล้างบาง
  const runSystemPurge = async () => {
    if(!confirm("⚠️ WARNING: คุณกำลังจะล้างข้อมูลทั้งหมด? (Manga ทั้งหมดจะหายไป)")) return;
    
    setIsWorking(true);
    addLog(">> INITIALIZING SYSTEM PURGE...");
    try {
      await axios.post('/api/admin/nuke', { key: 'joshua7465' });
      addLog(">> DATABASE_CLEANSED: All data has been wiped.");
      fetchStats();
    } catch (err) {
      addLog(">> PURGE_FAILED: Access Denied.");
    }
    setIsWorking(false);
  };

  if (loading || !user || !user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ff41] font-mono selection:bg-[#00ff41] selection:text-black p-4 md:p-8">
      <Head><title>JPLUS OVERLORD | Command Center</title></Head>

      <div className="max-w-7xl mx-auto border border-[#00ff41]/30 rounded-[2rem] bg-black/90 p-6 md:p-10 shadow-[0_0_50px_rgba(0,255,65,0.1)] relative overflow-hidden">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-[#00ff41]/20 pb-6 gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-[#00ff41]/10 p-3 rounded-full border border-[#00ff41]/30 animate-pulse">
                <FaSkull className="text-3xl" />
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase">
                    JPLUS_OVERLORD <sup className="text-xs text-[#00ff41]">v3.0</sup>
                </h1>
                <p className="text-[10px] text-[#00ff41] tracking-[0.3em]">ADMINISTRATOR_LEVEL_ACCESS</p>
            </div>
          </div>
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-red-500 font-bold border border-red-500/30 px-6 py-2 rounded-full hover:bg-red-500 hover:text-white transition uppercase text-[10px] tracking-widest">
            <FaPowerOff /> Terminate_Session
          </button>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
            <div className="bg-[#111] p-6 rounded-2xl border border-[#00ff41]/20 hover:border-[#00ff41] transition-colors group">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Users</p>
                        <h3 className="text-3xl font-black text-white group-hover:text-[#00ff41] transition-colors">{stats.users}</h3>
                    </div>
                    <FaUsers className="text-2xl text-[#00ff41]/50" />
                </div>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-[#00ff41]/20 hover:border-[#00ff41] transition-colors group">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Manga Database</p>
                        <h3 className="text-3xl font-black text-white group-hover:text-[#00ff41] transition-colors">{stats.mangas}</h3>
                    </div>
                    <FaDatabase className="text-2xl text-[#00ff41]/50" />
                </div>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-[#00ff41]/20 hover:border-[#00ff41] transition-colors group">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Server Status</p>
                        <h3 className="text-3xl font-black text-white group-hover:text-[#00ff41] transition-colors">{stats.server}</h3>
                    </div>
                    <FaServer className="text-2xl text-[#00ff41]/50 animate-pulse" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* --- CONTROL PANEL --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Scraper Tool */}
            <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
              <h2 className="text-lg font-black mb-6 flex items-center gap-3 text-white uppercase border-b border-white/5 pb-4">
                <FaRobot className="text-[#00ff41]"/> Hunter Bot Protocol
              </h2>
              <div className="space-y-4">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-2">Target URL (Nekopost/Mangadex)</label>
                <div className="flex gap-2">
                    <input 
                        value={target} 
                        onChange={e => setTarget(e.target.value)} 
                        className="flex-1 bg-black border border-[#00ff41]/20 p-4 rounded-xl text-white outline-none focus:border-[#00ff41] transition-all font-bold text-sm" 
                        placeholder="https://..."
                    />
                    <button 
                        onClick={runDeepScraper} 
                        disabled={isWorking} 
                        className="bg-[#00ff41] text-black px-8 rounded-xl font-black hover:bg-white transition-colors uppercase tracking-widest flex items-center gap-2"
                    >
                        {isWorking ? <FaMicrochip className="animate-spin"/> : <FaRobot />} RUN
                    </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/10 p-8 rounded-[2rem] border border-red-500/20">
                <h2 className="text-lg font-black mb-4 flex items-center gap-3 text-red-500 uppercase">
                    <FaBroom/> Danger Zone
                </h2>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-red-400/70">Actions here cannot be undone.</p>
                    <button onClick={runSystemPurge} className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                        NUKE DATABASE
                    </button>
                </div>
            </div>

          </div>

          {/* --- TERMINAL OUTPUT --- */}
          <div className="bg-black p-6 rounded-[2rem] border border-[#00ff41]/20 h-[500px] flex flex-col relative shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
             <div className="flex justify-between items-center mb-4 border-b border-[#00ff41]/10 pb-2">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <FaTerminal /> System_Logs
                </p>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 pr-2 scrollbar-thin scrollbar-thumb-[#00ff41]/20 scrollbar-track-transparent">
               {logs.map((msg, i) => (
                   <p key={i} className={`${i === logs.length - 1 ? 'text-[#00ff41] animate-pulse' : 'text-[#00ff41]/60'}`}>
                       <span className="opacity-50 mr-2">$</span>{msg}
                   </p>
               ))}
               <div ref={terminalEndRef} />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}