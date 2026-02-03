import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaCrown } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if(search.trim()) router.push(`/?search=${search}`);
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50 px-6 h-16 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-bilibili-pink flex items-center gap-2">
        <FaCrown /> AnimeJosh
      </Link>

      <form onSubmit={handleSearch} className="hidden md:flex bg-gray-100 rounded-full px-4 py-2 w-1/3">
         <input className="bg-transparent outline-none w-full" placeholder="ค้นหา..." value={search} onChange={e=>setSearch(e.target.value)} />
         <button><FaSearch className="text-gray-400"/></button>
      </form>

      <div className="flex gap-4 items-center">
        {!user?.isPremium && <Link href="/premium" className="text-xs bg-yellow-400 text-white px-2 py-1 rounded animate-pulse">GET VIP</Link>}
        {user ? (
          <>
            <span className="font-bold">{user.username}</span>
            {user.role==='admin' && <Link href="/admin" className="text-blue-500 text-sm">Admin</Link>}
            <button onClick={logout} className="text-red-500 text-sm">ออก</button>
          </>
        ) : <Link href="/login" className="bg-bilibili-pink text-white px-4 py-1 rounded">Login</Link>}
      </div>
    </nav>
  );
}