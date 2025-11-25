/**
 * Blog Service
 * Business logic for blog operations
 */

import { Blog, IBlog } from '../models/Blog.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidObjectId } from '../utils/helpers';
import { parsePagination, createPaginatedResponse } from '../utils/pagination';
import logger from '../utils/logger';

class BlogService {
  /**
   * Get all blog posts with pagination
   */
  async getAll(query: { page?: string; pageSize?: string; category?: string; search?: string }) {
    const { page, pageSize } = parsePagination(query);
    const skip = (page - 1) * pageSize;

    // Build filter
    const filter: any = {};
    if (query.category) {
      filter.category = query.category;
    }
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const [posts, total] = await Promise.all([
      Blog.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean() as any,
      Blog.countDocuments(filter),
    ]);

    // Transform _id to id for lean documents (toJSON transform doesn't apply to lean())
    const transformedPosts = posts.map((post: any) => ({
      ...post,
      id: post._id.toString(),
      date: post.date ? new Date(post.date).toISOString().split('T')[0] : post.date,
      _id: undefined,
      __v: undefined,
    }));

    return createPaginatedResponse(transformedPosts, total, page, pageSize);
  }

  /**
   * Get blog post by ID
   */
  async getById(id: string): Promise<IBlog> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid blog post ID format');
    }
    const post = await Blog.findById(id);

    if (!post) {
      throw new NotFoundError('Blog post');
    }

    return post;
  }

  /**
   * Create blog post
   */
  async create(data: Partial<IBlog>): Promise<IBlog> {
    const post = new Blog(data);
    await post.save();

    logger.info(`Blog post created: ${post.title}`);
    return post;
  }

  /**
   * Update blog post
   */
  async update(id: string, data: Partial<IBlog>): Promise<IBlog> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid blog post ID format');
    }
    const post = await Blog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      throw new NotFoundError('Blog post');
    }

    logger.info(`Blog post updated: ${post.title}`);
    return post;
  }

  /**
   * Delete blog post
   */
  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid blog post ID format');
    }
    const post = await Blog.findByIdAndDelete(id);

    if (!post) {
      throw new NotFoundError('Blog post');
    }

    logger.info(`Blog post deleted: ${post.title}`);
  }
}

export default new BlogService();

