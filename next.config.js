/** @type {import('next').NextConfig} */

/**
 * JPLUS_CORE_CONFIGURATION v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * สถานะ: UPGRADED - API CORS Ready & Enhanced Security
 */

const nextConfig = {
  reactStrictMode: true, 
  swcMinify: true,       

  // 🖼️ IMAGE_OPTIMIZATION_ENGINE
  images: {
    // เปิดรับรูปภาพจากทุกทิศทั่วโลก (Universal Image Gateway)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    // อนุญาตให้ใช้ SVG (บางเว็บใช้เป็น Icon)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // ขนาดรูปที่รองรับ (Optimization Presets)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 🛡️ SECURITY_SHIELD_PROTOCOL
  async headers() {
    return [
      {
        // 1. กฏเหล็กสำหรับหน้าเว็บทั่วไป
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' }, // ⚡️ ช่วยให้โหลดรูปจากเว็บนอกไวขึ้น
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' } // บังคับ HTTPS
        ],
      },
      {
        // 2. 🔓 API GATEWAY (เปิดท่อให้แอปอื่นเรียกใช้ข้อมูลได้)
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // หรือใส่โดเมนเฉพาะถ้าต้องการจำกัด
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ];
  },

  // 🚀 SERVER_OPTIMIZATION
  poweredByHeader: false, // นินจาโหมด: ซ่อนว่าเราใช้ Next.js
  compress: true,         // บีบอัดไฟล์ให้เล็กจิ๋ว โหลดปรู๊ดปร๊าด
}

module.exports = nextConfig;