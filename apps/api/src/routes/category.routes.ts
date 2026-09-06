import { Router } from 'express';
import {
  getCategories,
  getCategoryTree,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createCategorySchema } from '@toys/validation';

const router: Router = Router();

router.get('/tree', getCategoryTree);
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

router.use(authenticate);

router.post('/', authorize('admin', 'manager', 'content'), validate(createCategorySchema), createCategory);
router.put('/:id', authorize('admin', 'manager', 'content'), validate(createCategorySchema.partial()), updateCategory);
router.delete('/:id', authorize('admin', 'manager', 'content'), deleteCategory);

export default router;
