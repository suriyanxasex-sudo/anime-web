import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaInfoCircle, FaCog } from 'react-icons/fa';

export default function Reader() {
  const router = useRouter();
  const { id, title } = router.query;
  const [zoom, setZoom] = useState(100);

  // ระบบจำตอนที่อ่านค้างไว้ (Local Storage)
  useEffect(() => {
    if (id) {
      localStorage.setItem('LAST_READ_ID', id);
      localStorage.setItem('LAST_READ_TITLE', title);
    }
  }, [id, title]);

  if (!id) return null;

  return (
    <div className="bg-black h-screen flex flex-col overflow-hidden">
      {/* 🟢 READER_CONTROL_PANEL */}
      <div className="h-16 bg-[#111] border-b border-white/5 flex items-center justify-between px-6 z-50 shadow-2xl">
        <div className="flex items-center gap-6">
          <Link href="/">
            <button className="flex items-center gap-2 text-xs font-bold text-[#FB7299] hover:bg-[#FB7299]/10 px-4 py-2 rounded-xl transition">
              <FaChevronLeft /> EXIT
            </button>
          </Link>
          <div className="h-6 w-px bg-white/10"></div>
          <h1 className="text-white font-black text-xs uppercase tracking-widest truncate max-w-[150px] md:max-w-md">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
            <button onClick={() => setZoom(z => z + 10)} className="text-[10px] font-bold bg-white/5 px-3 py-1 rounded hover:bg-white/10">+</button>
            <span className="text-[10px] font-mono text-gray-500">{zoom}%</span>
            <button onClick={() => setZoom(z => z - 10)} className="text-[10px] font-bold bg-white/5 px-3 py-1 rounded hover:bg-white/10">-</button>
            <FaCog className="text-gray-500 cursor-pointer hover:rotate-90 transition duration-500" />
        </div>
      </div>

      {/* 📖 INTERNAL_IFRAME_VIEWER */}
      <div className="flex-1 w-full bg-[#050505] relative overflow-auto scrollbar-hide">
        <div className="w-full h-full flex justify-center" style={{ transform: `scale(${zoom/100})`, transformOrigin: 'top center' }}>
            {/* ดึงตัวอ่านต้นฉบับมาฝังในเว็บเรา */}
            <iframe
              src={`https://mangadex.org/book/${id}`}
              className="w-full max-w-5xl h-full border-none shadow-[0_0_100px_rgba(0,0,0,1)]"
              allowFullScreen
            ></iframe>
        </div>
        
        {/* Anti-Bypass Shield */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FB7299] via-[#00A1D6] to-[#FB7299]"></div>
      </div>

      {/* 📱 MOBILE_NAV */}
      <div className="md:hidden h-12 bg-[#111] flex items-center justify-center text-[10px] font-mono text-gray-600 border-t border-white/5">
         JPLUS_ENCRYPTED_STREAMING_v1.0
      </div>
    </div>
  );
}