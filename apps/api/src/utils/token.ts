import jwt from 'jsonwebtoken';
import { env } from '../config/database';
import { Response } from 'express';
import type { IUser } from '../models/User';

export interface TokenPayload {
  id: string;
  role: string;
}

const accessTokenSecret = env.JWT_SECRET;
const refreshTokenSecret = env.JWT_REFRESH_SECRET;
const accessExpire = env.JWT_EXPIRE as any;
const refreshExpire = env.JWT_REFRESH_EXPIRE as any;

export const generateAccessToken = (user: { _id: unknown; role: string }): string => {
  return jwt.sign({ id: user._id, role: user.role }, accessTokenSecret, {
    expiresIn: accessExpire,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (user: { _id: unknown; role: string }): string => {
  return jwt.sign({ id: user._id, role: user.role }, refreshTokenSecret, {
    expiresIn: refreshExpire,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, accessTokenSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, refreshTokenSecret) as TokenPayload;
};

export const sendTokens = (res: Response, user: IUser): void => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const isProd = env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refresh_token', refreshToken, cookieOptions);
};
