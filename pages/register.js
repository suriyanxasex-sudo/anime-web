import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaUserPlus, FaArrowLeft, FaShieldAlt, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

export default function Register() {
  const [form, setForm] = useState({
    username: '', 
    email: '',    // ✅ เพิ่ม Email ให้ตรงกับ Database
    password: '', 
    confirmPassword: '' // ✅ เพิ่มช่องยืนยันรหัส
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // พิมพ์ใหม่ให้หาย error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation เบื้องต้น
    if (form.password !== form.confirmPassword) {
      setError("❌ PASSWORD_MISMATCH: รหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 2. ส่งข้อมูลไปสมัคร (รวม Email ด้วย)
      const res = await axios.post('/api/user/register', {
        username: form.username,
        email: form.email,
        password: form.password
      });

      if(res.data.success) {
        // alert('SUCCESS'); // ไม่ใช้ alert แล้ว มันไม่เท่
        login(res.data.user);
        router.push('/');
      }
    } catch (err) { 
      setError(err.response?.data?.message || '❌ SYSTEM_ERROR: ไม่สามารถสร้างบัญชีได้'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#00A1D6]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#FB7299]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-lg border border-white/10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-2 select-none">
                <span className="text-white">J</span>
                <span className="text-[#FB7299]">plus</span>
                <sup className="text-sm text-[#00A1D6] ml-1 font-black">+</sup>
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] border-b border-white/5 pb-6">
               <FaShieldAlt className="text-[#00A1D6]" /> Secure_Registration_Unit
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-center text-xs font-black uppercase tracking-widest animate-shake">
                {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username */}
            <div className="space-y-1 group">
              <label className="text-[9px] font-black text-gray-500 ml-4 uppercase tracking-[0.2em] group-focus-within:text-[#00A1D6] transition-colors">Identifier (Username)</label>
              <div className="relative">
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" />
                <input 
                  name="username"
                  className="w-full bg-[#111] border border-white/5 text-white pl-12 pr-5 py-4 rounded-2xl focus:border-[#00A1D6]/50 focus:bg-[#161616] outline-none transition-all font-bold placeholder:text-gray-800 text-sm" 
                  placeholder="Create your username" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* Email (NEW!) */}
            <div className="space-y-1 group">
              <label className="text-[9px] font-black text-gray-500 ml-4 uppercase tracking-[0.2em] group-focus-within:text-[#00A1D6] transition-colors">Digital Contact (Email)</label>
              <div className="relative">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" />
                <input 
                  type="email"
                  name="email"
                  className="w-full bg-[#111] border border-white/5 text-white pl-12 pr-5 py-4 rounded-2xl focus:border-[#00A1D6]/50 focus:bg-[#161616] outline-none transition-all font-bold placeholder:text-gray-800 text-sm" 
                  placeholder="name@example.com" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* Password */}
            <div className="space-y-1 group relative">
              <label className="text-[9px] font-black text-gray-500 ml-4 uppercase tracking-[0.2em] group-focus-within:text-[#00A1D6] transition-colors">Access Key (Password)</label>
              <div className="relative">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" />
                <input 
                  name="password"
                  className="w-full bg-[#111] border border-white/5 text-white pl-12 pr-12 py-4 rounded-2xl focus:border-[#00A1D6]/50 focus:bg-[#161616] outline-none transition-all font-bold placeholder:text-gray-800 text-sm" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create password" 
                  onChange={handleChange} 
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password (NEW!) */}
            <div className="space-y-1 group relative">
              <label className="text-[9px] font-black text-gray-500 ml-4 uppercase tracking-[0.2em] group-focus-within:text-[#00A1D6] transition-colors">Verify Key</label>
              <div className="relative">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" />
                <input 
                  name="confirmPassword"
                  className="w-full bg-[#111] border border-white/5 text-white pl-12 pr-5 py-4 rounded-2xl focus:border-[#00A1D6]/50 focus:bg-[#161616] outline-none transition-all font-bold placeholder:text-gray-800 text-sm" 
                  type="password"
                  placeholder="Confirm password" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              disabled={isSubmitting}
              className="w-full mt-4 bg-gradient-to-r from-[#00A1D6] to-[#0076a1] text-white py-5 rounded-2xl font-black shadow-lg shadow-[#00A1D6]/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase text-xs tracking-[0.3em]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    PROCESSING...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">Initialize_Profile <FaUserPlus /></span>
              )}
            </button>
          </form>
          
          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <Link href="/login" className="text-gray-500 hover:text-white transition text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Access_Existing_Account
            </Link>
          </div>
      </div>
    </div>
  );
}