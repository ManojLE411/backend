/**
 * Internship Model
 * Mongoose schema for internship tracks
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IInternship extends Document {
  title: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  skills: string[];
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSchema = new Schema<IInternship>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      required: [true, 'Mode is required'],
    },
    skills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
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

export const Internship = mongoose.model<IInternship>('Internship', InternshipSchema);

