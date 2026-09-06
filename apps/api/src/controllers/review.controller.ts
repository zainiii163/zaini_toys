import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

// @desc    Get reviews for a product
// @route   GET /api/v1/reviews/product/:productId
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { sort } = req.query;

  const filter = { product: req.params.productId, isApproved: true };

  const sortMap: Record<string, any> = {
    newest: { createdAt: -1 },
    rating_desc: { rating: -1 },
    rating_asc: { rating: 1 },
    helpful: { helpfulCount: -1 },
  };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort(sortMap[sort as string] || { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name avatar'),
    Review.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get rating summary for a product
// @route   GET /api/v1/reviews/product/:productId/summary
export const getReviewSummary = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.productId;

  const reviews = await Review.find({ product: productId, isApproved: true });
  const summary = { total: reviews.length, average: 0, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, verifiedPurchase: 0 };

  if (reviews.length > 0) {
    summary.average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    reviews.forEach((r) => {
      summary.counts[r.rating as keyof typeof summary.counts] += 1;
      if (r.isVerifiedPurchase) summary.verifiedPurchase += 1;
    });
  }

  res.status(200).json({ success: true, data: summary });
});

// @desc    Create review
// @route   POST /api/v1/reviews
export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { product, order, rating, title, comment, images, videos } = req.body;

  // Check if already reviewed by this user
  const existing = await Review.findOne({ product, user: req.user._id });
  if (existing) {
    throw new AppError('You have already reviewed this product', 400);
  }

  // Check if user purchased the product (for verified purchase)
  let isVerifiedPurchase = false;
  if (order) {
    const orderDoc = await Order.findById(order);
    if (
      orderDoc &&
      String(orderDoc.customer) === String(req.user._id) &&
      orderDoc.items.some((i) => String(i.product) === product)
    ) {
      isVerifiedPurchase = true;
    }
  } else {
    // Check any delivered order containing this product
    const verified = await Order.findOne({
      customer: req.user._id,
      status: 'delivered',
      'items.product': product,
    });
    isVerifiedPurchase = !!verified;
  }

  const review = await Review.create({
    product,
    user: req.user._id,
    order,
    rating,
    title,
    comment,
    images: images || [],
    videos: videos || [],
    isVerifiedPurchase,
  });

  // Update product rating
  await updateProductRating(product);

  // Award loyalty points for review
  // PointsService will be called here in full impl

  res.status(201).json({ success: true, data: review });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);

  if (String(review.user) !== String(req.user._id)) {
    throw new AppError('Not authorized to update this review', 403);
  }

  const { rating, title, comment, images, videos } = req.body;
  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (comment) review.comment = comment;
  if (images) review.images = images;
  if (videos) review.videos = videos;
  await review.save();

  await updateProductRating(String(review.product));
  res.status(200).json({ success: true, data: review });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);

  if (String(review.user) !== String(req.user._id) && !['admin', 'manager', 'content'].includes(req.user.role)) {
    throw new AppError('Not authorized to delete this review', 403);
  }

  const productId = String(review.product);
  await review.deleteOne();
  await updateProductRating(productId);

  res.status(200).json({ success: true, message: 'Review deleted' });
});

// @desc    Mark review helpful
// @route   POST /api/v1/reviews/:id/helpful
export const markHelpful = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);

  if (review.helpfulBy.includes(req.user._id)) {
    throw new AppError('You already marked this review helpful', 400);
  }

  review.helpfulBy.push(req.user._id);
  review.helpfulCount = review.helpfulBy.length;
  await review.save();

  res.status(200).json({ success: true, helpfulCount: review.helpfulCount });
});

// @desc    Report review
// @route   POST /api/v1/reviews/:id/report
export const reportReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);

  if (review.reportedBy.includes(req.user._id)) {
    throw new AppError('You already reported this review', 400);
  }

  review.reportedBy.push(req.user._id);
  await review.save();

  res.status(200).json({ success: true, message: 'Review reported' });
});

// @desc    Admin: Get all reviews (moderation)
// @route   GET /api/v1/reviews/admin/all
export const adminGetReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { status, product } = req.query;

  const filter: any = {};
  if (status === 'pending') filter.isApproved = false;
  if (status === 'approved') filter.isApproved = true;
  if (status === 'reported') filter.reportedBy = { $exists: true, $ne: [] };
  if (product) filter.product = product;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('product', 'name slug images')
      .populate('user', 'name email'),
    Review.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Admin: Approve review
// @route   PUT /api/v1/reviews/admin/:id/approve
export const adminApproveReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true },
  );
  if (!review) throw new AppError('Review not found', 404);
  res.status(200).json({ success: true, data: review });
});

// @desc    Admin: Reject review
// @route   PUT /api/v1/reviews/admin/:id/reject
export const adminRejectReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: false },
    { new: true },
  );
  if (!review) throw new AppError('Review not found', 404);
  res.status(200).json({ success: true, data: review });
});

// @desc    Admin: Feature review
// @route   PUT /api/v1/reviews/admin/:id/feature
export const adminFeatureReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isFeatured: req.body.isFeatured },
    { new: true },
  );
  if (!review) throw new AppError('Review not found', 404);
  res.status(200).json({ success: true, data: review });
});

// @desc    Admin: Reply to review
// @route   PUT /api/v1/reviews/admin/:id/reply
export const adminReplyReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { adminReply: req.body.reply },
    { new: true },
  );
  if (!review) throw new AppError('Review not found', 404);
  res.status(200).json({ success: true, data: review });
});

const updateProductRating = async (productId: string) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
  });
};
