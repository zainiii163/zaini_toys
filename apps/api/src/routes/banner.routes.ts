import { Router } from 'express';
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
} from '../controllers/banner.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createBannerSchema } from '@toys/validation';

const router: Router = Router();

router.get('/', getActiveBanners);

router.use(authenticate, authorize('admin', 'manager', 'content'));
router.get('/admin/all', getAllBanners);
router.post('/', validate(createBannerSchema), createBanner);
router.put('/reorder', reorderBanners);
router.put('/:id', validate(createBannerSchema.partial()), updateBanner);
router.delete('/:id', deleteBanner);

export default router;
