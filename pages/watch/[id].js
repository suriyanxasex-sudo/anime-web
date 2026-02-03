import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FaList, FaPlayCircle, FaArrowLeft, FaHeart, FaRegHeart, FaPaperPlane } from 'react-icons/fa';

export default function Watch() {
  const router = useRouter();
  const { id } = router.query;
  const { user, login } = useAuth(); // ใช้ login เพื่ออัปเดตข้อมูล user กลับไป
  
  const [anime, setAnime] = useState(null);
  const [currentEp, setCurrentEp] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if(id) {
      // 1. โหลดข้อมูลหนัง
      axios.get(`/api/animes/${id}`).then(res => setAnime(res.data));
      // 2. โหลดคอมเมนต์
      axios.get(`/api/comment?animeId=${id}`).then(res => setComments(res.data));
    }
  }, [id]);

  useEffect(() => {
    // เช็คว่าเรื่องนี้อยู่ใน Fav หรือยัง
    if (user && user.favorites && id) {
       // user.favorites อาจเก็บเป็น Object หรือ ID string ต้องเช็คดีๆ
       const found = user.favorites.find(f => (f._id === id || f === id));
       setIsFav(!!found);
    }
  }, [user, id]);

  const toggleFavorite = async () => {
    if(!user) return alert('กรุณาล็อกอินก่อนครับ');
    const res = await axios.post('/api/user/favorite', { username: user.username, animeId: id });
    if(res.data.success) {
        setIsFav(!isFav);
        login({ ...user, favorites: res.data.favorites }); // อัปเดตข้อมูล User ในเครื่องทันที
    }
  }

  const sendComment = async () => {
    if(!newComment.trim()) return;
    if(!user) return alert('ล็อกอินก่อนคอมเมนต์นะจ๊ะ');
    
    const res = await axios.post('/api/comment', {
        userId: user._id || user.id,
        username: user.username,
        profilePic: user.profilePic,
        animeId: id,
        text: newComment
    });
    
    if(res.data.success) {
        setComments([res.data.comment, ...comments]); // เอาคอมเมนต์ใหม่แปะบนสุด
        setNewComment('');
    }
  }

  if(!anime) return <div className="min-h-screen bg-[#18191C] flex items-center justify-center text-white">Loading...</div>;
  const activeEpisode = anime.episodes[currentEp];

  return (
    <div className="min-h-screen bg-[#18191C] text-white font-sans pb-10">
      {/* Header */}
      <div className="bg-[#2A2B2F] p-4 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <Link href="/"><button className="text-gray-400 hover:text-white"><FaArrowLeft /></button></Link>
            <h1 className="text-sm font-bold line-clamp-1 text-gray-200">{anime.title} <span className="text-[#FB7299]">EP {activeEpisode?.number}</span></h1>
        </div>
        {/* ปุ่มหัวใจ */}
        <button onClick={toggleFavorite} className="text-2xl transition hover:scale-110">
            {isFav ? <FaHeart className="text-[#FB7299]" /> : <FaRegHeart className="text-gray-400" />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:flex gap-6">
        
        {/* --- ฝั่งซ้าย: จอหนัง + คอมเมนต์ --- */}
        <div className="flex-1">
           {/* Player */}
           <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              {activeEpisode ? (
                 <iframe src={activeEpisode.servers[0].url} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
              ) : <div className="flex items-center justify-center h-full text-gray-500">เลือกตอนเพื่อรับชม</div>}
           </div>
           
           {/* Info */}
           <div className="mt-4 mb-8">
              <h2 className="text-xl font-bold text-[#00A1D6]">{anime.title}</h2>
              <p className="text-gray-400 text-xs mt-2">{anime.synopsis || 'ไม่มีเรื่องย่อ'}</p>
           </div>

           {/* Comment Section */}
           <div className="bg-[#2A2B2F] rounded-xl p-4">
              <h3 className="font-bold mb-4 text-sm text-gray-300">ความคิดเห็น ({comments.length})</h3>
              
              {/* ช่องพิมพ์ */}
              <div className="flex gap-2 mb-6">
                 <input 
                    className="flex-1 bg-[#18191C] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00A1D6]"
                    placeholder="แสดงความคิดเห็นหน่อย..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendComment()}
                 />
                 <button onClick={sendComment} className="bg-[#00A1D6] p-2 rounded-full text-white"><FaPaperPlane /></button>
              </div>

              {/* รายการคอมเมนต์ */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                 {comments.map((c, i) => (
                    <div key={i} className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
                          {c.profilePic ? <img src={c.profilePic} /> : <div className="w-full h-full flex items-center justify-center text-xs">{c.username[0]}</div>}
                       </div>
                       <div>
                          <div className="text-xs font-bold text-gray-400">{c.username}</div>
                          <div className="text-sm text-gray-200 bg-[#18191C] px-3 py-1 rounded-lg inline-block mt-1">{c.text}</div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* --- ฝั่งขวา: Playlist --- */}
        <div className="lg:w-80 mt-6 lg:mt-0 flex-shrink-0">
           <div className="bg-[#2A2B2F] rounded-xl p-4 h-[500px] flex flex-col">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-300"><FaList /> ตอนทั้งหมด</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                 {anime.episodes.map((ep, index) => (
                    <div key={index} onClick={() => setCurrentEp(index)}
                      className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition ${currentEp === index ? 'bg-[#FB7299] text-white shadow-lg' : 'bg-[#18191C] text-gray-400 hover:bg-[#3E3F45]'}`}>
                       <FaPlayCircle className={currentEp === index ? 'text-white' : 'text-gray-600'} />
                       <div className="text-xs font-bold">ตอนที่ {ep.number}</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}