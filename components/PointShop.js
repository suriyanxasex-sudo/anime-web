import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // อย่าลืมดึง Auth มาใช้
import { FaGem, FaBolt, FaCrown, FaQrcode, FaWallet, FaCheckCircle, FaTimes, FaSpinner, FaCopy } from 'react-icons/fa';

/**
 * JPLUS_POINT_STORE v3.0
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * สถานะ: UPGRADED - Payment Simulation & Premium UI
 */

export default function PointShop() {
  const { user } = useAuth(); // ดึงข้อมูล User มาโชว์แต้มปัจจุบัน
  const [showQR, setShowQR] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('IDLE'); // IDLE | CHECKING | SUCCESS

  const packages = [
    { 
      id: 'p1', 
      name: 'Starter Pack', 
      points: 100, 
      price: 35, 
      icon: <FaBolt className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"/>, 
      note: 'เหมาะสำหรับมือใหม่',
      color: 'from-yellow-400 to-orange-500'
    },
    { 
      id: 'p2', 
      name: 'Pro Reader', 
      points: 350, 
      price: 99, 
      icon: <FaGem className="text-[#00A1D6] drop-shadow-[0_0_10px_rgba(0,161,214,0.5)]"/>, 
      note: 'ขายดี! คุ้มค่าที่สุด', 
      hot: true,
      color: 'from-[#00A1D6] to-[#0078A0]'
    },
    { 
      id: 'p3', 
      name: 'Mega Vault', 
      points: 800, 
      price: 199, 
      icon: <FaCrown className="text-[#FB7299] drop-shadow-[0_0_10px_rgba(251,114,153,0.5)]"/>, 
      note: 'สำหรับสายเปย์ตัวจริง',
      color: 'from-[#FB7299] to-[#FF4D80]'
    },
  ];

  // จำลองระบบตรวจสอบสลิป
  const handleVerifyPayment = () => {
    setPaymentStatus('CHECKING');
    setTimeout(() => {
      setPaymentStatus('SUCCESS');
      // ตรงนี้จริงๆ ต้องยิง API ไปบอก Server ว่าเติมเงินแล้ว
    }, 2000);
  };

  // Reset เมื่อปิด Modal
  useEffect(() => {
    if (!showQR) setPaymentStatus('IDLE');
  }, [showQR]);

  return (
    <div className="min-h-screen bg-[#050505] text-white py-10 px-4 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FB7299]/5 to-transparent pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#00A1D6]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-white/5 pb-8">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
              J<span className="text-[#FB7299]">plus</span>_Store
            </h2>
            <p className="text-gray-500 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">
              Secure_Payment_Gateway_v3.0
            </p>
          </div>

          {/* User Balance Card */}
          <div className="bg-[#111] border border-white/10 p-6 rounded-3xl flex items-center gap-5 shadow-2xl">
            <div className="text-right">
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Current_Balance</p>
              <div className="text-3xl font-black text-[#FB7299] leading-none tracking-tighter">
                {user?.points?.toLocaleString() || 0} <span className="text-xs text-white">PTS</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-tr from-[#FB7299] to-[#FF4D80] rounded-full flex items-center justify-center shadow-lg shadow-[#FB7299]/30">
              <FaWallet className="text-xl text-white" />
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              onClick={() => { setSelectedPkg(pkg); setShowQR(true); }} 
              className={`group relative bg-[#0a0a0a] border ${pkg.hot ? 'border-[#FB7299] shadow-[0_0_50px_rgba(251,114,153,0.1)]' : 'border-white/5'} p-8 rounded-[3rem] hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden`}
            >
              {/* Hover Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              {pkg.hot && (
                <div className="absolute top-0 inset-x-0 flex justify-center">
                  <div className="bg-[#FB7299] text-white text-[9px] font-black px-4 py-1.5 rounded-b-xl uppercase tracking-widest shadow-lg shadow-[#FB7299]/30">
                    Best_Seller
                  </div>
                </div>
              )}
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 origin-left">
                  {pkg.icon}
                </div>
                
                <h3 className="text-2xl font-black uppercase italic mb-1 text-gray-200 group-hover:text-white transition-colors">{pkg.name}</h3>
                <p className="text-xs text-gray-500 font-bold mb-6">{pkg.note}</p>
                
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">{pkg.points}</span>
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${pkg.color} font-black text-sm uppercase`}>PTS</span>
                  </div>
                  
                  <button className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-gradient-to-r hover:from-[#FB7299] hover:to-[#FF4D80] hover:text-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl">
                    <span>⚡ GET NOW</span>
                    <span className="w-1 h-1 bg-current rounded-full mx-1"></span>
                    <span>฿{pkg.price}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QR Code Modal (Payment Terminal) */}
        {showQR && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#0d0d0d] border border-white/10 w-full max-w-sm rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
              
              {/* Modal Header */}
              <div className="bg-[#151515] p-6 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Live_Transaction</span>
                </div>
                <button onClick={() => setShowQR(false)} className="text-gray-500 hover:text-white transition-colors">
                  <FaTimes />
                </button>
              </div>

              <div className="p-8 text-center">
                {paymentStatus === 'SUCCESS' ? (
                  // ✅ Success State
                  <div className="py-10 animate-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_lime]">
                      <FaCheckCircle className="text-5xl text-white" />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic text-white mb-2">Payment Verified!</h3>
                    <p className="text-gray-500 text-xs">Points have been added to your wallet.</p>
                  </div>
                ) : (
                  // 💳 QR Code State
                  <>
                    <h3 className="text-xl font-black italic mb-1 uppercase text-white">Scan PromptPay</h3>
                    <p className="text-gray-500 text-xs mb-6">Scan with any banking app</p>
                    
                    <div className="relative inline-block p-4 bg-white rounded-3xl shadow-2xl mb-6 group cursor-none">
                      {paymentStatus === 'CHECKING' && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-3xl">
                          <FaSpinner className="text-4xl text-[#FB7299] animate-spin mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#FB7299]">Verifying...</span>
                        </div>
                      )}
                      <div className="w-48 h-48 bg-[#f5f5f5] flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
                        {/* Fake Scan Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#FB7299]/50 shadow-[0_0_10px_#FB7299] animate-[scan_2s_ease-in-out_infinite]"></div>
                        <FaQrcode className="text-7xl text-[#00427A]" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mb-8">
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Amount to Pay</span>
                      <span className="text-4xl font-black text-[#FB7299] tracking-tighter">฿{selectedPkg?.price}.00</span>
                    </div>

                    <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 text-left mb-8 flex items-center justify-between group cursor-pointer hover:bg-[#222] transition-colors">
                      <div>
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Receiver (Admin)</p>
                        <p className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-2">
                          นาย โจชัวร์ มาเยอะ <FaCheckCircle className="text-[#00A1D6] text-[10px]" />
                        </p>
                      </div>
                      <FaCopy className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>

                    <button 
                      onClick={handleVerifyPayment} 
                      disabled={paymentStatus === 'CHECKING'}
                      className="w-full py-4 bg-gradient-to-r from-[#FB7299] to-[#FF4D80] text-white font-black rounded-2xl shadow-lg shadow-[#FB7299]/20 text-xs uppercase hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {paymentStatus === 'CHECKING' ? 'Processing...' : 'Confirm Transfer'}
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* CSS Animation for Scan Line */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}