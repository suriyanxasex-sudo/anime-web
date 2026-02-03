import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import MangaList from '../components/MangaList'; // เรียกใช้ไฟล์ที่เราเพิ่งสร้าง

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // ถ้าไม่ได้ล็อกอิน ให้เด้งไปหน้า Login ทันที
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#FB7299] font-mono">ACCESS_DENIED_REVERTING...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter">Recommended <span className="text-[#FB7299]">Manga</span></h1>
        <MangaList />
      </main>
    </div>
  );
}