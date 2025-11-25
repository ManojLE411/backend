/**
 * Project Model
 * Mongoose schema for projects
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  category: 'AI/ML' | 'Web' | 'VLSI' | 'IoT' | 'Data Science';
  description: string;
  techStack: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['AI/ML', 'Web', 'VLSI', 'IoT', 'Data Science'],
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    techStack: {
      type: [String],
      default: [],
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

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

