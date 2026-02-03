/** @type {import('tailwindcss').Config} */

/**
 * JPLUS_DESIGN_SYSTEM v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: กำหนดอัตลักษณ์ทางสายตา (Visual Identity) และเอฟเฟกต์พิเศษของระบบ
 */

module.exports = {
  // 1. ระบุพิกัดไฟล์ทั้งหมดที่ใช้ Tailwind
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layout/**/*.{js,ts,jsx,tsx}", // เพิ่มเผื่อลูกพี่แยกโฟลเดอร์ Layout
  ],
  
  theme: {
    extend: {
      // 🎨 [COLORS] อัปเกรดชุดสี Jplus ให้ดุดันกว่าเดิม
      colors: {
        jplus: {
          pink: '#FB7299',
          pinkHover: '#FF5D87',
          blue: '#00A1D6',
          cyan: '#00FBFF',
          dark: '#0a0a0a',      // สีดำลึกสำหรับพื้นหลังหลัก
          card: '#121212',      // สีดำเทาสำหรับ Card มังงะ
          border: '#1f1f1f',    // สีขอบสำหรับ UI
        }
      },

      // ✨ [GLOW_EFFECTS] ระบบแสงฟุ้ง Cyberpunk
      boxShadow: {
        'pink-glow': '0 0 20px rgba(251, 114, 153, 0.3)',
        'blue-glow': '0 0 20px rgba(0, 161, 214, 0.3)',
        'neon': '0 0 5px rgba(251, 114, 153, 0.5), 0 0 20px rgba(251, 114, 153, 0.2)',
      },

      // 🎬 [ANIMATIONS] ระบบการเคลื่อนไหวอัจฉริยะ
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s infinite ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },

  // 🛠️ [PLUGINS] เสริมพลังด้วย Line Clamp สำหรับตัดตัวอักษรที่ยาวเกินไป
  plugins: [
    require('@tailwindcss/typography'),
  ],
}