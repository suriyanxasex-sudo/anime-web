import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('กรุณาตั้งค่า MONGODB_URI ใน Vercel Environment Variables ให้ถูกต้อง (อย่าลืมเติม /jplus หลัง .net)');
}

/** * ระบบ Cached Connection เพื่อป้องกันฐานข้อมูลล่มจากการเชื่อมต่อบ่อยเกินไป
 * เหมาะสำหรับการรันแอปบน Vercel (Serverless) 
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('--- 🛡️ JPLUS_SYSTEM: CONNECTED_TO_MONGODB ---');
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;