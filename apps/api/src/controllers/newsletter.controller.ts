import { Request, Response } from 'express';
import { Newsletter } from '../models/Newsletter';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletter
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email) throw new AppError('Email is required', 400);

  const existing = await Newsletter.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (existing.isSubscribed) {
      throw new AppError('Already subscribed', 409);
    }
    existing.isSubscribed = true;
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = undefined;
    if (name) existing.name = name;
    await existing.save();
    return res.status(200).json({ success: true, message: 'Resubscribed successfully' });
  }

  await Newsletter.create({ email, name, source: req.body.source || 'website' });
  res.status(201).json({ success: true, message: 'Subscribed successfully' });
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/v1/newsletter/unsubscribe
export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) throw new AppError('Email is required', 400);

  const sub = await Newsletter.findOne({ email: email.toLowerCase() });
  if (!sub || !sub.isSubscribed) throw new AppError('Not subscribed', 404);

  sub.isSubscribed = false;
  sub.unsubscribedAt = new Date();
  await sub.save();
  res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
});

// @desc    Admin: Get all subscribers
// @route   GET /api/v1/newsletter/admin/all
export const adminGetSubscribers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { status } = req.query;

  const filter: any = {};
  if (status === 'active') filter.isSubscribed = true;
  if (status === 'unsubscribed') filter.isSubscribed = false;

  const [subscribers, total] = await Promise.all([
    Newsletter.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Newsletter.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, data: subscribers, pagination: getPaginationMeta(total, page, limit) });
});

// @desc    Admin: Get subscriber count
// @route   GET /api/v1/newsletter/admin/stats
export const adminGetStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [total, active] = await Promise.all([
    Newsletter.countDocuments(),
    Newsletter.countDocuments({ isSubscribed: true }),
  ]);
  res.status(200).json({ success: true, data: { total, active, unsubscribed: total - active } });
});
