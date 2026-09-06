import { Router } from 'express';
import {
  getProductReviews,
  getReviewSummary,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  adminGetReviews,
  adminApproveReview,
  adminRejectReview,
  adminFeatureReview,
  adminReplyReview,
} from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createReviewSchema, adminReplySchema } from '@toys/validation';

const router: Router = Router();

router.get('/product/:productId/summary', getReviewSummary);
router.get('/product/:productId', getProductReviews);

router.use(authenticate);

router.post('/', validate(createReviewSchema), createReview);
router.put('/:id', validate(createReviewSchema.partial()), updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markHelpful);
router.post('/:id/report', reportReview);

router.get('/admin/all', authorize('admin', 'manager', 'content'), adminGetReviews);
router.put('/admin/:id/approve', authorize('admin', 'manager', 'content'), adminApproveReview);
router.put('/admin/:id/reject', authorize('admin', 'manager', 'content'), adminRejectReview);
router.put('/admin/:id/feature', authorize('admin', 'manager', 'content'), adminFeatureReview);
router.put('/admin/:id/reply', authorize('admin', 'manager', 'content'), validate(adminReplySchema), adminReplyReview);

export default router;
