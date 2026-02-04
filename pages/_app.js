import '../styles/globals.css';
import 'nprogress/nprogress.css'; // 📥 โหลด CSS ของ NProgress เข้ามา
import { AuthProvider } from '../context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import { Outfit } from 'next/font/google'; // 🚀 ใช้ระบบฟอนต์ของ Next.js

// 🔠 Config ฟอนต์ Outfit (เท่และทันสมัย)
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // ⚡️ [PROGRESS_BAR_PROTOCOL] - ระบบโหลดหน้าเว็บแบบ Pro
  useEffect(() => {
    // ปิดวงกลมหมุนๆ (Spinner) เอาแค่ขีดวิ่งด้านบนพอ เท่กว่า
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <AuthProvider>
      {/* ใช้ Class ของฟอนต์คลุมทั้งแอป */}
      <main className={`${outfit.className} min-h-screen bg-[#050505] text-white selection:bg-[#FB7299]/30 selection:text-[#FB7299]`}>
        
        <Head>
          {/* ✨ Jplus Branding Identity ✨ */}
          <title>JPLUS MANGA+ | GOD MODE EDITION</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <meta name="description" content="Premium Manga & Manhwa Reader Platform developed by JOSHUA_MAYOE" />
          <meta name="theme-color" content="#050505" />
          
          {/* Open Graph */}
          <meta property="og:title" content="Jplus Manga+ | The Next Era of Reading" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://jplus-manga.vercel.app/og-image.jpg" />
          
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* 🎭 Page Content */}
        <div className="relative z-10">
          <Component {...pageProps} />
        </div>

        {/* 💡 Global Ambient Light (แสงฟุ้งพื้นหลัง) */}
        <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#FB7299]/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#00A1D6]/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      </main>
    </AuthProvider>
  );
}

export default MyApp;