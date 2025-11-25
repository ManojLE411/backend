/**
 * General Helper Utilities
 */

import mongoose from 'mongoose';

/**
 * Validate MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.\./g, '');
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if email is admin email
 */
export function isAdminEmail(email: string): boolean {
  const adminDomains = ['@imtda.com', '@admin.imtda.com'];
  return adminDomains.some((domain) => email.toLowerCase().endsWith(domain));
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
}

/**
 * Remove sensitive fields from object
 */
export function removeSensitiveFields<T extends Record<string, any>>(
  obj: T,
  fields: string[]
): Omit<T, keyof T> {
  const result = { ...obj };
  fields.forEach((field) => {
    delete result[field];
  });
  return result;
}

