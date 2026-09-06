import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Check Authorization header (Bearer token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.access_token) {
      // Fallback to cookie
      token = req.cookies.access_token;
    }

    if (!token) {
      throw new AppError('Not authorized to access this route', 401);
    }

    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password -phoneOtp');

      if (!user || !user.isActive) {
        throw new AppError('User no longer exists', 401);
      }

      if (user.isBlocked) {
        throw new AppError('Your account has been blocked. Contact support.', 403);
      }

      req.user = user;
      next();
    } catch {
      throw new AppError('Session expired. Please log in again.', 401);
    }
  },
);

export const optionalAuth = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token =
      req.headers.authorization?.split(' ')[1] || req.cookies?.access_token;

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id).select('-password -phoneOtp');
        if (user && user.isActive) {
          req.user = user;
        }
      } catch {
        // ignore invalid token for optional auth
      }
    }
    next();
  },
);

export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authorized to access this route', 401);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Role ${req.user.role} is not authorized to access this route`,
        403,
      );
    }
    next();
  };
