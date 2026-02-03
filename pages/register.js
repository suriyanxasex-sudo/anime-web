import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaUserPlus, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

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
      // INITIATING_SECURE_REGISTRATION_PROTOCOL
      const res = await axios.post('/api/user/register', form);
      if(res.data.success) {
        alert('SUCCESS: ยินดีต้อนรับสู่ Jplus MANGA+! 🚀');
        login(res.data.user);
        router.push('/');
      }
    } catch (err) { 
      setError(err.response?.data?.message || 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว หรือระบบขัดข้อง'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Jplus Cinematic Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00A1D6]/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FB7299]/10 rounded-full blur-[150px]"></div>
      
      <div className="relative z-10 bg-[#121212]/90 backdrop-blur-3xl p-12 rounded-[3.5rem] shadow-2xl w-full max-w-lg border border-white/5">
         
         <div className="text-center mb-12">
            <h1 className="text-6xl font-black italic tracking-tighter mb-4">
                <span className="text-white">J</span>
                <span className="text-[#FB7299]">plus</span>
                <sup className="text-sm text-[#00A1D6] ml-1 font-black">+</sup>
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 text-[9px] font-black uppercase tracking-[0.4em]">
               <FaShieldAlt className="text-[#00A1D6]" /> Secure_Identity_Registration
            </div>
         </div>
         
         {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-8 text-center text-[10px] font-black uppercase tracking-widest animate-shake">
                {error}
            </div>
         )}
         
         <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 ml-4 uppercase tracking-[0.2em]">Identifier_Name</label>
              <input className="w-full bg-black/60 border border-white/5 text-white p-5 rounded-3xl focus:ring-2 focus:ring-[#00A1D6] outline-none transition-all font-bold placeholder:text-gray-800" 
                placeholder="USER_NAME_REQ" 
                onChange={e=>setForm({...form, username:e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-gray-500 ml-4 uppercase tracking-[0.2em]">Access_Key_Code</label>
              <input className="w-full bg-black/60 border border-white/5 text-white p-5 rounded-3xl focus:ring-2 focus:ring-[#00A1D6] outline-none transition-all font-bold placeholder:text-gray-800" 
                type={showPassword ? "text" : "password"} 
                placeholder="PASSWORD_REQ" 
                onChange={e=>setForm({...form, password:e.target.value})} 
                required 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-[52px] text-gray-700 hover:text-white transition">
                 {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <button 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#00A1D6] to-[#0076a1] text-white py-6 rounded-3xl font-black shadow-2xl shadow-[#00A1D6]/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase text-xs tracking-[0.3em]"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : (
                <span className="flex items-center justify-center gap-3">Initialize_Profile <FaUserPlus /></span>
              )}
            </button>
         </form>
         
         <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <Link href="/login" className="text-gray-600 hover:text-[#00A1D6] transition text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 italic">
              <FaArrowLeft /> [ ALREADY_REGISTERED?_RETURN_TO_LOGIN ]
            </Link>
         </div>
      </div>
    </div>
  );
}