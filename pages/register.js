import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const [form, setForm] = useState({username:'', password:''});
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 backdrop-blur-md">
         {/* ✨ หัวข้อ Jplus ✨ */}
         <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-md">
            สมัครสมาชิก <span className="text-[#FB7299]">Jplus</span>
         </h1>
         
         {error && <div className="bg-red-500/80 text-white p-2 rounded mb-4 text-center text-sm">{error}</div>}
         
         <form onSubmit={handleSubmit} className="space-y-4">
           <input className="w-full bg-black/50 border border-gray-500 text-white p-3 rounded-lg focus:outline-none focus:border-[#00A1D6] placeholder-gray-400" 
             placeholder="ตั้งชื่อผู้ใช้" onChange={e=>setForm({...form, username:e.target.value})} required />
           
           <div className="relative">
             <input className="w-full bg-black/50 border border-gray-500 text-white p-3 rounded-lg focus:outline-none focus:border-[#00A1D6] placeholder-gray-400" 
               type={showPassword ? "text" : "password"} 
               placeholder="ตั้งรหัสผ่าน" 
               onChange={e=>setForm({...form, password:e.target.value})} required 
             />
             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-white">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
             </button>
           </div>
           
           <button className="w-full bg-gradient-to-r from-[#00A1D6] to-[#0076a1] text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-[#00A1D6]/50 hover:scale-105 transition">
             เริ่มต้นใช้งาน
           </button>
         </form>
         
         <div className="mt-4 text-center text-sm">
           <Link href="/login" className="text-gray-300 hover:text-white transition">← กลับหน้าเข้าสู่ระบบ</Link>
         </div>
      </div>
    </div>
  );
}