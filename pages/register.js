import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaUserPlus, FaArrowLeft } from 'react-icons/fa';

export default function Register() {
  const [form, setForm] = useState({username:'', password:''});
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // เรียกใช้ API Register ที่เราอัปเกรดระบบรักษาความปลอดภัยไว้แล้ว
      const res = await axios.post('/api/user/register', form);
      if(res.data.success) {
        // เมื่อสมัครสำเร็จ ให้ล็อกอินเข้าสู่ระบบ Jplus อัตโนมัติ
        login(res.data.user);
        router.push('/');
      } else { 
        setError(res.data.message || 'ไม่สามารถสมัครสมาชิกได้'); 
      }
    } catch (err) { 
      setError('ชื่อผู้ใช้นี้อาจถูกใช้งานแล้ว หรือเซิร์ฟเวอร์ขัดข้อง'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">
      {/* Background Decor - สีฟ้าตัดชมพูสไตล์ Jplus */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#00A1D6]/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-[#FB7299]/5 rounded-full blur-[120px]"></div>
      
      <div className="relative z-10 bg-[#18191C]/80 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/5 backdrop-blur-2xl">
         
         <div className="text-center mb-10">
            {/* ✨ LOGO Jplus MANGA+ ✨ */}
            <h1 className="text-5xl font-black tracking-tighter drop-shadow-2xl mb-3 flex justify-center items-end">
                <span className="text-white">J</span>
                <span className="text-[#FB7299]">plus</span>
                <sup className="text-xs text-[#00A1D6] ml-1 mb-5 font-bold tracking-widest">+</sup>
            </h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black">Join the elite readers</p>
         </div>
         
         {error && (
            <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-4 rounded-2xl mb-6 text-center text-xs font-bold animate-pulse">
                {error}
            </div>
         )}
         
         <form onSubmit={handleSubmit} className="space-y-6">
           <div className="group">
             <label className="text-[10px] font-black text-gray-600 ml-2 mb-2 block uppercase tracking-widest group-focus-within:text-[#00A1D6] transition">Choose Username</label>
             <input className="w-full bg-black/40 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00A1D6]/50 placeholder-gray-700 transition font-bold" 
               placeholder="ตั้งชื่อผู้ใช้ของคุณ" 
               onChange={e=>setForm({...form, username:e.target.value})} 
               required 
             />
           </div>
           
           <div className="relative group">
             <label className="text-[10px] font-black text-gray-600 ml-2 mb-2 block uppercase tracking-widest group-focus-within:text-[#00A1D6] transition">Create Password</label>
             <input className="w-full bg-black/40 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00A1D6]/50 placeholder-gray-700 transition font-bold" 
               type={showPassword ? "text" : "password"} 
               placeholder="ตั้งรหัสผ่านที่ปลอดภัย" 
               onChange={e=>setForm({...form, password:e.target.value})} 
               required 
             />
             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-gray-600 hover:text-[#00A1D6] transition">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
             </button>
           </div>
           
           <button 
             disabled={isSubmitting}
             className="w-full bg-gradient-to-r from-[#00A1D6] to-[#0076a1] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#00A1D6]/20 hover:shadow-[#00A1D6]/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 uppercase text-sm tracking-widest"
           >
             {isSubmitting ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : (
               <>Start_Journey <FaUserPlus className="text-xs" /></>
             )}
           </button>
         </form>
         
         <div className="mt-10 text-center">
           <Link href="/login" className="text-gray-600 hover:text-white transition text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
             <FaArrowLeft className="text-[10px]" /> Already a member? Sign In
           </Link>
         </div>
      </div>
      
      {/* Footer Note */}
      <div className="absolute bottom-6 w-full text-center">
         <p className="text-[9px] text-gray-800 uppercase font-black tracking-[0.5em]">Secure Registration System v2.0</p>
      </div>
    </div>
  );
}