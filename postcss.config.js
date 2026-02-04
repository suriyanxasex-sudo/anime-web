/**
 * JPLUS_POSTCSS_CONFIGURATION v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE
 * สถานะ: ACTIVE & OPTIMIZED
 */

module.exports = {
  plugins: {
    // 1. รวมไฟล์ @import
    'postcss-import': {},

    // 2. รองรับ Nesting (เขียน CSS ซ้อนกันได้)
    'tailwindcss/nesting': {},

    // 3. เรียกเทพเจ้า Tailwind
    tailwindcss: {},

    // 4. รองรับ Browser เก่าๆ
    autoprefixer: {
      flexbox: 'no-2009',
    },

    // 5. [PROD_ONLY] บีบไฟล์ให้เล็กจิ๋วเมื่อขึ้น Server จริง
    ...(process.env.NODE_ENV === 'production' ? { cssnano: { preset: 'default' } } : {}),
  },
}