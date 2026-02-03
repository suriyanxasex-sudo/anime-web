import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({username:'', password:''});
  const { login } = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/user/login', form);
      if(res.data.success) {
        login(res.data.user);
        router.push('/'); 
      }
    } catch { setError('Access Denied: Connection Refused'); }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
      <div className="bg-[#121212] p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-white/5">
        <h1 className="text-6xl font-black text-white italic text-center mb-10 tracking-tighter">J<span className="text-[#FB7299]">plus</span></h1>
        {error && <p className="bg-red-500/10 text-red-500 p-3 rounded-xl mb-6 text-center text-[10px] font-bold">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input className="w-full bg-black border border-white/5 text-white p-5 rounded-2xl outline-none focus:ring-2 focus:ring-[#FB7299] transition-all font-bold placeholder:text-gray-800" placeholder="IDENTIFIER" onChange={e=>setForm({...form, username:e.target.value})} />
          <input className="w-full bg-black border border-white/5 text-white p-5 rounded-2xl outline-none focus:ring-2 focus:ring-[#FB7299] transition-all font-bold placeholder:text-gray-800" type="password" placeholder="ACCESS_KEY" onChange={e=>setForm({...form, password:e.target.value})} />
          <button className="w-full bg-[#FB7299] text-white py-5 rounded-2xl font-black shadow-xl shadow-[#FB7299]/20 transition-all hover:scale-105 uppercase tracking-widest">Establish_Connection</button>
        </form>
        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-700 text-[10px] font-bold mb-4 uppercase tracking-[0.2em]">New to Jplus Community?</p>
          <Link href="/register">
            <button className="text-xs font-black text-[#00A1D6] hover:text-white transition uppercase tracking-widest underline underline-offset-8">Create New Member ID</button>
          </Link>
        </div>
      </div>
    </div>
  );
}