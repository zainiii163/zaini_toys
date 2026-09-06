import { Request, Response } from 'express';
import { Setting, ISetting } from '../models/Setting';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthRequest } from '../middleware/auth';

// @desc    Get all public settings
// @route   GET /api/v1/settings/public
export const getPublicSettings = asyncHandler(async (_req: Request, res: Response) => {
  const keys = ['store', 'social', 'shipping', 'payment', 'seo', 'notification'];
  const settings = await Setting.find({ key: { $in: keys } });
  const data: Record<string, unknown> = {};
  settings.forEach((s) => {
    data[s.key] = s.value;
  });
  res.status(200).json({ success: true, data });
});

// @desc    Get all settings (admin)
// @route   GET /api/v1/settings
export const getAllSettings = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const settings = await Setting.find().sort({ key: 1 });
  const data: Record<string, unknown> = {};
  settings.forEach((s) => {
    data[s.key] = s.value;
  });
  res.status(200).json({ success: true, data });
});

// @desc    Get a single setting by key
// @route   GET /api/v1/settings/:key
export const getSetting = asyncHandler(async (req: Request, res: Response) => {
  const setting: ISetting | null = await Setting.findOne({ key: req.params.key });
  if (!setting) throw new AppError('Setting not found', 404);
  res.status(200).json({ success: true, data: setting.value });
});

// @desc    Update a setting
// @route   PUT /api/v1/settings/:key
export const updateSetting = asyncHandler(async (req: AuthRequest, res: Response) => {
  const setting: ISetting | null = await Setting.findOneAndUpdate(
    { key: req.params.key },
    { $set: { value: req.body, updatedBy: req.user._id } },
    { new: true, upsert: true },
  );
  res.status(200).json({ success: true, data: setting });
});

// @desc    Update multiple settings at once
// @route   PUT /api/v1/settings
export const updateSettingsBulk = asyncHandler(async (req: AuthRequest, res: Response) => {
  const updates = req.body;
  for (const [key, value] of Object.entries(updates)) {
    await Setting.findOneAndUpdate(
      { key },
      { $set: { value, updatedBy: req.user._id } },
      { new: true, upsert: true },
    );
  }
  res.status(200).json({ success: true, message: 'Settings updated' });
});
