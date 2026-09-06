import { Router } from 'express';
import {
  searchProducts,
  getSuggestions,
  getPopularSearches,
  getSearchHistory,
  clearSearchHistory,
  searchByCode,
} from '../controllers/search.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router: Router = Router();

router.get('/suggestions', getSuggestions);
router.get('/popular', getPopularSearches);
router.get('/lookup', searchByCode);
router.get('/', optionalAuth, searchProducts);

router.use(authenticate);
router.get('/history', getSearchHistory);
router.delete('/history', clearSearchHistory);

export default router;
