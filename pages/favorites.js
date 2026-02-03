import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // ถ้าคุณไม่ได้ใช้ Navbar แยก ให้ก๊อป Navbar จาก index มาใส่ หรือลบออก
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';

export default function Favorites() {
  const [favs, setFavs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.favorites) {
       // ถ้า User มีรายการโปรดอยู่แล้ว (จากการ Login)
       // แต่เราควรดึงข้อมูลล่าสุดเพื่อให้ได้รูปภาพและชื่อเรื่อง
       axios.post('/api/user/favorite', { username: user.username, animeId: null }) // ทริกเพื่อให้มันส่ง list กลับมา
            .then(res => setFavs(res.data.favorites || []));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#18191C] text-white p-4 font-sans">
      <Link href="/"><button className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white"><FaArrowLeft /> กลับหน้าหลัก</button></Link>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#FB7299]"><FaHeart /> รายการโปรดของฉัน</h1>
      
      {favs.length === 0 ? (
        <div className="text-gray-500 text-center mt-20">ยังไม่มีเรื่องที่ถูกใจเลยเหรอ? ไปกดหัวใจหน่อยเร็ว!</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favs.map(a => (
             <Link key={a._id} href={`/watch/${a._id}`}>
                <div className="bg-[#2A2B2F] rounded-xl overflow-hidden shadow cursor-pointer hover:scale-105 transition">
                   <img src={a.imageUrl} className="aspect-[3/4] object-cover w-full" />
                   <div className="p-3"><h3 className="text-sm font-bold line-clamp-1">{a.title}</h3></div>
                </div>
             </Link>
          ))}
        </div>
      )}
    </div>
  );
}