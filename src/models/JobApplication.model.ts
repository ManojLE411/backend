/**
 * Job Application Model
 * Mongoose schema for job applications
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  jobTitle: string; // Denormalized for quick access
  name: string;
  email: string;
  phone: string;
  resumeName: string;
  resumePath: string;
  coverLetter?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
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
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    resumeName: {
      type: String,
      required: [true, 'Resume name is required'],
    },
    resumePath: {
      type: String,
      required: [true, 'Resume path is required'],
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
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
        const result = ret as any;
        result.id = ret._id.toString();
        if (ret.jobId) {
          result.jobId = ret.jobId.toString();
        }
        if (ret.userId) {
          result.userId = ret.userId.toString();
        }
        delete result._id;
        delete result.__v;
        return result;
      },
    },
  }
);

// Indexes
JobApplicationSchema.index({ jobId: 1, status: 1 });
JobApplicationSchema.index({ email: 1 });
JobApplicationSchema.index({ date: -1 });

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);

