import { Request, Response, RequestHandler } from 'express';
import { cloudinary } from '../config/cloudinary';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadSingle, uploadMultiple } from '../middleware/upload';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const result = await uploadToCloudinary(req.file.buffer, (req as any).filePath || 'uploads');

  res.status(200).json({
    success: true,
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: req.file.size,
    },
  });
});

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length === 0) {
    throw new AppError('No files uploaded', 400);
  }

  const folder = (req as any).folder || 'uploads';
  const results = [];
  for (const file of files) {
    const result = await uploadToCloudinary(file.buffer, folder);
    results.push({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: file.size,
    });
  }

  res.status(200).json({ success: true, data: results });
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.params;
  if (!publicId) throw new AppError('publicId is required', 400);

  await cloudinary.uploader.destroy(publicId);
  res.status(200).json({ success: true, message: 'Image deleted' });
});

const uploadToCloudinary = (buffer: Buffer, folder: string) => {
  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => {
        if (error) {
          const appError = new AppError('Upload failed', 500);
          reject(Object.assign(appError, { detail: error.message }));
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(buffer);
  });
};

interface UploadController {
  uploadSingle: RequestHandler;
  uploadMultiple: RequestHandler;
  uploadImage: RequestHandler;
  uploadImages: RequestHandler;
  deleteImage: RequestHandler;
}

export const uploadController: UploadController = {
  uploadSingle,
  uploadMultiple,
  uploadImage,
  uploadImages,
  deleteImage,
};
