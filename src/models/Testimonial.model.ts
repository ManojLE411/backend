/**
 * Testimonial Model
 * Mongoose schema for testimonials
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  title: string;
  quote: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    quote: {
      type: String,
      required: [true, 'Quote is required'],
    },
    avatar: {
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

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

