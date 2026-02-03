import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaTerminal, FaRobot, FaTrashAlt, FaHome, FaDatabase } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState('SYSTEM_READY');
  const [isProcessing, setIsProcessing] = useState(false);

  // ป้องกันคนนอกเข้า (Joshua Only)
  useEffect(() => {
    if (!loading) {
       if (!user || user.username !== 'joshua') { 
          router.push('/'); 
       }
    }
  }, [user, loading, router]);

  // ฟังก์ชันสั่งบอทดึงมังงะ
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

  // ฟังก์ชันล้าง Collection อนิเมะเก่า (ขยะ YouTube)
  const wipeDatabase = async () => {
    if(!confirm('🚨 ยืนยันการลบข้อมูลมังงะ/อนิเมะทั้งหมดในคลัง? (ล้างเพื่อลงใหม่)')) return;
    
    setIsProcessing(true);
    setStatus('WIPING_COLLECTION...');
    try {
        // เรียก API สำหรับลบข้อมูล (ถ้าลูกพี่ยังไม่มีไฟล์นี้ แจ้งผมได้นะ)
        const res = await axios.post('/api/admin/wipe-data', { key: 'joshua7465' });
        setStatus(`SUCCESS: ${res.data.message}`);
    } catch (err) {
        setStatus('ERROR: ' + err.message);
    }
    setIsProcessing(false);
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-green-500 p-4 md:p-10 font-mono">
       <div className="max-w-5xl mx-auto border-2 border-green-900 rounded-lg p-6 shadow-[0_0_20px_rgba(0,50,0,0.5)]">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-green-900 pb-4 gap-4">
             <div className="flex items-center gap-3">
                <FaTerminal className="text-3xl animate-pulse" />
                <h1 className="text-2xl font-bold tracking-widest text-white">JPLUS_ADMIN_v2.0</h1>
             </div>
             <Link href="/">
                <button className="flex items-center gap-2 text-green-700 hover:text-green-400 transition">
                   <FaHome /> [EXIT_TO_MAIN_SITE]
                </button>
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* การ์ดสั่งบอทมังงะ */}
             <div className="bg-[#050505] p-6 rounded-lg border border-green-900 hover:border-green-500 transition duration-500 shadow-inner">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                   <FaRobot className="text-blue-500" /> MANGA_SCRAPER_SYSTEM
                </h2>
                
                <div className="bg-black p-4 rounded border border-green-900 mb-6 h-32 overflow-y-auto text-xs">
                   <p className="text-blue-400 font-bold">$ LOG_STATUS:</p>
                   <p className="mt-2 text-white">{status}</p>
                </div>

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={runBot}
                        disabled={isProcessing}
                        className={`w-full py-3 rounded font-bold border-2 transition uppercase
                        ${isProcessing ? 'border-gray-800 text-gray-800' : 'border-blue-900 text-blue-500 hover:bg-blue-900 hover:text-white'}`}
                    >
                        {isProcessing ? 'PROCESSING...' : '>> EXECUTE_BOT <<'}
                    </button>
                    
                    <button 
                        onClick={wipeDatabase}
                        disabled={isProcessing}
                        className={`w-full py-3 rounded font-bold border-2 transition uppercase
                        ${isProcessing ? 'border-gray-800 text-gray-800' : 'border-red-900 text-red-700 hover:bg-red-900 hover:text-white'}`}
                    >
                        {isProcessing ? 'PROCESSING...' : '!! WIPE_DATABASE !!'}
                    </button>
                </div>
             </div>

             {/* ข้อมูลระบบและสถิติ */}
             <div className="bg-[#050505] p-6 rounded-lg border border-green-900">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                   <FaDatabase className="text-yellow-600" /> DATABASE_REPORT
                </h2>
                <div className="space-y-4 text-sm">
                   <div className="flex justify-between border-b border-green-900/30 pb-2">
                      <span>USER_AUTHORIZED:</span>
                      <span className="text-white">JOSHUA_MAYOE</span>
                   </div>
                   <div className="flex justify-between border-b border-green-900/30 pb-2">
                      <span>CONTENT_TYPE:</span>
                      <span className="text-white">MANGA_MANHWA</span>
                   </div>
                   <div className="flex justify-between border-b border-green-900/30 pb-2">
                      <span>API_SOURCE:</span>
                      <span className="text-blue-400 underline">CONSUMET_MANGARDR</span>
                   </div>
                   <div className="flex justify-between border-b border-green-900/30 pb-2">
                      <span>DB_ENCRYPTION:</span>
                      <span className="text-green-500">BCRYPT_ENABLED</span>
                   </div>
                </div>

                <div className="mt-10 p-4 border border-dashed border-green-900 text-center text-[10px] text-green-800 italic">
                   "WITH GREAT POWER COMES GREAT RESPONSIBILITY... FUCK YOUTUBE LEGACY."
                </div>
             </div>

          </div>
       </div>
    </div>
  );
}