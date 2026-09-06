import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

// @desc    Admin: Get all users
// @route   GET /api/v1/admin/users
export const adminGetUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { role, search, status } = req.query;

  const filter: any = {};
  if (role) filter.role = role;
  if (status === 'active') filter.isActive = true;
  if (status === 'blocked') filter.isBlocked = true;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('name email phone role isActive isBlocked loyaltyTier orderCount totalSpent createdAt lastLogin')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Admin: Get single user
// @route   GET /api/v1/admin/users/:id
export const adminGetUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire -phoneOtp -phoneOtpExpire').populate('addresses');
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, data: user });
});

// @desc    Admin: Update user
// @route   PUT /api/v1/admin/users/:id
export const adminUpdateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { role, isActive, isBlocked, name, email, phone, loyaltyPoints, totalSpent } = req.body;

  const updateData: any = {};
  if (role) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (isBlocked !== undefined) updateData.isBlocked = isBlocked;
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (loyaltyPoints !== undefined) updateData.loyaltyPoints = loyaltyPoints;
  if (totalSpent !== undefined) updateData.totalSpent = totalSpent;

  const user = await User.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true, runValidators: true }).select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire -phoneOtp -phoneOtpExpire');
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, data: user });
});

// @desc    Admin: Create staff/admin user
// @route   POST /api/v1/admin/users
export const adminCreateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, phone, password, role } = req.body;

  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) throw new AppError('User already exists', 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: role || 'customer',
    isActive: true,
    isEmailVerified: true,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// @desc    Admin: Delete user
// @route   DELETE /api/v1/admin/users/:id
export const adminDeleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (String(req.params.id) === String(req.user._id)) {
    throw new AppError('You cannot delete your own account', 400);
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, message: 'User deleted' });
});

// @desc    Admin: Block/Unblock user
// @route   PUT /api/v1/admin/users/:id/block
export const adminToggleBlock = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  user.isBlocked = !user.isBlocked;
  user.isActive = !user.isBlocked;
  await user.save();

  res.status(200).json({ success: true, data: { isBlocked: user.isBlocked, isActive: user.isActive } });
});

// @desc    Admin: User stats/counts
// @route   GET /api/v1/admin/users/stats/summary
export const adminUserStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [total, activeCustomers, blocked, admins] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true, role: 'customer' }),
    User.countDocuments({ isBlocked: true }),
    User.countDocuments({ role: { $in: ['admin', 'manager'] } }),
  ]);

  res.status(200).json({
    success: true,
    data: { total, activeCustomers, blocked, admins },
  });
});
