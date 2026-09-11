import { Router } from 'express';
import {
  register,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getMe,
  refreshToken,
  logout,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { authLimiter, otpLimiter, verifyOtpLimiter, refreshLimiter } from '../middleware/rateLimit';
import {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from '@toys/validation';

const router: Router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/send-otp', otpLimiter, validate(sendOtpSchema), sendOtp);
router.post('/verify-otp', verifyOtpLimiter, validate(verifyOtpSchema), verifyOtp);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
router.post('/refresh-token', refreshLimiter, validate(refreshTokenSchema), refreshToken);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

export default router;
