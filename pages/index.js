import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { search } = router.query;

  useEffect(() => {
    setLoading(true);
    const url = search ? `/api/animes?search=${search}` : '/api/animes';
    axios.get(url).then(res => { setAnimes(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [search]);

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-[#18191C] mb-6 border-l-4 border-[#FB7299] pl-3">
             {search ? `ค้นหา: "${search}"` : 'อนิเมะมาใหม่'}
        </h1>

        {loading && <div className="text-center p-10">Loading...</div>}

        {!loading && animes.length === 0 && (
          <div className="text-center p-20 bg-white rounded-xl shadow">
             <h2 className="text-xl font-bold text-gray-500 mb-2">ไม่มีข้อมูลอนิเมะ</h2>
             <Link href="/admin" className="text-[#00A1D6] underline">ไปหน้า Admin สั่งบอททำงาน</Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {animes.map(a => (
            <Link key={a._id} href={`/watch/${a._id}`}>
              <div className="cursor-pointer group bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <div className="aspect-[3/4] overflow-hidden relative">
                   <img src={a.imageUrl} className="object-cover w-full h-full group-hover:scale-110 transition duration-500" />
                   <div className="absolute top-1 right-1 bg-[#FB7299] text-white text-[10px] px-1 rounded">{a.episodes?.length} EP</div>
                </div>
                <div className="p-2">
                   <h3 className="text-sm font-bold line-clamp-1 group-hover:text-[#00A1D6]">{a.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}