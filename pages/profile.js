import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaUser, FaLock, FaImage, FaCamera, FaCrown, FaUserShield, FaEnvelope, FaSignOutAlt, FaCalendarAlt, FaWallet } from 'react-icons/fa';

export default function Profile() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [form, setForm] = useState({
    username: '',
    email: '', // ✅ เพิ่ม Email
    newPassword: '',
    profilePic: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // โหลดข้อมูลเดิมมาใส่ฟอร์ม
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '', // ✅ ดึง Email เดิมมาโชว์
        newPassword: '',
        profilePic: user.profilePic || ''
      });
    }
  }, [user, authLoading, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email) return setStatusMessage({ type: 'error', text: 'MISSING_REQUIRED_DATA' });
    
    setLoading(true);
    setStatusMessage({ type: 'info', text: 'SYNCING_WITH_MAINFRAME...' });

    try {
      // ส่งข้อมูลไปอัปเดต
      const res = await axios.post('/api/user/update', {
        userId: user._id,
        username: form.username,
        email: form.email,       // ✅ ส่ง Email ไปด้วย
        password: form.newPassword, // (ถ้าไม่แก้ Backend จะข้ามเอง)
        profilePic: form.profilePic
      });

      if (res.data.success) {
        setStatusMessage({ type: 'success', text: 'IDENTITY_UPDATED_SUCCESSFULLY' });
        login(res.data.user); // อัปเดตข้อมูลใน Context ทันที
        
        // เคลียร์รหัสผ่านออกจากฟอร์ม
        setForm(prev => ({ ...prev, newPassword: '' }));
      } else {
        setStatusMessage({ type: 'error', text: 'UPDATE_FAILED: ' + res.data.message });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'SERVER_CONNECTION_LOST' });
    }
    setLoading(false);
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center pt-10 pb-20 px-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FB7299]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <button className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#FB7299] group-hover:bg-[#FB7299] transition-all">
                <FaArrowLeft className="text-xs group-hover:text-black" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return_To_Base</span>
            </button>
          </Link>

          <button onClick={logout} className="text-red-500/70 hover:text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
             Terminate_Session <FaSignOutAlt />
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Badge Status */}
          <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
            {user.isAdmin && <span className="text-[8px] bg-red-600/20 text-red-500 border border-red-500/50 px-3 py-1 rounded-full font-black flex items-center gap-1 uppercase tracking-widest"><FaUserShield/> Admin_Overlord</span>}
            {user.isPremium && <span className="text-[8px] bg-[#FB7299]/20 text-[#FB7299] border border-[#FB7299]/50 px-3 py-1 rounded-full font-black flex items-center gap-1 uppercase tracking-widest animate-pulse"><FaCrown/> VIP_Member</span>}
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-12 relative">
             <div className="relative group cursor-pointer">
                <div className="w-36 h-36 rounded-[2.5rem] bg-[#111] border-4 border-[#FB7299]/20 group-hover:border-[#FB7299] overflow-hidden shadow-[0_0_30px_rgba(251,114,153,0.2)] transition-all duration-500">
                    <img 
                        src={form.profilePic || user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt="Profile"
                        onError={(e) => e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-[#FB7299] p-3 rounded-2xl shadow-xl border-4 border-[#0a0a0a] group-hover:scale-110 transition-transform">
                    <FaCamera className="text-white text-sm" />
                </div>
             </div>
             
             <h2 className="mt-6 text-2xl font-black italic tracking-tighter uppercase text-white">
                {user.username}
             </h2>
             
             {/* User Stats */}
             <div className="flex gap-6 mt-4 text-gray-500">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <FaWallet className="text-[#00A1D6]" /> {user.points || 0} Points
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <FaCalendarAlt className="text-gray-600" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
             </div>
          </div>

          {/* Status Message */}
          {statusMessage.text && (
            <div className={`mb-8 p-4 rounded-2xl text-[10px] font-black text-center border uppercase tracking-widest animate-shake ${
              statusMessage.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 
              statusMessage.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 
              'bg-blue-500/10 border-blue-500/30 text-blue-500'
            }`}>
              {statusMessage.text}
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-2 group">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2 group-focus-within:text-[#FB7299] transition-colors">
                        <FaUser /> Identifier
                    </label>
                    <input 
                        className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 text-white focus:border-[#FB7299]/50 focus:bg-[#161616] outline-none transition-all font-bold text-sm"
                        value={form.username}
                        onChange={e => setForm({...form, username: e.target.value})}
                    />
                </div>

                {/* Email (NEW!) */}
                <div className="space-y-2 group">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2 group-focus-within:text-[#FB7299] transition-colors">
                        <FaEnvelope /> Digital_Contact
                    </label>
                    <input 
                        className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 text-white focus:border-[#FB7299]/50 focus:bg-[#161616] outline-none transition-all font-bold text-sm"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                    />
                </div>
            </div>

            {/* Profile Pic URL */}
            <div className="space-y-2 group">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2 group-focus-within:text-[#FB7299] transition-colors">
                    <FaImage /> Avatar_Source_URL
                </label>
                <input 
                    className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 text-white focus:border-[#FB7299]/50 focus:bg-[#161616] outline-none transition-all text-xs font-mono text-gray-300"
                    placeholder="https://example.com/my-image.jpg"
                    value={form.profilePic}
                    onChange={e => setForm({...form, profilePic: e.target.value})}
                />
            </div>

            {/* Password */}
            <div className="space-y-2 group">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2 group-focus-within:text-[#FB7299] transition-colors">
                    <FaLock /> Update_Access_Key (Optional)
                </label>
                <input 
                    type="password"
                    className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 text-white focus:border-[#FB7299]/50 focus:bg-[#161616] outline-none transition-all text-sm"
                    placeholder="Leave empty to keep current password"
                    value={form.newPassword}
                    onChange={e => setForm({...form, newPassword: e.target.value})}
                />
            </div>

            {/* Submit Button */}
            <button 
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white py-5 rounded-2xl font-black shadow-lg shadow-[#FB7299]/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
            >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : <><FaSave className="text-sm"/> Save_Configuration</>}
            </button>
          </form>

        </div>
        
        <div className="mt-8 text-center opacity-30 hover:opacity-100 transition-opacity">
           <p className="text-[8px] text-gray-500 font-mono">JPLUS_ID_SYSTEM // USER_REF: {user._id}</p>
        </div>
      </div>
    </div>
  );
}