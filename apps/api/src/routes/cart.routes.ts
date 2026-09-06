import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  saveForLater,
  moveToCart,
} from '../controllers/cart.controller';
import { optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { cartItemSchema, updateCartItemSchema, applyCouponSchema } from '@toys/validation';

const router: Router = Router();

router.use(optionalAuth);

router.get('/', getCart);
router.post('/', validate(cartItemSchema), addToCart);
router.put('/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/:itemId', removeFromCart);
router.delete('/', clearCart);
router.post('/coupon', validate(applyCouponSchema), applyCoupon);
router.delete('/coupon', removeCoupon);
router.post('/save-for-later/:itemId', saveForLater);
router.post('/move-to-cart/:itemId', moveToCart);

export default router;
