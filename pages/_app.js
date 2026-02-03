import '../styles/globals.css'; // สำคัญมาก! บรรทัดนี้ดึงสีเข้าเว็บ
import { AuthProvider } from '../context/AuthContext';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>AnimeJosh</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bg-[#F4F5F7] min-h-screen text-[#18191C] font-sans">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
export default MyApp;