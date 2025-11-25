/**
 * User Service
 * Business logic for user management (Admin only)
 */

import { User, IUser } from '../models/User.model';
import { NotFoundError } from '../utils/errors';
import { parsePagination, createPaginatedResponse } from '../utils/pagination';
import logger from '../utils/logger';

class UserService {
  async getAll(query: { page?: string; pageSize?: string }) {
    const { page, pageSize } = parsePagination(query);
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean() as any,
      User.countDocuments(),
    ]);

    return createPaginatedResponse(users, total, page, pageSize);
  }

  async getById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async update(id: string, updates: Partial<IUser>): Promise<IUser> {
    // Don't allow role or password updates via this endpoint
    const { role, password, ...safeUpdates } = updates as any;

    const user = await User.findByIdAndUpdate(id, safeUpdates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    logger.info(`User updated: ${user.email}`);
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    logger.info(`User deleted: ${user.email}`);
  }
}

export default new UserService();

