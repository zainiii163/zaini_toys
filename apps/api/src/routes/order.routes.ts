import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderByNumber,
  cancelOrder,
  requestReturn,
  trackOrder,
  reorder,
  adminGetOrders,
  adminUpdateStatus,
  adminAddNotes,
  adminOrderStats,
} from '../controllers/order.controller';
import { authenticate, optionalAuth, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  createOrderSchema,
  cancelOrderSchema,
  returnOrderSchema,
  updateOrderStatusSchema,
} from '@toys/validation';

const router: Router = Router();

// Customer routes
router.post('/', optionalAuth, validate(createOrderSchema.partial()), createOrder);
router.get('/', authenticate, getMyOrders);
router.get('/admin/all', authenticate, authorize('admin', 'order_manager', 'manager'), adminGetOrders);
router.get('/admin/stats', authenticate, authorize('admin', 'order_manager', 'manager'), adminOrderStats);
router.get('/:orderNumber', authenticate, getOrderByNumber);
router.put('/:id/cancel', authenticate, validate(cancelOrderSchema), cancelOrder);
router.post('/:id/return', authenticate, validate(returnOrderSchema), requestReturn);
router.get('/:id/track', authenticate, trackOrder);
router.post('/:id/reorder', authenticate, reorder);
router.put('/admin/:id/status', authenticate, authorize('admin', 'order_manager', 'manager'), validate(updateOrderStatusSchema), adminUpdateStatus);
router.put('/admin/:id/notes', authenticate, authorize('admin', 'order_manager', 'manager'), adminAddNotes);

export default router;
