import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({username:'', password:''});
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);
      if(res.data.success) login(res.data.user);
    } catch { setError('ชื่อผู้ใช้หรือรหัสผ่านผิด'); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F4F5F7]">
      <Navbar />
      <div className="mt-20 w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
         <h1 className="text-2xl font-bold text-center text-[#FB7299] mb-6">Login</h1>
         {error && <div className="text-red-500 text-center mb-4 text-sm">{error}</div>}
         <form onSubmit={handleSubmit} className="space-y-4">
           <input className="w-full border p-2 rounded" placeholder="Username" onChange={e=>setForm({...form, username:e.target.value})} />
           <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={e=>setForm({...form, password:e.target.value})} />
           <button className="w-full bg-[#FB7299] text-white py-2 rounded font-bold hover:bg-pink-600">Login</button>
         </form>
         <div className="mt-4 text-center text-sm">
           ยังไม่มีบัญชี? <Link href="/register" className="text-[#00A1D6] font-bold">สมัครสมาชิก</Link>
         </div>
      </div>
    </div>
  );
}