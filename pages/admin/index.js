import { useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const runBot = async () => {
    setLoading(true);
    try { 
        const res = await axios.get('/api/cron/auto?key=joshua7465'); 
        alert(res.data.message); 
    } 
    catch(e) { 
        const reason = e.response?.data?.error || e.message;
        alert(`เกิดข้อผิดพลาด: ${reason}`); 
    }
    setLoading(false);
  };

  if(user?.username !== 'joshua') return <div className="p-10 text-center text-red-500">Admin Only</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-10 text-center mt-10">
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-[#FB7299]">Admin Dashboard</h1>
            <button onClick={runBot} disabled={loading} 
                className={`text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg 
                ${loading ? 'bg-gray-400' : 'bg-[#00A1D6] hover:bg-blue-600'}`}>
                {loading ? '⏳ กำลังทำงาน...' : '🚀 สั่งบอททำงาน (Start Bot)'}
            </button>
        </div>
      </div>
    </div>
  );
}