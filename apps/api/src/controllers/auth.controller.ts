import crypto from 'crypto';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { sendTokens, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { emailService } from '../services/email.service';
import type { AuthRequest } from '../middleware/auth';

const generateReferralCode = () => {
  return 'TOY' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// @desc    Register new customer
// @route   POST /api/v1/auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password, referralCode } = req.body;

  const existing = await User.findOne({
    $or: [{ email }, { phone }],
  });
  if (existing) {
    throw new AppError('User with this email or phone already exists', 409);
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    referralCode: generateReferralCode(),
  });

  // Handle referral if provided
  if (referralCode && referralCode !== user.referralCode) {
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (referrer) {
      user.referredBy = referrer._id;
      await user.save();
    }
  }

  sendTokens(res, user);

  // Send welcome email (non-blocking)
  emailService.sendWelcome(email, name).catch(() => {});

  res.status(201).json({
    success: true,
    data: { user },
    message: 'Registration successful',
  });
});

// @desc    Login with email + password
// @route   POST /api/v1/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +phoneOtp');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.isBlocked) {
    throw new AppError('Your account has been blocked', 403);
  }
  if (!user.isActive) {
    throw new AppError('Your account is inactive', 403);
  }

  // Update login history
  user.lastLogin = new Date();
  user.loginHistory.unshift({
    ip: req.ip || '',
    device: req.headers['user-agent']?.slice(0, 200) || '',
    date: new Date(),
  });
  user.loginHistory = user.loginHistory.slice(0, 20);
  await user.save();

  sendTokens(res, user);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// @desc    Send OTP to phone
// @route   POST /api/v1/auth/send-otp
export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone, purpose } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  let user = await User.findOne({ phone });

  if (purpose === 'login' && !user) {
    throw new AppError('No account found with this phone number. Please register.', 404);
  }

  if (purpose === 'verification' && !user) {
    // Auto-register on first verification
    user = await User.create({
      name: 'User ' + phone.slice(-4),
      phone,
      email: `${phone.replace(/\D/g, '')}@toymail.local`,
      password: crypto.randomBytes(16).toString('hex'),
      referralCode: generateReferralCode(),
    });
  }

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.phoneOtp = otp;
  user.phoneOtpExpire = expiry;
  await user.save();

  // TODO: Integrate SMS gateway (e.g., Telenor, PTCL) to send OTP
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] OTP for ${phone}: ${otp}`);
  }

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
  });
});

// @desc    Verify OTP and login
// @route   POST /api/v1/auth/verify-otp
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone }).select('+phoneOtp');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.phoneOtp || user.phoneOtp !== otp) {
    throw new AppError('Invalid OTP', 400);
  }

  if (user.phoneOtpExpire && user.phoneOtpExpire < new Date()) {
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  user.phoneOtp = undefined;
  user.phoneOtpExpire = undefined;
  user.isPhoneVerified = true;
  await user.save();

  sendTokens(res, user);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// @desc    Forgot password - send reset email
// @route   POST /api/v1/auth/forgot-password
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('No user found with this email', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.CUSTOMER_URL || 'http://localhost:5173'}/auth/reset-password/${resetToken}`;
  emailService.sendPasswordReset(email, resetUrl).catch(() => {});

  res.status(200).json({
    success: true,
    message: 'Password reset email sent',
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokens(res, user);

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: { user } });
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshTokenFromBody = req.body.refreshToken;
  const refreshTokenFromCookie = req.cookies?.refresh_token;
  const token = refreshTokenFromBody || refreshTokenFromCookie;

  if (!token) {
    throw new AppError('No refresh token provided', 401);
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('-password -phoneOtp');

    if (!user || !user.isActive) {
      throw new AppError('User no longer exists', 401);
    }

    sendTokens(res, user);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }
});

// @desc    Logout
// @route   POST /api/v1/auth/logout
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.status(200).json({ success: true, message: 'Logged out' });
});
