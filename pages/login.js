import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({username:'', password:''});
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);
      if(res.data.success) {
        
        // --- ส่วนพิเศษสำหรับ Joshua ---
        // ถ้าชื่อ joshua ให้ถือว่าเป็น Admin ทันที (Logic เช็คหลังบ้านแล้ว)
        if (res.data.user.username === 'joshua') {
            alert('ยินดีต้อนรับท่าน Admin Joshua! 👑');
        }
        // -------------------------

        login(res.data.user);
        router.push('/'); 
      } else {
        setError(res.data.message || 'รหัสผ่านผิด');
      }
    } catch { setError('เชื่อมต่อ Server ไม่ได้'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 backdrop-blur-md">
         <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-[#FB7299] drop-shadow-md">AnimeJosh</h1>
            <p className="text-gray-300 text-sm mt-1">ดำดิ่งสู่โลกอนิเมะ</p>
         </div>
         
         {error && <div className="bg-red-500/80 text-white p-2 rounded mb-4 text-center text-sm">{error}</div>}

         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <input className="w-full bg-black/50 border border-gray-500 text-white p-3 rounded-lg focus:outline-none focus:border-[#FB7299] placeholder-gray-400 transition" 
               placeholder="ชื่อผู้ใช้" 
               onChange={e=>setForm({...form, username:e.target.value})} />
           </div>
           
           {/* ช่องรหัสผ่าน (แก้ลูกตาแล้ว) */}
           <div className="relative">
             <input 
               className="w-full bg-black/50 border border-gray-500 text-white p-3 rounded-lg focus:outline-none focus:border-[#FB7299] placeholder-gray-400 transition" 
               type={showPassword ? "text" : "password"} 
               placeholder="รหัสผ่าน" 
               onChange={e=>setForm({...form, password:e.target.value})} 
             />
             <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
             >
                {/* แก้ไข: showPassword=true (เห็นรหัส) -> ใช้รูปตาเปิด (FaEye) */}
                {/* showPassword=false (ปิดรหัส) -> ใช้รูปตาปิด (FaEyeSlash) */}
                {showPassword ? <FaEye /> : <FaEyeSlash />}
             </button>
           </div>
           
           <button className="w-full bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-[#FB7299]/50 hover:scale-105 transition duration-200">
             เข้าสู่ระบบ
           </button>
         </form>

         <div className="mt-6 text-center text-sm text-gray-300">
           ยังไม่มีบัญชี? <Link href="/register" className="text-[#00A1D6] font-bold hover:underline hover:text-white transition">สมัครสมาชิกที่นี่</Link>
         </div>
      </div>
    </div>
  );
}