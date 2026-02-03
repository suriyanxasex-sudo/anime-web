import mongoose from 'mongoose';

/**
 * JPLUS_DATABASE_CONNECTOR v2.5
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * วัตถุประสงค์: ระบบ Singleton Connection เพื่อรีดประสิทธิภาพสูงสุดบน Serverless Environment
 */

const MONGODB_URI = process.env.MONGODB_URI;

// ตรวจสอบความปลอดภัยของกุญแจฐานข้อมูล
if (!MONGODB_URI) {
  throw new Error(
    'CRITICAL_CONFIG_ERROR: กรุณาตั้งค่า MONGODB_URI ใน Vercel Environment Variables ให้ถูกต้อง (ตรวจสอบ /animeDB หลัง .net)'
  );
}

/**
 * ในระบบ Serverless ของ Vercel ตัวแปร Global จะถูกเก็บไว้ข้ามการเรียกใช้ (Execution)
 * เพื่อป้องกันการสร้าง Connection ซ้ำซ้อนจนฐานข้อมูลระเบิด
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const startTime = Date.now();

  // 1. ถ้ามีการเชื่อมต่อค้างไว้อยู่แล้ว (Cached) ให้ดึงออกมาใช้ทันที
  if (cached.conn) {
    return cached.conn;
  }

  // 2. ถ้ายังไม่มีการเชื่อมต่อ ให้สร้าง Promise เพื่อทำการเชื่อมต่อใหม่
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,       // จำกัดจำนวน Connection Pool เพื่อไม่ให้กินทรัพยากรเกินไป
      serverSelectionTimeoutMS: 5000, // ถ้าหา Server ไม่เจอใน 5 วินาที ให้ตัดการทำงาน
      socketTimeoutMS: 45000,         // ป้องกันการค้างของ Socket
      family: 4,                      // บังคับใช้ IPv4 เพื่อความเสถียรบน Cloud
    };

    console.log('[SYSTEM_CORE] Initiating new connection to MongoDB Cluster...');

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      const latency = Date.now() - startTime;
      console.log(`--- ✅ JPLUS_SYSTEM: CONNECTED_TO_MONGODB (${latency}ms) ---`);
      return mongooseInstance;
    }).catch((err) => {
      console.error('--- ❌ JPLUS_SYSTEM: CONNECTION_FAILED ---');
      console.error(`ERROR_DETAILS: ${err.message}`);
      cached.promise = null; // Reset promise เพื่อให้ลองใหม่ในการเรียกครั้งหน้า
      throw err;
    });
  }

  try {
    // รอจนกว่าการเชื่อมต่อจะสำเร็จ
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;