import mongoose from 'mongoose';

/**
 * JPLUS_USER_SCHEMA v3.0
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * สถานะ: UPGRADED - Secure Defaults & Expanded Profile
 */

const UserSchema = new mongoose.Schema({
  // 1. Identity (ระบุตัวตน)
  username: { 
    type: String, 
    required: [true, 'Please provide a username'], 
    unique: true,
    trim: true,
    maxlength: [20, 'Username cannot be more than 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
      'Please add a valid email'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Please provide a password'],
    select: false // ซ่อนรหัสผ่านเวลาดึงข้อมูล (Security)
  },
  profilePic: {
    type: String,
    default: '' // ให้ว่างไว้ เดี๋ยว Frontend ไปใส่รูป Default ให้เอง
  },

  // 2. Status & Roles (สถานะและบทบาท)
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' // ⚡️ แก้แล้ว! สมัครใหม่ต้องเป็นแค่ User ธรรมดาก่อน
  },
  isPremium: { 
    type: Boolean, 
    default: false 
  },
  
  // 3. Economy (ระบบเศรษฐกิจ)
  points: { 
    type: Number, 
    default: 0 // ⚡️ แก้แล้ว! เริ่มต้นที่ 0 แต้ม (อยากได้ต้องเติม)
  },
  
  // 4. History (ประวัติการใช้งาน)
  readingHistory: [{ 
    mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
    lastChapter: Number,
    readAt: { type: Date, default: Date.now }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ป้องกันการ Compile โมเดลซ้ำเวลา Hot Reload
export default mongoose.models.User || mongoose.model('User', UserSchema);