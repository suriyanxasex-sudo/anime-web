/**
 * JPLUS_POSTCSS_CONFIGURATION v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ปรับแต่งและเพิ่มประสิทธิภาพการประมวลผล CSS สำหรับ Modern Browsers
 */

module.exports = {
  plugins: {
    // 1. รองรับการใช้ @import ในไฟล์ CSS (ทำให้แยกไฟล์สไตล์ได้เป็นระเบียบ)
    'postcss-import': {},

    // 2. เปิดระบบ Nesting: ทำให้เขียน CSS แบบซ้อนกันได้เหมือน SASS/SCSS
    'tailwindcss/nesting': {},

    // 3. Tailwind CSS Core: หัวใจหลักของความสวยงามใน Jplus
    tailwindcss: {},

    // 4. Autoprefixer: ใส่ Prefix ให้ CSS อัตโนมัติ (เช่น -webkit-) เพื่อให้เปิดได้ทุก Browser
    autoprefixer: {
      flexbox: 'no-2009',
    },

    // 5. รีดไฟล์ CSS ให้เล็กลงเวลา Deploy ขึ้น Production (ถ้าอยู่ในโหมดสร้างจริง)
    ...(process.env.NODE_ENV === 'production' ? { cssnano: { preset: 'default' } } : {}),
  },
}