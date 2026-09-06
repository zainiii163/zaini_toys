import { Router } from 'express';
import {
  createTicket,
  getMyTickets,
  getTicket,
  addMessage,
  adminGetTickets,
  adminUpdateStatus,
  adminReply,
  adminAssign,
} from '../controllers/support.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createTicketSchema, addTicketMessageSchema } from '@toys/validation';

const router: Router = Router();

router.post('/', authenticate, validate(createTicketSchema), createTicket);
router.get('/', authenticate, getMyTickets);
router.get('/admin/all', authenticate, authorize('admin', 'manager', 'support'), adminGetTickets);
router.get('/:id', authenticate, getTicket);
router.post('/:id/messages', authenticate, validate(addTicketMessageSchema), addMessage);
router.put('/admin/:id/status', authenticate, authorize('admin', 'manager', 'support'), adminUpdateStatus);
router.post('/admin/:id/reply', authenticate, authorize('admin', 'manager', 'support'), adminReply);
router.put('/admin/:id/assign', authenticate, authorize('admin', 'manager', 'support'), adminAssign);

export default router;
