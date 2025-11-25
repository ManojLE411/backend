/**
 * User Model
 * Mongoose schema for users (students and admins)
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'student' | 'admin';
  enrolledPrograms: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    enrolledPrograms: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as any).password;
        ret.id = ret._id.toString();
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes
// Note: email index is automatically created by unique: true
UserSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);

