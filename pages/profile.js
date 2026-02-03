import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaUser, FaLock, FaImage } from 'react-icons/fa';

export default function Profile() {
  const { user, login } = useAuth();
  const router = useRouter();
  
  // สร้างตัวแปรเก็บข้อมูลฟอร์ม
  const [form, setForm] = useState({
    newUsername: '',
    newPassword: '',
    newProfilePic: ''
  });
  const [loading, setLoading] = useState(false);

  // โหลดข้อมูลเดิมมาใส่ในช่อง
  useEffect(() => {
    if (user) {
      setForm(prev => ({ 
          ...prev, 
          newUsername: user.username,
          newProfilePic: user.profilePic || '' 
      }));
    } else {
      router.push('/login');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/user/edit', {
        userId: user._id || user.id, // รองรับทั้งสองแบบ
        ...form
      });

      if (res.data.success) {
        alert('บันทึกข้อมูลสำเร็จ! ✅');
        // อัปเดตข้อมูลในเว็บทันที โดยไม่ให้หลุด
        login({ ...user, ...res.data.user }); 
      } else {
        alert('เกิดข้อผิดพลาด: ' + res.data.message);
      }
    } catch (err) {
      alert('เชื่อมต่อ Server ไม่ได้');
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#18191C] text-white font-sans flex flex-col items-center pt-10">
      
      {/* Header */}
      <div className="w-full max-w-md px-4 mb-6 flex items-center">
         <Link href="/">
            <button className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                <FaArrowLeft /> กลับหน้าหลัก
            </button>
         </Link>
      </div>

      <div className="bg-[#2A2B2F] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
         <h1 className="text-2xl font-bold text-center mb-8 text-[#FB7299]">แก้ไขโปรไฟล์</h1>

         {/* รูปโปรไฟล์พรีวิว */}
         <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-black border-4 border-[#FB7299] overflow-hidden shadow-lg relative group">
                <img 
                    src={form.newProfilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                />
            </div>
         </div>

         <form onSubmit={handleSave} className="space-y-6">
            
            {/* แก้ชื่อ */}
            <div>
                <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2"><FaUser/> ชื่อผู้ใช้</label>
                <input 
                    className="w-full bg-[#18191C] border border-gray-600 rounded-lg p-3 text-white focus:border-[#FB7299] focus:outline-none transition"
                    value={form.newUsername}
                    onChange={e => setForm({...form, newUsername: e.target.value})}
                />
            </div>

            {/* แก้รูป (ใส่ลิงก์) */}
            <div>
                <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2"><FaImage/> ลิงก์รูปโปรไฟล์ (URL)</label>
                <input 
                    className="w-full bg-[#18191C] border border-gray-600 rounded-lg p-3 text-white focus:border-[#FB7299] focus:outline-none transition text-sm"
                    placeholder="https://..."
                    value={form.newProfilePic}
                    onChange={e => setForm({...form, newProfilePic: e.target.value})}
                />
                <p className="text-[10px] text-gray-500 mt-1">*ก๊อปปี้ลิงก์รูปจากเน็ตมาใส่ได้เลย</p>
            </div>

            {/* แก้รหัสผ่าน */}
            <div>
                <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2"><FaLock/> รหัสผ่านใหม่ (ไม่เปลี่ยนให้เว้นว่าง)</label>
                <input 
                    type="password"
                    className="w-full bg-[#18191C] border border-gray-600 rounded-lg p-3 text-white focus:border-[#FB7299] focus:outline-none transition"
                    placeholder="ตั้งรหัสผ่านใหม่..."
                    onChange={e => setForm({...form, newPassword: e.target.value})}
                />
            </div>

            <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FB7299] to-[#FF5D87] text-white py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
            >
                {loading ? 'กำลังบันทึก...' : <><FaSave /> บันทึกการเปลี่ยนแปลง</>}
            </button>

         </form>
      </div>
    </div>
  );
}