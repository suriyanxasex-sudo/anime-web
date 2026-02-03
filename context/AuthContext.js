import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext();

/**
 * JPLUS_AUTH_PROVIDER v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ควบคุมสถานะการเข้าถึง (Global State) และการรักษาสิทธิ์ของผู้ใช้งาน
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. [BOOT_PROTOCOL] - ตรวจสอบสถานะการเข้าสู่ระบบเมื่อเริ่มต้น
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('JPLUS_IDENTITY');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // ตัวเลือกเสริม: ลูกพี่สามารถเรียก API ไปเช็คที่ Server อีกรอบได้ที่นี่
          // เพื่อความปลอดภัยกรณีโดนแบนหรือสิทธิ์เปลี่ยน (Admin/Premium)
          setUser(parsedUser);
          console.log(`[AUTH_CORE] Identity_Established: ${parsedUser.username}`);
        }
      } catch (error) {
        console.error("[AUTH_CORE] Sync_Error: Invalid identity format.");
        localStorage.removeItem('JPLUS_IDENTITY');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 2. [LOGIN_PROTOCOL] - บันทึกอัตลักษณ์ใหม่ลงในระบบ
  const login = (userData) => {
    console.log(`[AUTH_CORE] Granting access to: ${userData.username}`);
    const secureData = {
      ...userData,
      lastSession: new Date().getTime()
    };
    setUser(secureData);
    localStorage.setItem('JPLUS_IDENTITY', JSON.stringify(secureData));
  };

  // 3. [LOGOUT_PROTOCOL] - ทำลาย Session และล้างข้อมูลทั้งหมด
  const logout = () => {
    console.warn(`[AUTH_CORE] Terminating session for user.`);
    setUser(null);
    localStorage.removeItem('JPLUS_IDENTITY');
    
    // ดีดกลับหน้า Login พร้อมล้าง History เพื่อความปลอดภัย
    router.replace('/login'); 
  };

  // 4. [ADMIN_SHIELD] - ฟังก์ชันช่วยเช็คสิทธิ์แอดมิน (Helper)
  const isAdmin = user?.isAdmin || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAdmin,
      isPremium: user?.isPremium 
    }}>
      {/* ป้องกันหน้ากระตุกเวลาโหลดข้อมูล (Hydration) */}
      {!loading ? children : (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
           <div className="w-10 h-10 border-4 border-[#FB7299] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Hook สำหรับเรียกใช้งานในหน้าต่างๆ
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};