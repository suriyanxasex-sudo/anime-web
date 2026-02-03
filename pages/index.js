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
      router.push('/login'); // ถ้าไม่มี User ให้เด้งไปหน้า Login ทันที
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#FB7299]">ACCESS_DENIED_REVERTING...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="p-4 md:p-10">
        <h1 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Recommended For You</h1>
        <MangaList />
      </main>
    </div>
  );
}