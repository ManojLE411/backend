/**
 * Authentication Service
 * Business logic for authentication operations
 */

import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User.model';
import { NotFoundError, UnauthorizedError, ConflictError, ValidationError } from '../utils/errors';
import jwtConfig, { JWTPayload } from '../config/jwt';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';
import { isAdminEmail } from '../utils/helpers';
import logger from '../utils/logger';

class AuthService {
  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password
   */
  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Student login
   */
  async studentLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is admin trying to login via student endpoint
    if (user.role === 'admin') {
      throw new UnauthorizedError('Admin accounts must use admin login endpoint');
    }

    const isPasswordValid = await this.comparePassword(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokenPair = jwtConfig.generateTokenPair(payload);

    const userObj = user.toJSON() as any;

    return {
      user: userObj,
      token: {
        accessToken: tokenPair.accessToken,
        expiresAt: tokenPair.expiresAt,
      },
    };
  }

  /**
   * Admin login
   */
  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is student trying to login via admin endpoint
    if (user.role === 'student') {
      throw new UnauthorizedError('Student accounts must use student login endpoint');
    }

    const isPasswordValid = await this.comparePassword(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokenPair = jwtConfig.generateTokenPair(payload);

    const userObj = user.toJSON() as any;

    return {
      user: userObj,
      token: {
        accessToken: tokenPair.accessToken,
        expiresAt: tokenPair.expiresAt,
      },
    };
  }

  /**
   * Student registration
   */
  async studentRegister(data: RegisterData): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Prevent admin email registration via student endpoint
    if (isAdminEmail(data.email)) {
      throw new ValidationError('Admin emails cannot be registered via student endpoint');
    }

    const hashedPassword = await this.hashPassword(data.password);

    const user = new User({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      phone: data.phone,
      role: 'student',
      enrolledPrograms: [],
    });

    await user.save();

    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokenPair = jwtConfig.generateTokenPair(payload);

    const userObj = user.toJSON() as any;

    logger.info(`New student registered: ${user.email}`);

    return {
      user: userObj,
      token: {
        accessToken: tokenPair.accessToken,
        expiresAt: tokenPair.expiresAt,
      },
    };
  }

  /**
   * Admin registration
   * Only allowed if no admin exists or by existing admin
   */
  async adminRegister(data: RegisterData, existingAdminId?: string): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // If no existing admin ID provided, check if any admin exists
    if (!existingAdminId) {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount > 0) {
        throw new UnauthorizedError('Admin registration requires existing admin authorization');
      }
    } else {
      // Verify the existing admin exists
      const existingAdmin = await User.findById(existingAdminId);
      if (!existingAdmin || existingAdmin.role !== 'admin') {
        throw new UnauthorizedError('Invalid admin authorization');
      }
    }

    const hashedPassword = await this.hashPassword(data.password);

    const user = new User({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      phone: data.phone,
      role: 'admin',
      enrolledPrograms: [],
    });

    await user.save();

    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokenPair = jwtConfig.generateTokenPair(payload);

    const userObj = user.toJSON() as any;

    logger.info(`New admin registered: ${user.email}`);

    return {
      user: userObj,
      token: {
        accessToken: tokenPair.accessToken,
        expiresAt: tokenPair.expiresAt,
      },
    };
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<IUser>): Promise<IUser> {
    // Don't allow role or password updates via this endpoint
    const { role, password, ...safeUpdates } = updates as any;

    const user = await User.findByIdAndUpdate(userId, safeUpdates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  /**
   * Refresh token
   */
  async refreshToken(userId: string): Promise<{ token: string; expiresAt: number }> {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokenPair = jwtConfig.generateTokenPair(payload);

    return {
      token: tokenPair.accessToken,
      expiresAt: tokenPair.expiresAt,
    };
  }
}

export default new AuthService();

