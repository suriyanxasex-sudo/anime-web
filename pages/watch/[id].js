import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Player from '../../components/Player';
import { useAuth } from '../../context/AuthContext';

export default function Watch() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [anime, setAnime] = useState(null);
  const [epIdx, setEpIdx] = useState(0);
  const [srvIdx, setSrvIdx] = useState(0);

  useEffect(() => {
    if(id) axios.get(`/api/animes/${id}`).then(res => setAnime(res.data));
  }, [id]);

  if (!anime) return <div>Loading...</div>;
  if (!anime.episodes.length) return <div>No Episodes</div>;

  const ep = anime.episodes[epIdx];
  const srv = ep.servers[srvIdx];

  return (
    <div className="bg-bilibili-dark min-h-screen text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Player src={srv.url} isPremium={srv.isPremium} userHasAccess={user?.isPremium} />
          <h1 className="text-xl font-bold mt-4">{anime.title} - {ep.title}</h1>
          <div className="flex gap-2 mt-2">
             {ep.servers.map((s, i) => (
               <button key={i} onClick={()=>setSrvIdx(i)} className={`px-3 py-1 rounded text-sm ${srvIdx===i ? 'bg-bilibili-blue' : 'bg-gray-700'}`}>
                 {s.name} {s.isPremium && '👑'}
               </button>
             ))}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
           <h3 className="font-bold mb-2">เลือกตอน</h3>
           <div className="grid grid-cols-4 gap-2">
              {anime.episodes.map((e, i) => (
                <button key={i} onClick={()=>{setEpIdx(i); setSrvIdx(0)}} className={`p-2 rounded text-sm ${epIdx===i ? 'bg-bilibili-pink' : 'bg-gray-700'}`}>
                  {e.number}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}