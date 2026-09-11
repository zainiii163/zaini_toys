import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Brand } from '../models/Brand';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta, escapeRegExp } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';
import { SearchHistory } from '../models/SearchHistory';

// @desc    Search products
// @route   GET /api/v1/search?q=...
export const searchProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const q = (req.query.q as string) || '';
  const { page, limit, skip } = getPaginationParams(req.query);

  if (!q.trim()) {
    throw new AppError('Search query is required', 400);
  }

  const filter: any = { isActive: true };

  // Text search across name, description, tags
  filter.$text = { $search: q, $caseSensitive: false };

  // Additional filters
  const { category, brand, minPrice, maxPrice, ageMin, ageMax, rating, sort } = req.query;

  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice && { $gte: Number(minPrice) }),
      ...(maxPrice && { $lte: Number(maxPrice) }),
    };
  }
  if (ageMin || ageMax) {
    filter['ageRange.min'] = { $lte: Number(ageMax) || 99 };
    filter['ageRange.max'] = { $gte: Number(ageMin) || 0 };
  }
  if (rating) filter.averageRating = { $gte: Number(rating) };

  const sortMap: Record<string, any> = {
    relevance: { score: { $meta: 'textScore' } },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { averageRating: -1 },
    newest: { createdAt: -1 },
    bestseller: { totalSold: -1 },
  };

  const sortBy = sortMap[sort as string] || sortMap.relevance;

  const [results, total] = await Promise.all([
    Product.find(filter)
      .populate('brand', 'name slug')
      .populate('category', 'name slug')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  // Record search history (if logged in)
  if (req.user) {
    await SearchHistory.findOneAndUpdate(
      { user: req.user._id, query: q },
      { $set: { user: req.user._id, query: q }, $inc: { count: 1 } },
      { upsert: true, new: true },
    ).catch(() => {});
  }

  res.status(200).json({
    success: true,
    data: results,
    pagination: getPaginationMeta(total, page, limit),
    query: q,
  });
});

// @desc    Search suggestions
// @route   GET /api/v1/search/suggestions?q=...
export const getSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const q = (req.query.q as string) || '';

  if (!q.trim()) {
    return res.status(200).json({ success: true, data: { products: [], categories: [], brands: [] } });
  }

  const [products, categories, brands] = await Promise.all([
    Product.find({ isActive: true, $text: { $search: q } })
      .select('name slug price salePrice images averageRating')
      .sort({ score: { $meta: 'textScore' } })
      .limit(6)
      .lean(),
    Category.find({ isActive: true, name: { $regex: escapeRegExp(String(q)), $options: 'i' } })
      .select('name slug image')
      .limit(4)
      .lean(),
    Brand.find({ isActive: true, name: { $regex: escapeRegExp(String(q)), $options: 'i' } })
      .select('name slug logo')
      .limit(3)
      .lean(),
  ]);

  res.status(200).json({
    success: true,
    data: { products, categories, brands },
  });
});

// @desc    Popular searches
// @route   GET /api/v1/search/popular
export const getPopularSearches = asyncHandler(async (req: Request, res: Response) => {
  const popular = await SearchHistory.aggregate([
    { $group: { _id: '$query', count: { $sum: '$count' } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { query: '$_id', count: 1, _id: 0 } },
  ]);

  res.status(200).json({ success: true, data: popular });
});

// @desc    Search history for user
// @route   GET /api/v1/search/history
export const getSearchHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const history = await SearchHistory.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .limit(20)
    .select('query count updatedAt');
  res.status(200).json({ success: true, data: history });
});

// @desc    Clear search history
// @route   DELETE /api/v1/search/history
export const clearSearchHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  await SearchHistory.deleteMany({ user: req.user._id });
  res.status(200).json({ success: true, message: 'Search history cleared' });
});

// @desc    Search by SKU or barcode
// @route   GET /api/v1/search/lookup?code=...
export const searchByCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) throw new AppError('Code is required', 400);

  const product = await Product.findOne({
    $or: [{ sku: { $regex: `^${escapeRegExp(String(code))}$`, $options: 'i' } }, { barcode: code }],
    isActive: true,
  }).populate('brand')
    .populate('category')
    .lean();

  if (!product) {
    throw new AppError('No product found with this code', 404);
  }

  res.status(200).json({ success: true, data: product });
});
