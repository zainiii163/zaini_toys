import { Router } from 'express';
import {
  getWishlists,
  createWishlist,
  addWishlistItem,
  removeWishlistItem,
  updateWishlist,
  deleteWishlist,
  shareWishlist,
  getSharedWishlist,
  moveAllToCart,
} from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

router.get('/shared/:token', getSharedWishlist);

router.use(authenticate);

router.get('/', getWishlists);
router.post('/', createWishlist);
router.post('/:id/items', addWishlistItem);
router.delete('/:id/items/:itemId', removeWishlistItem);
router.put('/:id', updateWishlist);
router.delete('/:id', deleteWishlist);
router.post('/:id/share', shareWishlist);
router.post('/:id/move-to-cart', moveAllToCart);

export default router;
