import { Router } from 'express';
import {
  getProducts,
  getFeatured,
  getNewArrivals,
  getBestSellers,
  getTrending,
  getProductBySlug,
  getProductById,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  getRelatedProducts,
  bulkCreate,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createProductSchema, updateProductSchema, createVariantSchema } from '@toys/validation';

const router: Router = Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/trending', getTrending);
router.get('/barcode/:code', getProductByBarcode);
router.get('/id/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.get('/:slug', getProductBySlug);

// Protected routes
router.use(authenticate);

// Admin routes
router.post('/', authorize('admin', 'manager', 'content', 'marketing'), validate(createProductSchema), createProduct);
router.post('/bulk', authorize('admin', 'manager', 'content'), bulkCreate);
router.put('/:id', authorize('admin', 'manager', 'content'), validate(updateProductSchema), updateProduct);
router.delete('/:id', authorize('admin', 'manager', 'content'), deleteProduct);
router.post('/:id/variants', authorize('admin', 'manager', 'content'), validate(createVariantSchema), addVariant);
router.put('/:id/variants/:vid', authorize('admin', 'manager', 'content'), updateVariant);
router.delete('/:id/variants/:vid', authorize('admin', 'manager', 'content'), deleteVariant);

export default router;
