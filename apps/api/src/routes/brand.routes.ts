import { Router } from 'express';
import {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brand.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createBrandSchema } from '@toys/validation';

const router: Router = Router();

router.get('/', getBrands);
router.get('/:slug', getBrandBySlug);

router.use(authenticate);

router.post('/', authorize('admin', 'manager', 'content', 'marketing'), validate(createBrandSchema), createBrand);
router.put('/:id', authorize('admin', 'manager', 'content', 'marketing'), validate(createBrandSchema.partial()), updateBrand);
router.delete('/:id', authorize('admin', 'manager', 'content'), deleteBrand);

export default router;
