import { Request, Response } from 'express';
import { Banner } from '../models/Banner';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta } from '@toys/utils';

// @desc    Get active banners by position
// @route   GET /api/v1/banners
export const getActiveBanners = asyncHandler(async (req: Request, res: Response) => {
  const { position } = req.query;
  const now = new Date();

  const filter: any = {
    isActive: true,
    $and: [{ $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }] }],
  };
  if (position) filter.position = position;

  const banners = await Banner.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: banners });
});

// @desc    Admin: Get all banners
// @route   GET /api/v1/banners/admin/all
export const getAllBanners = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const [banners, total] = await Promise.all([
    Banner.find().sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    Banner.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: banners,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Admin: Create banner
// @route   POST /api/v1/banners
export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, data: banner });
});

// @desc    Admin: Update banner
// @route   PUT /api/v1/banners/:id
export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!banner) throw new AppError('Banner not found', 404);
  res.status(200).json({ success: true, data: banner });
});

// @desc    Admin: Delete banner
// @route   DELETE /api/v1/banners/:id
export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new AppError('Banner not found', 404);
  res.status(200).json({ success: true, message: 'Banner deleted' });
});

// @desc    Admin: Reorder banners
// @route   PUT /api/v1/banners/reorder
export const reorderBanners = asyncHandler(async (req: Request, res: Response) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) throw new AppError('orderedIds must be an array', 400);

  const ops = orderedIds.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { sortOrder: index } } },
  }));
  await Banner.bulkWrite(ops);
  res.status(200).json({ success: true, message: 'Banners reordered' });
});
