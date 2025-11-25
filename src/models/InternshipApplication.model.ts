/**
 * Internship Application Model
 * Mongoose schema for internship applications
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IInternshipApplication extends Document {
  internshipId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  course: string; // Track title
  resumeName: string;
  resumePath: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipApplicationSchema = new Schema<IInternshipApplication>(
  {
    internshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Internship',
      required: [true, 'Internship ID is required'],
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    course: {
      type: String,
      required: [true, 'Course is required'],
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
    message: {
      type: String,
      required: [true, 'Message is required'],
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
        if (ret.internshipId) {
          result.internshipId = ret.internshipId.toString();
        }
        if (ret.studentId) {
          result.studentId = ret.studentId.toString();
        }
        delete result._id;
        delete result.__v;
        return result;
      },
    },
  }
);

// Indexes
InternshipApplicationSchema.index({ internshipId: 1, status: 1 });
InternshipApplicationSchema.index({ email: 1 });
InternshipApplicationSchema.index({ date: -1 });

export const InternshipApplication = mongoose.model<IInternshipApplication>(
  'InternshipApplication',
  InternshipApplicationSchema
);

