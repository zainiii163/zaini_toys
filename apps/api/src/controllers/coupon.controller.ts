import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

// @desc    Validate coupon (customer)
// @route   POST /api/v1/coupons/validate
export const validateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, subtotal } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new AppError('Invalid coupon code', 404);

  const now = new Date();
  if (coupon.startDate > now || coupon.endDate < now) {
    throw new AppError('Coupon has expired', 400);
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400);
  }

  if (req.user) {
    const usage = coupon.usedBy.find((u) => String(u.user) === String(req.user._id));
    if (usage && usage.count >= coupon.perUserLimit) {
      throw new AppError('You have already used this coupon', 400);
    }
  }

  if (coupon.firstOrderOnly && req.user) {
    const user = req.user;
    if (user.orderCount && user.orderCount > 0) {
      throw new AppError('This coupon is only for first-time orders', 400);
    }
  }

  if (subtotal !== undefined && subtotal < coupon.minimumOrder) {
    throw new AppError(
      `Minimum order for this coupon is Rs. ${coupon.minimumOrder.toLocaleString()}`,
      400,
    );
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = subtotal ? (subtotal * coupon.value) / 100 : 0;
    if (coupon.maximumDiscount) discount = Math.min(discount, coupon.maximumDiscount);
  } else if (coupon.type === 'fixed') {
    discount = coupon.value;
  }

  res.status(200).json({
    success: true,
    data: { coupon, discount },
  });
});

// @desc    Admin: List coupons
// @route   GET /api/v1/coupons
export const getCoupons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const [coupons, total] = await Promise.all([
    Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Coupon.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: coupons,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Admin: Create coupon
// @route   POST /api/v1/coupons
export const createCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, data: coupon });
});

// @desc    Admin: Update coupon
// @route   PUT /api/v1/coupons/:id
export const updateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!coupon) throw new AppError('Coupon not found', 404);
  res.status(200).json({ success: true, data: coupon });
});

// @desc    Admin: Delete coupon
// @route   DELETE /api/v1/coupons/:id
export const deleteCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new AppError('Coupon not found', 404);
  res.status(200).json({ success: true, message: 'Coupon deleted' });
});

// @desc    Admin: Get coupon stats
// @route   GET /api/v1/coupons/:id/stats
export const getCouponStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new AppError('Coupon not found', 404);

  res.status(200).json({
    success: true,
    data: {
      usageCount: coupon.usageCount,
      usageLimit: coupon.usageLimit,
      perUserLimit: coupon.perUserLimit,
      usedByCount: coupon.usedBy.length,
    },
  });
});
