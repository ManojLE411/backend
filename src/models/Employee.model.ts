/**
 * Employee Model
 * Mongoose schema for employees
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  role: string;
  summary: string;
  skills: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
    },
    skills: {
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

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

