import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { useRouter } from 'next/router';
import { FaTerminal, FaRobot, FaDatabase, FaSkull, FaSatellite } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [target, setTarget] = useState('Naruto');
  const [goal, setGoal] = useState(50);
  const [isWorking, setIsWorking] = useState(false);
  const [logs, setLogs] = useState(['>> SYSTEM_BOOT_SEQUENCE_COMPLETE']);

  useEffect(() => {
    if (!loading && (!user || user.username !== 'joshua')) router.push('/');
  }, [user, loading, router]);

  const runDeepScraper = async () => {
    setIsWorking(true);
    setLogs(prev => [`>> INITIATING_DEEP_SCRAPE: ${target.toUpperCase()}`, ...prev]);
    try {
      const res = await axios.post('/api/admin/scrape', { 
        key: 'joshua7465', 
        mangaTitle: target,
        targetChapters: parseInt(goal)
      });
      setLogs(prev => [`>> SUCCESS: SYNCED ${res.data.count} CHAPTERS FROM MULTI-SOURCE`, ...prev]);
    } catch (err) {
      setLogs(prev => [`>> FATAL_ERROR: CONNECTION_REFUSED`, ...prev]);
    }
    setIsWorking(false);
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ff41] p-6 md:p-12 font-mono selection:bg-[#00ff41] selection:text-black">
      <div className="max-w-7xl mx-auto border-2 border-[#00ff41]/20 rounded-[3rem] bg-black p-10 shadow-[0_0_80px_rgba(0,255,65,0.05)]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b border-[#00ff41]/10 pb-6">
          <div className="flex items-center gap-4">
            <FaSkull className="text-4xl text-white animate-pulse" />
            <h1 className="text-3xl font-black italic tracking-tighter text-white">JPLUS_OVERLORD_v2.5</h1>
          </div>
          <button onClick={() => router.push('/')} className="text-red-500 font-bold border border-red-500/30 px-6 py-2 rounded-full hover:bg-red-500 hover:text-white transition uppercase text-xs">Terminate_Session</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-white uppercase underline decoration-[#FB7299]"><FaRobot className="text-[#FB7299]"/> Command Center</h2>
              <div className="space-y-6">
                <input value={target} onChange={e => setTarget(e.target.value)} className="w-full bg-black border border-[#00ff41]/20 p-5 rounded-2xl text-white outline-none focus:border-[#FB7299] transition-all font-bold" placeholder="Manga_Title"/>
                <input type="number" value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-black border border-[#00ff41]/20 p-5 rounded-2xl text-white outline-none focus:border-[#FB7299] transition-all font-bold" placeholder="Chapter_Goal"/>
                <button onClick={runDeepScraper} disabled={isWorking} className="w-full py-6 bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white rounded-3xl font-black text-xl shadow-2xl hover:scale-[1.01] transition-all uppercase tracking-widest italic">
                  {isWorking ? 'WORKING...' : '>> INITIALIZE_DEEP_SCRAPE <<'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-black p-8 rounded-[2.5rem] border border-[#00ff41]/10 h-[400px] overflow-y-auto shadow-inner">
               <p className="text-[10px] text-gray-700 font-bold mb-4 uppercase underline tracking-widest">Realtime_Log_Output</p>
               <div className="space-y-2 text-xs">
                 {logs.map((msg, i) => <p key={i} className={i === 0 ? 'text-[#00ff41]' : 'text-[#00ff41]/40'}>{msg}</p>)}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}