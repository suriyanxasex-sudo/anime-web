import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import MangaList from '../components/MangaList';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // เด้งไป Login ถ้ายังไม่ระบุตัวตน
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#FB7299] font-mono tracking-tighter">ACCESS_DENIED_REVERTING...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FB7299]">
      <Navbar />
      <main className="p-6 md:p-12 max-w-[1600px] mx-auto">
        <div className="mb-12 border-l-4 border-[#FB7299] pl-6">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Recommended <span className="text-[#FB7299]">Manga</span></h1>
          <p className="text-gray-600 text-[10px] font-bold mt-1 tracking-widest uppercase">Global Database Synchronization Active</p>
        </div>
        <MangaList />
      </main>
    </div>
  );
}