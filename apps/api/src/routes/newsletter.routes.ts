import { Router } from 'express';
import { subscribe, unsubscribe, adminGetSubscribers, adminGetStats } from '../controllers/newsletter.controller';
import { authenticate, authorize } from '../middleware/auth';

const router: Router = Router();

router.post('/', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/admin/all', authenticate, authorize('admin', 'manager'), adminGetSubscribers);
router.get('/admin/stats', authenticate, authorize('admin', 'manager'), adminGetStats);

export default router;
