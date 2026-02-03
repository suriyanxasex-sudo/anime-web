import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaUser, FaLock, FaImage, FaCamera, FaCrown, FaUserShield } from 'react-icons/fa';

export default function Profile() {
  const { user, login, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [form, setForm] = useState({
    newUsername: '',
    newPassword: '',
    newProfilePic: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      setForm({
        newUsername: user.username || '',
        newPassword: '',
        newProfilePic: user.profilePic || ''
      });
    }
  }, [user, authLoading, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.newUsername) return setStatusMessage({ type: 'error', text: 'REQUIRED_FIELD: USERNAME_MISSING' });
    
    setLoading(true);
    setStatusMessage({ type: 'info', text: 'SYNCHRONIZING_WITH_CORE_DATABASE...' });

    try {
      const res = await axios.post('/api/user/update', {
        userId: user._id,
        ...form
      });

      if (res.data.success) {
        setStatusMessage({ type: 'success', text: 'IDENTIFICATION_SYNCHRONIZED_SUCCESSFULLY' });
        login(res.data.user); // อัปเดตข้อมูลในระบบทันที
      } else {
        setStatusMessage({ type: 'error', text: 'FAILURE: ' + res.data.message });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'CRITICAL_ERROR: SERVER_COMMUNICATION_FAULT' });
    }
    setLoading(false);
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center pt-16 px-6 relative overflow-hidden">
      {/* Visual Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#FB7299]/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="flex justify-between items-center mb-10">
          <Link href="/">
            <button className="text-gray-600 hover:text-[#FB7299] flex items-center gap-3 transition-all text-[10px] font-black uppercase tracking-[0.3em]">
              <FaArrowLeft /> [ ABORT_AND_RETURN ]
            </button>
          </Link>
          <div className="flex gap-2">
            {user.isAdmin && <span className="text-[9px] bg-red-600 px-3 py-1 rounded-full font-black flex items-center gap-2 shadow-lg shadow-red-600/20"><FaUserShield/> ROOT_ADMIN</span>}
            {user.isPremium && <span className="text-[9px] bg-[#FB7299] px-3 py-1 rounded-full font-black flex items-center gap-2 shadow-lg shadow-[#FB7299]/20"><FaCrown/> VIP_ACCESS</span>}
          </div>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative">
          <h1 className="text-3xl font-black text-center mb-12 tracking-tighter uppercase italic text-white underline decoration-[#FB7299] underline-offset-8">
            Identity <span className="text-[#FB7299]">Protocol</span>
          </h1>

          {/* Avatar System */}
          <div className="flex flex-col items-center mb-12">
             <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-black border-4 border-[#FB7299]/30 group-hover:border-[#FB7299] overflow-hidden shadow-2xl transition-all duration-500">
                    <img 
                        src={form.newProfilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt="Core Preview"
                    />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#FB7299] p-3 rounded-2xl shadow-xl border-4 border-[#111] animate-bounce">
                    <FaCamera className="text-white text-sm" />
                </div>
             </div>
             <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-widest">Digital_Avatar_Preview</p>
          </div>

          {statusMessage.text && (
            <div className={`mb-8 p-4 rounded-2xl text-[10px] font-black text-center border ${
              statusMessage.type === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-500' : 
              statusMessage.type === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-500' : 
              'bg-blue-900/20 border-blue-500/30 text-blue-500'
            }`}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <FaUser className="text-[#FB7299]"/> User_Identifier
                </label>
                <input 
                    className="w-full bg-black/60 border border-white/5 rounded-2xl p-5 text-white focus:border-[#FB7299] outline-none transition-all font-bold text-sm"
                    value={form.newUsername}
                    onChange={e => setForm({...form, newUsername: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <FaImage className="text-[#FB7299]"/> Avatar_Asset_URL
                </label>
                <input 
                    className="w-full bg-black/60 border border-white/5 rounded-2xl p-5 text-white focus:border-[#FB7299] outline-none transition-all text-xs"
                    placeholder="ENTER_IMAGE_HOST_LINK"
                    value={form.newProfilePic}
                    onChange={e => setForm({...form, newProfilePic: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <FaLock className="text-[#FB7299]"/> Secure_Access_Key (Optional)
                </label>
                <input 
                    type="password"
                    className="w-full bg-black/60 border border-white/5 rounded-2xl p-5 text-white focus:border-[#FB7299] outline-none transition-all text-sm"
                    placeholder="LEAVE_EMPTY_TO_RETAIN_CURRENT"
                    onChange={e => setForm({...form, newPassword: e.target.value})}
                />
            </div>

            <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white py-6 rounded-3xl font-black shadow-2xl shadow-[#FB7299]/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] mt-10"
            >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : <><FaSave className="text-sm"/> Commit_Identity_Changes</>}
            </button>
          </form>
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-[8px] text-gray-800 font-black uppercase tracking-[0.5em]">Jplus_Identification_v2.5_Stable</p>
        </div>
      </div>
    </div>
  );
}