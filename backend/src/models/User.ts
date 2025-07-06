import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  theme: string; // NEW: Store user's preferred theme
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  theme: {
    type: String,
    default: 'cyberpunk',
    enum: [
      "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
      "synthwave", "retro", "cyberpunk", "valentine", "halloween", 
      "garden", "forest", "aqua", "lofi", "pastel", "fantasy", 
      "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
      "business", "acid", "lemonade", "night", "coffee", "winter", "dim"
    ]
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);