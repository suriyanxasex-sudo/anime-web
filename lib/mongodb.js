import mongoose from 'mongoose';

/**
 * JPLUS_DATABASE_CORE v3.0 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * สถานะ: UPGRADED - Robust Connection & Enhanced Logging
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ FATAL ERROR: Please define the MONGODB_URI environment variable in .env');
}

/**
 * Global Cache (ป้องกันการสร้าง Connection ซ้ำซ้อนใน Serverless)
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // 1. ถ้ามี Connection อยู่แล้ว ให้ใช้ของเดิม (เร็วแรงทะลุนรก)
  if (cached.conn) {
    return cached.conn;
  }

  // 2. ถ้ายังไม่มี ให้เริ่มเชื่อมต่อใหม่
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // จำกัดจำนวนท่อส่งข้อมูล (กัน Database ล่ม)
      serverSelectionTimeoutMS: 5000, // ถ้าต่อไม่ได้ภายใน 5 วิ ให้ตัดจบ
      socketTimeoutMS: 45000, // กันท่อค้าง
    };

    // ตั้งค่า Mongoose ให้เข้มงวด (กันข้อมูลขยะ)
    mongoose.set('strictQuery', true);

    console.log("⚡ [DB_CORE] Initializing connection to MongoDB Atlas...");

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ [DB_CORE] CONNECTION ESTABLISHED: Ready for JPLUS Systems.");
      return mongoose;
    }).catch((err) => {
      console.error("🔥 [DB_CRASH] Connection Failed:", err.message);
      throw err;
    });
  }

  // 3. รอให้การเชื่อมต่อเสร็จสมบูรณ์
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;