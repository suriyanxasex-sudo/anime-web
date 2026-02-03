import React, { useState } from 'react';
import { FaGem, FaBolt, FaCrown, FaQrcode, FaWallet, FaCheckCircle } from 'react-icons/fa';

export default function PointShop() {
  const [showQR, setShowQR] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  const packages = [
    { id: 'p1', name: 'Starter Pack', points: 100, price: 35, icon: <FaBolt className="text-yellow-400"/>, note: 'เริ่มต้นอ่านเบาๆ' },
    { id: 'p2', name: 'Pro Reader', points: 350, price: 99, icon: <FaGem className="text-[#00A1D6]"/>, note: 'ยอดนิยม! คุ้มค่าที่สุด', hot: true },
    { id: 'p3', name: 'Mega Vault', points: 800, price: 199, icon: <FaCrown className="text-[#FB7299]"/>, note: 'สำหรับแฟนพันธุ์แท้' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-2">
            J<span className="text-[#FB7299]">plus</span>_Points
          </h2>
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.4em] uppercase">Account_Manager: JOSHUA_MAYOE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <div key={pkg.id} onClick={() => { setSelectedPkg(pkg); setShowQR(true); }} className={`relative bg-[#0a0a0a] border ${pkg.hot ? 'border-[#FB7299] shadow-[0_0_40px_rgba(251,114,153,0.15)]' : 'border-white/5'} p-8 rounded-[3rem] hover:-translate-y-2 transition-all duration-500 cursor-pointer group`}>
              {pkg.hot && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FB7299] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase">RECOMMENDED</div>}
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{pkg.icon}</div>
              <h3 className="text-xl font-black uppercase mb-1">{pkg.name}</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-white tracking-tighter">{pkg.points}</span>
                <span className="text-[#FB7299] font-black text-xs uppercase">J-PTS</span>
              </div>
              <button className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-[#FB7299] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                <FaWallet /> {pkg.price} THB
              </button>
            </div>
          ))}
        </div>

        {showQR && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[999] flex items-center justify-center p-4">
            <div className="bg-[#0d0d0d] border border-white/10 w-full max-w-md p-10 rounded-[4rem] text-center shadow-[0_0_100px_rgba(251,114,153,0.1)]">
              <div className="mb-8 inline-block bg-white p-6 rounded-[2.5rem] shadow-2xl">
                <div className="w-48 h-48 bg-[#eee] flex items-center justify-center border-4 border-double border-gray-300">
                  <FaQrcode className="text-6xl text-[#00427A]" />
                </div>
              </div>
              <h3 className="text-2xl font-black italic mb-2 uppercase text-white">SCAN_TO_PAY</h3>
              <div className="text-[#FB7299] text-3xl font-black mb-6 italic tracking-tighter">{selectedPkg?.price}.00 THB</div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left mb-8">
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Receiver_Name</p>
                <p className="text-sm font-black text-white uppercase tracking-tight">นาย โจชัวร์ มาเยอะ</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowQR(false)} className="py-4 bg-white/5 text-gray-400 font-black rounded-2xl hover:bg-white/10 transition-all text-xs uppercase">CANCEL</button>
                <button onClick={() => setShowQR(false)} className="py-4 bg-[#FB7299] text-white font-black rounded-2xl shadow-lg shadow-[#FB7299]/20 text-xs uppercase">I_PAID_ALREADY</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}