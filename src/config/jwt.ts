/**
 * JWT Configuration
 * JWT token generation and verification utilities
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import env from './env';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'admin';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class JWTConfig {
  private readonly secret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.secret = env.JWT_SECRET;
    this.accessTokenExpiry = env.JWT_EXPIRES_IN;
    this.refreshTokenExpiry = env.JWT_REFRESH_EXPIRES_IN;
  }

  /**
   * Generate access token
   */
  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.accessTokenExpiry,
    } as SignOptions);
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.refreshTokenExpiry,
    } as SignOptions);
  }

  /**
   * Generate token pair
   */
  generateTokenPair(payload: JWTPayload): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Calculate expiration time
    const decoded = jwt.decode(accessToken) as { exp: number } | null;
    const expiresAt = decoded ? decoded.exp * 1000 : Date.now() + 15 * 60 * 1000; // 15 minutes default

    return {
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

  /**
   * Verify token
   */
  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  /**
   * Decode token without verification (for inspection)
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload | null;
    } catch {
      return null;
    }
  }
}

export default new JWTConfig();

