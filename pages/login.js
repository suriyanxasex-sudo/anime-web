import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaShieldAlt } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 📡 CONTACTING MAINFRAME...
      const res = await axios.post('/api/user/login', form);
      
      if(res.data.success) {
        // ✅ ACCESS GRANTED
        login(res.data.user);
        router.push('/'); 
      }
    } catch (err) { 
      // ❌ ACCESS DENIED
      const msg = err.response?.data?.message || 'Access Denied: Invalid Credentials';
      setError(msg); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* 🌌 Atmospheric Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FB7299]/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00A1D6]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* 🔐 Login Core */}
      <div className="relative z-10 bg-[#0a0a0a]/80 backdrop-blur-2xl p-10 md:p-12 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.6)] w-full max-w-md border border-white/10">
        
        {/* Header */}
        <div className="text-center mb-10">
            <h1 className="text-6xl font-black text-white italic tracking-tighter mb-2 select-none">
                J<span className="text-[#FB7299]">plus</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em] border-b border-white/5 pb-6">
               <FaShieldAlt className="text-[#FB7299]" /> Secure_Access_Gateway
            </div>
        </div>

        {/* Error Feedback */}
        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-center text-[10px] font-black uppercase tracking-widest animate-shake">
                ⚠️ {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div className="space-y-1 group">
             <label className="text-[9px] font-black text-gray-500 ml-4 uppercase tracking-[0.2em] group-focus-within:text-[#FB7299] transition-colors">Identifier</label>
             <div className="relative">
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" />
                <input 
                    className="w-full bg-[#111] border border-white/5 text-white pl-12 pr-5 py-4 rounded-2xl focus:border-[#FB7299]/50 focus:bg-[#161616] outline-none transition-all font-bold placeholder:text-gray-800 text-sm" 
                    placeholder="USERNAME" 
                    value={form.username}
                    onChange={e => setForm({...form, username: e.target.value})} 
                    required
                />
             </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1 group relative">
             <label className="text-[9px] font-black text-gray-500 ml-4 uppercase tracking-[0.2em] group-focus-within:text-[#FB7299] transition-colors">Access Key</label>
             <div className="relative">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" />
                <input 
                    className="w-full bg-[#111] border border-white/5 text-white pl-12 pr-12 py-4 rounded-2xl focus:border-[#FB7299]/50 focus:bg-[#161616] outline-none transition-all font-bold placeholder:text-gray-800 text-sm" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="PASSWORD" 
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})} 
                    required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
             </div>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white py-5 rounded-2xl font-black shadow-lg shadow-[#FB7299]/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase text-xs tracking-[0.3em]"
          >
             {loading ? (
                <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    AUTHENTICATING...
                </div>
             ) : (
                <span className="flex items-center justify-center gap-2">Establish_Connection <FaSignInAlt /></span>
             )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[9px] font-black mb-3 uppercase tracking-[0.2em]">New to Jplus System?</p>
          <Link href="/register">
            <button className="px-6 py-2 rounded-full border border-[#00A1D6]/30 text-[#00A1D6] hover:bg-[#00A1D6] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#00A1D6]/10">
                Initialize_New_Identity
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}