import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState('พร้อมทำงาน');

  // ป้องกันคนนอกเข้า
  useEffect(() => {
    if (!loading) {
       if (!user || user.username !== 'joshua') { // หรือเช็ค user.role === 'admin'
          router.push('/'); 
       }
    }
  }, [user, loading]);

  const runBot = async () => {
    setStatus('กำลังรันบอท... (รอสักครู่)');
    try {
        const res = await axios.get('/api/cron/auto?key=joshua7465');
        setStatus(`สำเร็จ! ${res.data.message}`);
    } catch (err) {
        setStatus('เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#111] text-white p-8 font-mono">
       <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10">
             <h1 className="text-3xl font-bold text-red-500">ADMIN CONTROL CENTER</h1>
             <Link href="/"><button className="text-gray-400 underline">กลับหน้าเว็บ</button></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* การ์ดสั่งบอท */}
             <div className="bg-[#222] p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold mb-4">🤖 Anime Bot System</h2>
                <div className="mb-4 text-sm text-gray-400">สถานะ: <span className="text-green-400">{status}</span></div>
                <button 
                    onClick={runBot}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold transition"
                >
                    กดเพื่อสั่งบอทดึงหนังใหม่เดี๋ยวนี้
                </button>
             </div>

             {/* การ์ดสถิติ (Mockup) */}
             <div className="bg-[#222] p-6 rounded-xl border border-gray-700 opacity-50 cursor-not-allowed">
                <h2 className="text-xl font-bold mb-4">📊 User Stats (Coming Soon)</h2>
                <p>จำนวนสมาชิก: -</p>
                <p>จำนวนหนังทั้งหมด: -</p>
             </div>
          </div>
       </div>
    </div>
  );
}