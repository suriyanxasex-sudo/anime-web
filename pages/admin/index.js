import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaTerminal, FaRobot, FaHome, FaDatabase } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState('SYSTEM_READY');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.username !== 'joshua')) {
      router.push('/');
    }
  }, [user, loading, router]);

  const runBot = async () => {
    setIsProcessing(true);
    setStatus('RUNNING_SCRAPER_BOT...');
    try {
      const res = await axios.get('/api/cron/auto?key=joshua7465');
      setStatus(`SUCCESS: ${res.data.message}`);
    } catch (err) {
      setStatus('ERROR: ' + (err.response?.data?.error || err.message));
    }
    setIsProcessing(false);
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-green-500 p-10 font-mono">
       <div className="max-w-5xl mx-auto border-2 border-green-900 rounded-lg p-6 shadow-[0_0_20px_rgba(0,50,0,0.5)]">
          <div className="flex justify-between items-center mb-8 border-b border-green-900 pb-4">
             <h1 className="text-2xl font-bold text-white uppercase tracking-widest">JPLUS_ADMIN_CONTROL</h1>
             <Link href="/"><button className="text-green-700 hover:text-green-400">[EXIT_TO_SITE]</button></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-[#050505] p-6 rounded-lg border border-green-900">
                <h2 className="text-xl font-bold mb-4 text-white uppercase">Manga Bot</h2>
                <div className="bg-black p-4 rounded border border-green-900 mb-6 h-24 text-xs">
                   <p className="text-blue-400">$ LOG_STATUS: <span className="text-white">{status}</span></p>
                </div>
                <button onClick={runBot} disabled={isProcessing} className="w-full py-3 rounded font-bold border-2 border-blue-900 text-blue-500 hover:bg-blue-900 hover:text-white transition">
                   {isProcessing ? 'WORKING...' : '>> EXECUTE_BOT <<'}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}