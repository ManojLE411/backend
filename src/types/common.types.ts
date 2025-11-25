/**
 * Common Type Definitions
 * Shared types across the application
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type UserRole = 'student' | 'admin';

export interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
}

