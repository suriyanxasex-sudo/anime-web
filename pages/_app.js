import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ระบบ Top Loading Bar: ให้ความรู้สึกเหมือนเว็บแอปพลิเคชันระดับสูง
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

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
      <Head>
        {/* ✨ Jplus Branding Identity ✨ */}
        <title>Jplus Manga+ | Next-Gen Reading Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="description" content="สัมผัสประสบการณ์การอ่านมังงะและมังฮวาระดับพรีเมียมด้วยระบบ Multi-Source ที่ดีที่สุดในไทย พัฒนาโดย JOSHUA" />
        <meta name="theme-color" content="#18191C" />
        
        {/* Open Graph: สำหรับเวลาแชร์ลิงก์ลง Facebook/Discord ให้ดูหล่อ */}
        <meta property="og:title" content="Jplus Manga+ | The Next Era of Reading" />
        <meta property="og:description" content="Premium Manga & Manhwa Reader by Joshua Mayoe" />
        <meta property="og:image" content="https://jplus-manga.vercel.app/og-image.jpg" />
        <meta property="og:type" content="website" />
        
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 🚀 ระบบ Top Progress Bar (ความละเอียดสูง) */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[9999] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FB7299] to-[#00A1D6] animate-progress-loading"></div>
        </div>
      )}

      {/* 🌑 GLOBAL_DARK_MODE_CONTAINER 
          อัปเกรดสีพื้นหลังเป็น Deep Black [#0a0a0a] เพื่อให้ตัดกับสีชมพู [FB7299] ได้คมชัดที่สุด 
      */}
      <div className="bg-[#0a0a0a] min-h-screen text-white font-sans antialiased selection:bg-[#FB7299]/30 selection:text-[#FB7299]">
        <div className="relative z-10">
          <Component {...pageProps} />
        </div>

        {/* ระบบตกแต่งแสงฟุ้ง (Global Ambient Light) - เพิ่มความหรูหราให้ UI */}
        <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FB7299]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#00A1D6]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      </div>

      <style jsx global>{`
        @keyframes progress-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-loading {
          animation: progress-loading 1.5s infinite linear;
        }
        /* Custom Scrollbar สำหรับสาย Hardcore */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #FB7299;
        }
      `}</style>
    </AuthProvider>
  );
}

export default MyApp;