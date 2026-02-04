import mongoose from 'mongoose';

/**
 * JPLUS_USER_SCHEMA v3.5 (GOD MODE)
 * พัฒนาโดย: JOSHUA_MAYOE (Admin Overlord)
 * สถานะ: FINAL - รองรับ Admin, Premium, Favorites และระบบซื้อตอนครบวงจร
 */

const UserSchema = new mongoose.Schema({
  // 1. Identity (ระบุตัวตน)
  username: { 
    type: String, 
    required: [true, 'Please provide a username'], 
    unique: true,
    trim: true,
    lowercase: true, // ✅ บังคับตัวเล็กหมด กันปัญหา Login ไม่เจอ
    maxlength: [20, 'Username cannot be more than 20 characters']
  },
  email: {
    type: String,
    // required: true, <--- (แนะนำให้เปิด ถ้าจะเอาจริง)
    unique: true,
    sparse: true, // อนุญาตให้ null ซ้ำกันได้ (สำหรับ ID เก่าที่ไม่มีเมล)
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
      'Please add a valid email'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Please provide a password'],
    // select: false // ⚠️ ปิดไว้ก่อนดีกว่าครับ เดี๋ยว Script แก้ Admin จะหา Password ไม่เจอ
  },
  profilePic: {
    type: String,
    default: '' 
  },

  // 2. Status & Roles (สถานะและบทบาท)
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  // ✅ เพิ่มตัวนี้ครับ: เช็คง่ายกว่า role เยอะ (ใช้ใน API Create Manga)
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  isPremium: { 
    type: Boolean, 
    default: false 
  },
  
  // 3. Economy (ระบบเศรษฐกิจ)
  points: { 
    type: Number, 
    default: 0 
  },
  
  // 4. Collections (คลังส่วนตัว) - ⚠️ ต้องมี ไม่งั้นหน้าเว็บพัง!
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Manga' 
  }],
  unlockedContent: [{ 
    type: mongoose.Schema.Types.ObjectId 
    // เก็บ ID ของ Chapter ที่ซื้อแล้ว
  }],

  // 5. History & Meta
  metadata: {
    lastLogin: Date,
    accountCreated: { type: Date, default: Date.now }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ป้องกันการ Compile โมเดลซ้ำเวลา Hot Reload
export default mongoose.models.User || mongoose.model('User', UserSchema);