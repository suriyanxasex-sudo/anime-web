import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaUser, FaLock, FaImage, FaCamera } from 'react-icons/fa';

export default function Profile() {
  const { user, login, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [form, setForm] = useState({
    newUsername: '',
    newPassword: '',
    newProfilePic: ''
  });
  const [loading, setLoading] = useState(false);

  // ป้องกันคนไม่ได้ Login เข้าหน้านี้
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
    if (!form.newUsername) return alert('กรุณาระบุชื่อผู้ใช้');
    
    setLoading(true);
    try {
      // เรียกใช้ API อัปเดตข้อมูล (ส่ง userId และข้อมูลใหม่ไป)
      const res = await axios.post('/api/user/update', {
        userId: user._id,
        ...form
      });

      if (res.data.success) {
        alert('อัปเดตโปรไฟล์ Jplus สำเร็จ! ✨');
        // อัปเดตข้อมูลใน Context ทันทีเพื่อให้ชื่อและรูปในหน้าอื่นเปลี่ยนตาม
        login(res.data.user); 
      } else {
        alert('ล้มเหลว: ' + res.data.message);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    }
    setLoading(false);
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col items-center pt-10 px-4">
      
      {/* Navigation */}
      <div className="w-full max-w-md mb-8 flex items-center justify-between">
         <Link href="/">
            <button className="text-gray-500 hover:text-[#FB7299] flex items-center gap-2 transition text-sm font-bold uppercase tracking-widest">
                <FaArrowLeft /> [HOME]
            </button>
         </Link>
         {user.isPremium && <span className="text-[10px] bg-[#FB7299] px-2 py-0.5 rounded font-black text-white shadow-lg shadow-[#FB7299]/20">VIP_MEMBER</span>}
      </div>

      <div className="bg-[#18191C] p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/5 relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FB7299]/5 rounded-full blur-3xl"></div>

          <h1 className="text-2xl font-black text-center mb-10 tracking-tighter uppercase italic">
            Edit <span className="text-[#FB7299]">Identity</span>
          </h1>

          {/* Avatar Preview */}
          <div className="flex justify-center mb-10">
             <div className="relative">
                <div className="w-28 h-28 rounded-[2rem] bg-black border-2 border-[#FB7299] overflow-hidden shadow-2xl rotate-3">
                    <img 
                        src={form.newProfilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username} 
                        className="w-full h-full object-cover -rotate-3 scale-110"
                        alt="Profile Preview"
                        onError={(e) => e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=jplus"}
                    />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#FB7299] p-2 rounded-xl shadow-lg border-4 border-[#18191C]">
                    <FaCamera className="text-white text-xs" />
                </div>
             </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6 relative z-10">
            
            {/* Username Input */}
            <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 flex items-center gap-2 uppercase tracking-widest"><FaUser/> Username</label>
                <input 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:border-[#FB7299]/50 focus:outline-none transition font-bold"
                    value={form.newUsername}
                    onChange={e => setForm({...form, newUsername: e.target.value})}
                />
            </div>

            {/* Profile Pic Link */}
            <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 flex items-center gap-2 uppercase tracking-widest"><FaImage/> Image URL</label>
                <input 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:border-[#FB7299]/50 focus:outline-none transition text-xs"
                    placeholder="ใส่ลิงก์รูปภาพของคุณที่นี่..."
                    value={form.newProfilePic}
                    onChange={e => setForm({...form, newProfilePic: e.target.value})}
                />
            </div>

            {/* Password Input */}
            <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 flex items-center gap-2 uppercase tracking-widest"><FaLock/> New Password (Optional)</label>
                <input 
                    type="password"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:border-[#FB7299]/50 focus:outline-none transition"
                    placeholder="ปล่อยว่างหากไม่ต้องการเปลี่ยน"
                    onChange={e => setForm({...form, newPassword: e.target.value})}
                />
            </div>

            <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#FB7299]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-widest"
            >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : <><FaSave /> Commit_Changes</>}
            </button>

          </form>
      </div>

      <p className="mt-8 text-[10px] text-gray-700 uppercase font-bold tracking-[0.3em]">
        Jplus Identification System v2.0
      </p>
    </div>
  );
}