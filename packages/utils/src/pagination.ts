export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPaginationParams(
  query: { page?: number; limit?: number },
  defaultLimit: number = 12,
): PaginationParams {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function getPaginationMeta(
  total: number,
  page: number,
  limit: number,
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function getSortOptions(sort?: string): Record<string, 1 | -1> {
  switch (sort) {
    case 'price-asc':
      return { price: 1 as const };
    case 'price-desc':
      return { price: -1 as const };
    case 'rating':
      return { averageRating: -1 as const };
    case 'newest':
      return { createdAt: -1 as const };
    case 'bestseller':
      return { totalSold: -1 as const };
    case 'trending':
      return { viewCount: -1 as const };
    default:
      return { createdAt: -1 as const };
  }
}
