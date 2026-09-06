import { Request, Response } from 'express';
import { Wishlist } from '../models/Wishlist';
import { Product } from '../models/Product';
import { Cart } from '../models/Cart';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import crypto from 'crypto';
import type { AuthRequest } from '../middleware/auth';

// @desc    Get wishlists
// @route   GET /api/v1/wishlist
export const getWishlists = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlists = await Wishlist.find({ user: req.user._id })
    .populate({
      path: 'products.product',
      select: 'name slug price salePrice images availableStock brand',
      populate: { path: 'brand', select: 'name slug' },
    })
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: wishlists });
});

// @desc    Create wishlist
// @route   POST /api/v1/wishlist
export const createWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const wishlist = await Wishlist.create({ user: req.user._id, name: name || 'My Wishlist' });
  res.status(201).json({ success: true, data: wishlist });
});

// @desc    Add item to wishlist
// @route   POST /api/v1/wishlist/:id/items
export const addWishlistItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await Wishlist.findOne({ _id: req.params.id, user: req.user._id });
  if (!wishlist) throw new AppError('Wishlist not found', 404);

  const product = await Product.findById(req.body.product);
  if (!product) throw new AppError('Product not found', 404);

  if (wishlist.products.some((p) => String(p.product) === req.body.product)) {
    throw new AppError('Product already in wishlist', 400);
  }

  wishlist.products.push({
    product: product._id,
    priceWhenAdded: product.salePrice || product.price,
    addedAt: new Date(),
  });
  await wishlist.save();

  res.status(200).json({ success: true, data: wishlist });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/v1/wishlist/:id/items/:itemId
export const removeWishlistItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await Wishlist.findOne({ _id: req.params.id, user: req.user._id });
  if (!wishlist) throw new AppError('Wishlist not found', 404);

  wishlist.products.pull(req.params.itemId as any);
  await wishlist.save();

  res.status(200).json({ success: true, data: wishlist });
});

// @desc    Update wishlist
// @route   PUT /api/v1/wishlist/:id
export const updateWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
    { new: true },
  );
  if (!wishlist) throw new AppError('Wishlist not found', 404);
  res.status(200).json({ success: true, data: wishlist });
});

// @desc    Delete wishlist
// @route   DELETE /api/v1/wishlist/:id
export const deleteWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!wishlist) throw new AppError('Wishlist not found', 404);
  res.status(200).json({ success: true, message: 'Wishlist deleted' });
});

// @desc    Share wishlist
// @route   POST /api/v1/wishlist/:id/share
export const shareWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await Wishlist.findOne({ _id: req.params.id, user: req.user._id });
  if (!wishlist) throw new AppError('Wishlist not found', 404);

  if (!wishlist.shareToken) {
    wishlist.shareToken = crypto.randomBytes(8).toString('hex');
  }
  wishlist.isPublic = true;
  await wishlist.save();

  res.status(200).json({
    success: true,
    data: {
      shareToken: wishlist.shareToken,
      shareUrl: `${process.env.CUSTOMER_URL || ''}/wishlist/shared/${wishlist.shareToken}`,
    },
  });
});

// @desc    View shared wishlist
// @route   GET /api/v1/wishlist/shared/:token
export const getSharedWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await Wishlist.findOne({ shareToken: req.params.token, isPublic: true })
    .populate({
      path: 'products.product',
      select: 'name slug price salePrice images availableStock brand',
      populate: { path: 'brand', select: 'name slug' },
    });
  if (!wishlist) throw new AppError('Wishlist not found or is private', 404);
  res.status(200).json({ success: true, data: wishlist });
});

// @desc    Move all to cart
// @route   POST /api/v1/wishlist/:id/move-to-cart
export const moveAllToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await Wishlist.findOne({ _id: req.params.id, user: req.user._id });
  if (!wishlist) throw new AppError('Wishlist not found', 404);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, sessionId: 'tmp' });
  }

  for (const item of wishlist.products) {
    const product = await Product.findById(item.product);
    if (!product || product.stock <= 0) continue;

    cart.items.push({
      product: item.product,
      quantity: 1,
      price: product.salePrice || product.price,
      addedAt: new Date(),
    });
  }

  cart.totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.totalAmount = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  await cart.save();

  res.status(200).json({ success: true, data: cart });
});
