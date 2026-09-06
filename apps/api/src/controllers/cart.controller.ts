import { Request, Response } from 'express';
import { Cart, ICart } from '../models/Cart';
import { Product } from '../models/Product';
import { Coupon } from '../models/Coupon';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthRequest } from '../middleware/auth';

const findCart = async (
  req: AuthRequest,
  sessionId?: string,
): Promise<ICart | null> => {
  let cart: ICart | null = null;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  }

  if (!cart && sessionId) {
    cart = await Cart.findOne({ sessionId });
    cart?.set('user', req.user?._id);
    if (cart) await cart.save();
  }

  return cart;
};

const populateCart = (query: any) =>
  query.populate({
    path: 'items.product savedForLater.product',
    select: 'name slug price salePrice images availableStock brand',
    populate: { path: 'brand', select: 'name slug' },
  });

const recalculate = (cart: ICart) => {
  cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  cart.totalAmount = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );
  if (cart.couponDiscount > 0) {
    cart.couponDiscount = 0;
    cart.couponCode = undefined;
  }
};

// @desc    Get cart
// @route   GET /api/v1/cart
export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const sessionId = req.query.sessionId as string | undefined;

  let cart = await findCart(req, sessionId);

  if (!cart) {
    cart = await Cart.create({
      user: req.user?._id || undefined,
      sessionId: req.user ? undefined : sessionId,
    });
    return res.status(200).json({ success: true, data: cart });
  }

  cart = await populateCart(Cart.findById(cart._id));
  res.status(200).json({ success: true, data: cart });
});

// @desc    Add item to cart
// @route   POST /api/v1/cart
export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { product: productId, variant: variantId, quantity = 1 } = req.body;
  const sessionId = req.query.sessionId as string | undefined;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }

  let available = product.availableStock;
  let price = product.salePrice || product.price;
  if (variantId) {
    const variant = product.variants.id(variantId);
    if (!variant || !variant.isActive) {
      throw new AppError('Variant not found', 404);
    }
    available = variant.stock;
    price = variant.salePrice || variant.price;
  }

  if (quantity > available) {
    throw new AppError(`Only ${available} items available in stock`, 400);
  }

  let cart = await findCart(req, sessionId);
  if (!cart) {
    cart = await Cart.create({
      user: req.user?._id || undefined,
      sessionId: req.user ? undefined : sessionId,
    });
  }

  const existingItem = cart.items.find(
    (item) =>
      String(item.product) === String(productId) &&
      String(item.variant || '') === String(variantId || ''),
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    if (existingItem.quantity > available) {
      throw new AppError(`Only ${available} items available in stock`, 400);
    }
  } else {
    cart.items.push({
      product: productId as any,
      variant: variantId,
      quantity,
      price,
      addedAt: new Date(),
    });
  }

  recalculate(cart);
  await cart.save();

  const populated = await populateCart(Cart.findById(cart._id));
  res.status(201).json({ success: true, data: populated });
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const sessionId = req.query.sessionId as string | undefined;

  const cart = await findCart(req, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  const item = cart.items.id(itemId);
  if (!item) throw new AppError('Item not found in cart', 404);

  const product = await Product.findById(item.product);

  let available = product?.availableStock ?? 0;
  if (item.variant && product) {
    available = product.variants.id(item.variant)?.stock ?? 0;
  }

  if (quantity > available) {
    throw new AppError(`Only ${available} items available in stock`, 400);
  }

  item.quantity = quantity;
  recalculate(cart);
  await cart.save();

  const populated = await populateCart(Cart.findById(cart._id));
  res.status(200).json({ success: true, data: populated });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  const sessionId = req.query.sessionId as string | undefined;

  const cart = await findCart(req, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  cart.items.pull(itemId as any);
  recalculate(cart);
  await cart.save();

  const populated = await populateCart(Cart.findById(cart._id));
  res.status(200).json({ success: true, data: populated });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const sessionId = req.query.sessionId as string | undefined;

  const cart = await findCart(req, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  cart.items = [] as any;
  cart.savedForLater = [] as any;
  cart.couponCode = undefined;
  cart.couponDiscount = 0;
  cart.totalItems = 0;
  cart.totalAmount = 0;
  await cart.save();

  res.status(200).json({ success: true, data: cart });
});

// @desc    Apply coupon
// @route   POST /api/v1/cart/coupon
export const applyCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code } = req.body;
  const sessionId = req.query.sessionId as string | undefined;

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new AppError('Invalid coupon code', 404);

  const now = new Date();
  if (coupon.startDate > now || coupon.endDate < now) {
    throw new AppError('Coupon has expired', 400);
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400);
  }

  if (req.user) {
    const userUsage = coupon.usedBy.find(
      (u) => String(u.user) === String(req.user._id),
    );
    if (userUsage && userUsage.count >= coupon.perUserLimit) {
      throw new AppError('You have already used this coupon', 400);
    }
  }

  const cart = await findCart(req, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  if (cart.totalAmount < coupon.minimumOrder) {
    throw new AppError(
      `Minimum order for this coupon is Rs. ${coupon.minimumOrder.toLocaleString()}`,
      400,
    );
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (cart.totalAmount * coupon.value) / 100;
    if (coupon.maximumDiscount) {
      discount = Math.min(discount, coupon.maximumDiscount);
    }
  } else if (coupon.type === 'fixed') {
    discount = Math.min(coupon.value, cart.totalAmount);
  }

  cart.couponCode = coupon.code;
  cart.couponDiscount = discount;
  await cart.save();

  res.status(200).json({
    success: true,
    data: { cart, appliedDiscount: discount },
  });
});

// @desc    Remove coupon
// @route   DELETE /api/v1/cart/coupon
export const removeCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const sessionId = req.query.sessionId as string | undefined;

  const cart = await findCart(req, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  cart.couponCode = undefined;
  cart.couponDiscount = 0;
  await cart.save();

  res.status(200).json({ success: true, data: cart });
});

// @desc    Save item for later
// @route   POST /api/v1/cart/save-for-later/:itemId
export const saveForLater = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  const sessionId = req.query.sessionId as string | undefined;

  const cart = await findCart(req, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  const item = cart.items.id(itemId);
  if (!item) throw new AppError('Item not found in cart', 404);

  cart.savedForLater.push(item as any);
  cart.items.pull(itemId as any);
  recalculate(cart);
  await cart.save();

  res.status(200).json({ success: true, data: cart });
});

// @desc    Move item back to cart
// @route   POST /api/v1/cart/move-to-cart/:itemId
export const moveToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  const sessionId = req.query.sessionId as string | undefined;

  const cart = await findCart(req, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  const item = cart.savedForLater.id(itemId);
  if (!item) throw new AppError('Item not found in saved items', 404);

  cart.items.push(item as any);
  cart.savedForLater.pull(itemId as any);
  recalculate(cart);
  await cart.save();

  res.status(200).json({ success: true, data: cart });
});
