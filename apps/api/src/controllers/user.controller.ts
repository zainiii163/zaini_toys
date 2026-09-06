import { Request, Response } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthRequest } from '../middleware/auth';

// @desc    Get user profile
// @route   GET /api/v1/users/profile
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist')
    .populate('childProfiles.favoriteCategories')
    .populate('childProfiles.favoriteBrands');
  res.status(200).json({ success: true, data: { user } });
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...(name && { name }), ...(avatar && { avatar }) } },
    { new: true, runValidators: true },
  );

  res.status(200).json({ success: true, data: { user } });
});

// @desc    Add address
// @route   POST /api/v1/users/addresses
export const addAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  const addressData = req.body;

  if (addressData.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }
  if (user.addresses.length === 0) {
    addressData.isDefault = true;
  }

  user.addresses.push(addressData);
  await user.save();

  res.status(201).json({ success: true, data: { addresses: user.addresses } });
});

// @desc    Get user addresses
// @route   GET /api/v1/users/addresses
export const getAddresses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: { addresses: user?.addresses || [] } });
});

// @desc    Update address
// @route   PUT /api/v1/users/addresses/:id
export const updateAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  const address = user.addresses.id(id);
  if (!address) throw new AppError('Address not found', 404);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
    req.body.isDefault = true;
  }

  Object.assign(address, req.body);
  await user.save();

  res.status(200).json({ success: true, data: { addresses: user.addresses } });
});

// @desc    Delete address
// @route   DELETE /api/v1/users/addresses/:id
export const deleteAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  user.addresses.pull(id);
  await user.save();

  res.status(200).json({ success: true, data: { addresses: user.addresses } });
});

// @desc    Add child profile
// @route   POST /api/v1/users/child-profiles
export const addChildProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  user.childProfiles.push(req.body);
  await user.save();

  res.status(201).json({ success: true, data: { childProfiles: user.childProfiles } });
});

// @desc    Get child profiles
// @route   GET /api/v1/users/child-profiles
export const getChildProfiles = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: { childProfiles: user?.childProfiles || [] } });
});

// @desc    Update child profile
// @route   PUT /api/v1/users/child-profiles/:id
export const updateChildProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  const profile = user.childProfiles.id(id);
  if (!profile) throw new AppError('Child profile not found', 404);

  Object.assign(profile, req.body);
  await user.save();

  res.status(200).json({ success: true, data: { childProfiles: user.childProfiles } });
});

// @desc    Delete child profile
// @route   DELETE /api/v1/users/child-profiles/:id
export const deleteChildProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  user.childProfiles.pull(id);
  await user.save();

  res.status(200).json({ success: true, data: { childProfiles: user.childProfiles } });
});

// @desc    Get loyalty info
// @route   GET /api/v1/users/loyalty
export const getLoyalty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id).select('loyaltyPoints loyaltyTier totalSpent orderCount');
  res.status(200).json({ success: true, data: { loyalty: user } });
});

// @desc    Get referral info
// @route   GET /api/v1/users/referral
export const getReferral = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  const referrals = await User.countDocuments({ referredBy: user?._id });

  res.status(200).json({
    success: true,
    data: {
      referralCode: user?.referralCode,
      referralCount: referrals,
      referralLink: `${process.env.CUSTOMER_URL || ''}/register?ref=${user?.referralCode}`,
    },
  });
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(200).json({ success: true, message: 'Account deactivated' });
});
