/**
 * Service Model
 * Mongoose schema for services
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  features: string[];
  icon: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
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
      required: [true, 'Icon is required'],
      trim: true,
    },
    image: {
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

export const Service = mongoose.model<IService>('Service', ServiceSchema);

