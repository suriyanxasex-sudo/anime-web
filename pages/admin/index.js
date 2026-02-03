import { useState, useEffect } from 'react';
import axios from 'axios';
// ✅ FIX: ถอยหลัง 2 ขั้นเพื่อไปหา context
import { useAuth } from '../../context/AuthContext'; 
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState('SYSTEM_READY');

  useEffect(() => {
    if (!loading && (!user || user.username !== 'joshua')) {
      router.push('/'); 
    }
  }, [user, loading, router]);

  const wipeDatabase = async () => {
    if(!confirm('🚨 ยืนยันการล้างข้อมูลทั้งหมด?')) return;
    setStatus('WIPING...');
    try {
        const res = await axios.post('/api/admin/wipe-data', { key: 'joshua7465' });
        setStatus(`SUCCESS: ${res.data.message}`);
    } catch (err) {
        setStatus('ERROR: ' + err.message);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="bg-black text-green-500 p-10 font-mono">
      <h1>JPLUS_ADMIN_v2.0</h1>
      <p>STATUS: {status}</p>
      <button onClick={wipeDatabase} className="border-2 border-red-900 p-4">!! WIPE_DATABASE !!</button>
    </div>
  );
}