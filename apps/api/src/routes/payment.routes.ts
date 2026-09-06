import { Router } from 'express';
import {
  initiatePayment,
  paymentSuccess,
  paymentCancel,
  paymentWebhook,
  paymentStatus,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { initiatePaymentSchema } from '@toys/validation';

const router: Router = Router();

router.post('/webhook', paymentWebhook);
router.get('/success/:orderNumber', paymentSuccess);
router.get('/cancel/:orderNumber', paymentCancel);

router.use(authenticate);
router.post('/initiate', validate(initiatePaymentSchema), initiatePayment);
router.get('/status/:orderNumber', paymentStatus);

export default router;
