/**
 * Authentication Type Definitions
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'student' | 'admin';
    enrolledPrograms?: string[];
    createdAt?: string;
    updatedAt?: string;
  };
  token: {
    accessToken: string;
    expiresAt: number;
  };
}

