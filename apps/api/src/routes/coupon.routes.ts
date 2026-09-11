import { Router } from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponStats,
  adminCouponStats,
} from '../controllers/coupon.controller';
import { authenticate, optionalAuth, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { applyCouponSchema, createCouponSchema } from '@toys/validation';

const router: Router = Router();

router.post('/validate', optionalAuth, validate(applyCouponSchema), validateCoupon);

router.use(authenticate);

router.get('/', authorize('admin', 'marketing', 'manager'), getCoupons);
router.get('/admin/stats', authorize('admin', 'marketing', 'manager'), adminCouponStats);
router.post('/', authorize('admin', 'marketing', 'manager'), validate(createCouponSchema), createCoupon);
router.put('/:id', authorize('admin', 'marketing', 'manager'), validate(createCouponSchema.partial()), updateCoupon);
router.delete('/:id', authorize('admin', 'marketing', 'manager'), deleteCoupon);
router.get('/:id/stats', authorize('admin', 'marketing', 'manager'), getCouponStats);

export default router;
