/**
 * Blog Model
 * Mongoose schema for blog posts
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: Date;
  category: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
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
        // Convert date to ISO string format
        if (ret.date) {
          (ret as any).date = new Date(ret.date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes
BlogSchema.index({ category: 1 });
BlogSchema.index({ date: -1 });
BlogSchema.index({ title: 'text', content: 'text' }); // Text search

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

