import multer from 'multer';
import type { RequestHandler } from 'express';
import { AppError } from '../utils/AppError';

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400));
  }
};

const limits = { fileSize: 5 * 1024 * 1024 };

export const uploadSingle: RequestHandler = multer({ storage, fileFilter, limits }).single('image');
export const uploadMultiple: RequestHandler = multer({ storage, fileFilter, limits }).array('images', 10);
export const uploadFields: RequestHandler = multer({ storage, fileFilter, limits }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'gallery', maxCount: 10 },
]);
