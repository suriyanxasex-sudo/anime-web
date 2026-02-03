import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

export default function Login() {
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
      /** * ✨ จุดสำคัญที่ต้องแก้ไข (The Fix): 
       * ต้องเรียกไปที่ '/api/user/login' (ต้องมี /api นำหน้า) 
       * เพื่อให้วิ่งไปหาไฟล์ในโฟลเดอร์ pages/api/ ไม่ใช่หน้า Page ปกติ
       */
      const res = await axios.post('/api/user/login', form);

      if(res.data.success) {
        if (res.data.user.username === 'joshua') {
            alert('ยินดีต้อนรับท่าน Admin Joshua! 👑 (AUTO_ADMIN_ACTIVATED)');
        }
        login(res.data.user);
        router.push('/'); 
      } else {
        setError(res.data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) { 
      // ดึงข้อความ Error จริงจาก Server มาแสดงเพื่อให้ Debug ง่ายขึ้น
      const errMsg = err.response?.data?.message || 'เชื่อมต่อ Server ไม่ได้ (เช็ค MongoDB URI/Network Access)';
      setError(errMsg);
      console.error("Login Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#FB7299]/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#00A1D6]/10 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10 bg-[#18191C]/80 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/5 backdrop-blur-xl">
         <div className="text-center mb-8">
            <h1 className="text-6xl font-black tracking-tighter drop-shadow-2xl mb-3 flex justify-center items-end">
                <span className="text-white">J</span>
                <span className="text-[#FB7299]">plus</span>
                <sup className="text-sm text-[#00A1D6] ml-1 mb-6 font-bold tracking-widest">MANGA+</sup>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-bold">The Next Era of Reading</p>
         </div>
         
         {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-center text-xs font-bold">
                {error}
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-gray-500 ml-1 mb-1 block uppercase">Username</label>
              <input 
                className="w-full bg-black/40 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FB7299]/50 placeholder-gray-600 transition" 
                placeholder="ชื่อผู้ใช้" 
                value={form.username}
                onChange={e=>setForm({...form, username:e.target.value})} 
                required
              />
            </div>
            
            <div className="relative">
              <label className="text-[10px] font-bold text-gray-500 ml-1 mb-1 block uppercase">Password</label>
              <input 
                className="w-full bg-black/40 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FB7299]/50 placeholder-gray-600 transition" 
                type={showPassword ? "text" : "password"} 
                placeholder="รหัสผ่าน" 
                value={form.password}
                onChange={e=>setForm({...form, password:e.target.value})} 
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-gray-600 hover:text-[#FB7299] transition">
                 {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            
            <button 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#FB7299]/20 hover:shadow-[#FB7299]/40 hover:scale-[1.02] active:scale-95 transition duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>SIGN_IN <FaLock className="text-xs" /></>
              )}
            </button>
         </form>

         <div className="mt-8 text-center text-[11px] font-bold text-gray-600 uppercase tracking-widest">
            Don't have an account? <Link href="/register" className="text-[#00A1D6] hover:text-white transition decoration-dotted underline-offset-4 underline">JOIN JPLUS NOW</Link>
         </div>
      </div>
    </div>
  );
}