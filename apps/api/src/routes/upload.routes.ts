import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authenticate, authorize } from '../middleware/auth';

const router: Router = Router();

router.use(authenticate, authorize('admin', 'manager', 'content', 'seller'));

router.post(
  '/single',
  uploadController.uploadSingle,
  uploadController.uploadImage,
);
router.post(
  '/multiple',
  uploadController.uploadMultiple,
  uploadController.uploadImages,
);
router.delete('/:publicId', uploadController.deleteImage);

export default router;
