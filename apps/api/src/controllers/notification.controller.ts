import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

// @desc    Get notifications for user
// @route   GET /api/v1/notifications
export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { unread } = req.query;

  const filter: any = { user: req.user._id };
  if (unread === 'true') filter.isRead = false;

  const [notifications, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: notifications,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get unread count
// @route   GET /api/v1/notifications/unread-count
export const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const count = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.status(200).json({ success: true, data: { count } });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: { isRead: true } },
    { new: true },
  );
  if (!notification) throw new AppError('Notification not found', 404);
  res.status(200).json({ success: true, data: notification });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!notification) throw new AppError('Notification not found', 404);
  res.status(200).json({ success: true, message: 'Notification deleted' });
});

// @desc    Clear all notifications
// @route   DELETE /api/v1/notifications
export const clearNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  await Notification.deleteMany({ user: req.user._id });
  res.status(200).json({ success: true, message: 'All notifications cleared' });
});

// @desc    Helper: create notification (used internally)
export const createNotification = async (data: {
  user: string;
  type: 'order' | 'promotion' | 'system' | 'price_drop' | 'back_in_stock';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channel?: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app';
}) => {
  return Notification.create({
    user: data.user,
    type: data.type,
    title: data.title,
    message: data.message,
    data: data.data,
    channel: data.channel || 'in_app',
  });
};
