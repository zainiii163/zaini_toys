import { Router } from 'express';
import {
  getPublishedPosts,
  getPostBySlug,
  getBlogCategories,
  adminGetPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blog.controller';
import { authenticate, authorize } from '../middleware/auth';

const router: Router = Router();

router.get('/meta/categories', getBlogCategories);
router.get('/admin/all', authenticate, authorize('admin', 'manager'), adminGetPosts);
router.get('/:slug', getPostBySlug);
router.get('/', getPublishedPosts);
router.post('/', authenticate, authorize('admin', 'manager'), createPost);
router.put('/:id', authenticate, authorize('admin', 'manager'), updatePost);
router.delete('/:id', authenticate, authorize('admin', 'manager'), deletePost);

export default router;
