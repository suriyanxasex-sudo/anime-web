import '../styles/globals.css'; 
import { AuthProvider } from '../context/AuthContext';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        {/* เปลี่ยนชื่อจาก AnimeJosh เป็น Jplus Manga ให้หล่อๆ */}
        <title>Jplus Manga+ | อ่านมังงะ มังฮวา สัญญาณสด</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Jplus Manga แหล่งรวมมังงะและมังฮวายอดนิยม อัปเดตใหม่ทุกวัน" />
      </Head>

      {/* เปลี่ยนสีพื้นหลังหลัก (Global Background) 
         จากเดิมที่เป็นสีเทาขาว [#F4F5F7] ให้เป็นสีดำเข้ม [#18191C] 
         และเปลี่ยนสีตัวอักษรให้เป็นสีขาว เพื่อให้เป็น Dark Mode ทั้งเว็บ
      */}
      <div className="bg-[#18191C] min-h-screen text-white font-sans selection:bg-[#FB7299] selection:text-white">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default MyApp;