import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function Register() {
  const [form, setForm] = useState({username:'', password:''});
  const { login } = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      if(res.data.success) {
        login(res.data.user);
        router.push('/');
      } else { setError(res.data.message); }
    } catch { setError('เกิดข้อผิดพลาด'); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F4F5F7]">
      <Navbar />
      <div className="mt-20 w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
         <h1 className="text-2xl font-bold text-center text-[#00A1D6] mb-6">Register</h1>
         {error && <div className="text-red-500 text-center mb-4 text-sm">{error}</div>}
         <form onSubmit={handleSubmit} className="space-y-4">
           <input className="w-full border p-2 rounded" placeholder="Username" onChange={e=>setForm({...form, username:e.target.value})} required />
           <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={e=>setForm({...form, password:e.target.value})} required />
           <button className="w-full bg-[#00A1D6] text-white py-2 rounded font-bold">สมัครสมาชิก</button>
         </form>
      </div>
    </div>
  );
}