import { Request, Response } from 'express';
import { Brand } from '../models/Brand';
import { Product } from '../models/Product';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { generateSlug } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

// @desc    Get all brands
// @route   GET /api/v1/brands
export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean();
  res.status(200).json({ success: true, data: brands });
});

// @desc    Get brand by slug with products
// @route   GET /api/v1/brands/:slug
export const getBrandBySlug = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!brand) throw new AppError('Brand not found', 404);

  const products = await Product.find({ brand: brand._id, isActive: true })
    .limit(20)
    .lean();

  res.status(200).json({ success: true, data: { brand, products } });
});

// @desc    Admin: Create brand
// @route   POST /api/v1/brands
export const createBrand = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = req.body;

  let slug = generateSlug(data.name);
  const existing = await Brand.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const brand = await Brand.create({ ...data, slug });
  res.status(201).json({ success: true, data: brand });
});

// @desc    Admin: Update brand
// @route   PUT /api/v1/brands/:id
export const updateBrand = asyncHandler(async (req: AuthRequest, res: Response) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) throw new AppError('Brand not found', 404);

  const data = req.body;
  if (data.name && data.name !== brand.name) {
    data.slug = generateSlug(data.name);
  }

  const updated = await Brand.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
  res.status(200).json({ success: true, data: updated });
});

// @desc    Admin: Delete brand
// @route   DELETE /api/v1/brands/:id
export const deleteBrand = asyncHandler(async (req: AuthRequest, res: Response) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) throw new AppError('Brand not found', 404);

  const hasProducts = await Product.findOne({ brand: brand._id, isActive: true });
  if (hasProducts) {
    throw new AppError('Cannot delete brand with active products', 400);
  }

  await Brand.findByIdAndUpdate(req.params.id, { isActive: false });
  res.status(200).json({ success: true, message: 'Brand deactivated' });
});
