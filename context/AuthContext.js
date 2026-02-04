import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext();

/**
 * JPLUS_AUTH_CORE v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * สถานะ: UPGRADED - Real-time Sync & Security Hardening
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. [BOOT_PROTOCOL] - เริ่มระบบและตรวจสอบความถูกต้องกับ Server
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('JPLUS_IDENTITY');
      
      if (storedUser) {
        try {
          // A. โหลดข้อมูลเก่ามาโชว์ก่อน (เพื่อให้เว็บมาเร็ว ไม่ต้องรอ)
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // B. [SILENT_SYNC] - แอบวิ่งไปเช็คข้อมูลล่าสุดจาก Server (เช็คแต้ม/สถานะ VIP)
          // ถ้า API ยังไม่พร้อม มันจะข้ามขั้นตอนนี้ไปเอง (ไม่ Error)
          try {
            const res = await axios.get('/api/user/profile');
            if (res.data) {
              console.log(`[AUTH_SYNC] Data updated for: ${res.data.username}`);
              setUser(res.data);
              localStorage.setItem('JPLUS_IDENTITY', JSON.stringify(res.data));
            }
          } catch (serverError) {
            // ถ้า Server ตอบกลับว่า Token หมดอายุ (401) ให้เตะออกทันที
            if (serverError.response && serverError.response.status === 401) {
              console.warn("[AUTH_ALERT] Session Expired. Logging out...");
              logout();
              return;
            }
            console.log("[AUTH_NOTE] Offline mode or Server unreachable, using local data.");
          }

        } catch (error) {
          console.error("[AUTH_CRASH] Local data corrupted.");
          localStorage.removeItem('JPLUS_IDENTITY');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // 2. [LOGIN_PROTOCOL] - เข้าระบบ
  const login = (userData) => {
    console.log(`[ACCESS_GRANTED] Welcome, ${userData.username}`);
    setUser(userData);
    localStorage.setItem('JPLUS_IDENTITY', JSON.stringify(userData));
    // router.push('/'); // (ให้หน้า Login เป็นคนสั่งย้ายเองจะยืดหยุ่นกว่า)
  };

  // 3. [LOGOUT_PROTOCOL] - ออกจากระบบ
  const logout = () => {
    console.warn(`[SESSION_TERMINATED] User logged out.`);
    setUser(null);
    localStorage.removeItem('JPLUS_IDENTITY');
    router.replace('/login');
  };

  // 4. [REFRESH_PROTOCOL] - ฟังก์ชันพิเศษ! เอาไว้เรียกตอนเติมเงินเสร็จ
  const refreshProfile = async () => {
    try {
      const res = await axios.get('/api/user/profile');
      if (res.data) {
        setUser(res.data);
        localStorage.setItem('JPLUS_IDENTITY', JSON.stringify(res.data));
        console.log("[DATA_REFRESHED] User profile synced.");
      }
    } catch (err) {
      console.error("Failed to refresh profile");
    }
  };

  // Helper Variables
  const isAdmin = user?.isAdmin || user?.role === 'admin';
  const isPremium = user?.isPremium || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      refreshProfile, // ส่งตัวนี้ออกไปให้ Shop ใช้
      loading, 
      isAdmin,
      isPremium 
    }}>
      {/* Loading Screen แบบ God Mode */}
      {!loading ? children : (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FB7299]/20 rounded-full blur-[100px] animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#333] border-t-[#FB7299] border-r-[#FB7299] rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(251,114,153,0.3)]"></div>
            <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase animate-pulse">
              J<span className="text-[#FB7299]">plus</span>_System
            </h2>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] mt-2 uppercase">Authenticating...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};