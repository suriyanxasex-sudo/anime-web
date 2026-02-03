import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaLock, FaUser } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({username:'', password:''});
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // ✅ เรียกไปที่ /api/user/login ให้ถูกต้อง
      const res = await axios.post('/api/user/login', form);
      if(res.data.success) {
        login(res.data.user);
        router.push('/');
      }
    } catch (err) {
      setError('เชื่อมต่อ Server ไม่ได้ (เช็ค MongoDB/Network Access)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white font-sans">
      <div className="bg-[#18191C] p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/5">
        <h1 className="text-4xl font-black text-center mb-8">Jplus <span className="text-[#FB7299]">MANGA+</span></h1>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-xl mb-5 text-center text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#FB7299]" 
            placeholder="Username" 
            onChange={e => setForm({...form, username: e.target.value})}
          />
          <input 
            type="password"
            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#FB7299]" 
            placeholder="Password" 
            onChange={e => setForm({...form, password: e.target.value})}
          />
          <button className="w-full bg-[#FB7299] py-4 rounded-xl font-bold hover:scale-[1.02] transition">
            {loading ? 'WAIT...' : 'SIGN_IN'}
          </button>
        </form>
      </div>
    </div>
  );
}