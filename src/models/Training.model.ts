/**
 * Training Model
 * Mongoose schema for training programs
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface ITraining extends Document {
  title: string;
  category: 'Institutional' | 'Corporate' | 'Other';
  description: string;
  features: string[];
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingSchema = new Schema<ITraining>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Institutional', 'Corporate', 'Other'],
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
      trim: true,
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

export const Training = mongoose.model<ITraining>('Training', TrainingSchema);

