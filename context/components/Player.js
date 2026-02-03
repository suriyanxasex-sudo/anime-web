import Link from 'next/link';
import { FaLock } from 'react-icons/fa';

export default function Player({ src, isPremium, userHasAccess }) {
  if (isPremium && !userHasAccess) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex flex-col items-center justify-center text-white relative">
        <FaLock className="text-5xl text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold">VIP Only</h2>
        <Link href="/premium" className="mt-2 bg-bilibili-pink px-4 py-2 rounded">สมัครสมาชิก</Link>
      </div>
    );
  }
  return <iframe src={src} className="w-full aspect-video rounded" allowFullScreen frameBorder="0"></iframe>;
}