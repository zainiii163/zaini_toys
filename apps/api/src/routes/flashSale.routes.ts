import { Router } from 'express';
import {
  getActiveFlashSale,
  getAllFlashSales,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
  getFlashSaleProducts,
} from '../controllers/flashSale.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createFlashSaleSchema } from '@toys/validation';

const router: Router = Router();

router.get('/active', getActiveFlashSale);
router.get('/products', getFlashSaleProducts);

router.use(authenticate, authorize('admin', 'manager', 'marketing'));
router.get('/', getAllFlashSales);
router.post('/', validate(createFlashSaleSchema), createFlashSale);
router.put('/:id', validate(createFlashSaleSchema.partial()), updateFlashSale);
router.delete('/:id', deleteFlashSale);

export default router;
