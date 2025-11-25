/**
 * Pagination Utilities
 * Helper functions for pagination
 */

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Parse pagination query parameters
 */
export function parsePagination(query: {
  page?: string;
  pageSize?: string;
}): PaginationOptions {
  const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(query.pageSize || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );

  return { page, pageSize };
}

/**
 * Calculate skip value for MongoDB queries
 */
export function calculateSkip(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Calculate total pages
 */
export function calculateTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginationResult<T> {
  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: calculateTotalPages(total, pageSize),
    },
  };
}

