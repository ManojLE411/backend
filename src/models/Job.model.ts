/**
 * Job Model
 * Mongoose schema for job listings
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  location: 'Remote' | 'On-site' | 'Hybrid';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract'],
      required: [true, 'Job type is required'],
    },
    location: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      required: [true, 'Location is required'],
    },
    description: {
      type: String,
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

export const Job = mongoose.model<IJob>('Job', JobSchema);

