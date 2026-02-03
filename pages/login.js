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
      // ✅ FIX: ต้องมี /api นำหน้าเสมอ
      const res = await axios.post('/api/user/login', form);
      if(res.data.success) {
        if (res.data.user.username === 'joshua') {
            alert('ยินดีต้อนรับท่าน Admin Joshua! 👑');
        }
        login(res.data.user);
        router.push('/'); 
      } else {
        setError(res.data.message || 'รหัสผ่านผิด');
      }
    } catch (err) { 
      setError(err.response?.data?.message || 'เชื่อมต่อ Server ไม่ได้ (เช็ค MongoDB/Network Access)');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... (ใช้โค้ด HTML/Tailwind เดิมของลูกพี่ได้เลย จุดสำคัญคือ handleSubmit ด้านบนครับ)
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
       {/* โค้ด UI เดิมของลูกพี่ */}
       <form onSubmit={handleSubmit}>
          {/* input fields */}
          <button disabled={isSubmitting}>SIGN_IN</button>
       </form>
    </div>
  );
}