import mongoose, { Document, Schema, Model } from 'mongoose';
import dbConnect from '@/lib/mongoose';
import bcrypt from 'bcryptjs';
import { DefaultSession } from 'next-auth';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerified?: Date | null;
  image?: string | null;
  role?: 'user' | 'admin';
  accounts: mongoose.Types.ObjectId[];
  sessions: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    emailVerified: { type: Date },
    image: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        if ('password' in ret) {
          const { password, ...rest } = ret;
          return rest;
        }
        return ret;
      }
    }
  }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create a function to get the User model
let User: Model<IUser>;

// Check if the model exists before creating it
if (mongoose.models.User) {
  User = mongoose.models.User as Model<IUser>;
} else {
  // Ensure we're connected to the database
  dbConnect().catch(err => console.error('Failed to connect to database', err));
  User = mongoose.model<IUser>('User', UserSchema);
}

export default User;
