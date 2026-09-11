import { Router } from 'express';
import { subscribe, unsubscribe, adminGetSubscribers, adminGetStats, updateNewsletter } from '../controllers/newsletter.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { otpLimiter } from '../middleware/rateLimit';
import { subscribeSchema, unsubscribeSchema } from '@toys/validation';

const router: Router = Router();

router.post('/', otpLimiter, validate(subscribeSchema), subscribe);
router.post('/unsubscribe', otpLimiter, validate(unsubscribeSchema), unsubscribe);
router.get('/admin/all', authenticate, authorize('admin', 'manager'), adminGetSubscribers);
router.get('/admin/stats', authenticate, authorize('admin', 'manager'), adminGetStats);
router.put('/:id', authenticate, authorize('admin', 'manager', 'marketing'), updateNewsletter);

export default router;
