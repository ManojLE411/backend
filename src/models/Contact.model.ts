/**
 * Contact Model
 * Mongoose schema for contact messages
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  mobile?: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Replied'],
      default: 'New',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes
ContactSchema.index({ status: 1, date: -1 });
ContactSchema.index({ email: 1 });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);

