import { Request, Response } from 'express';
import { BlogPost } from '../models/BlogPost';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// @desc    Get published blog posts (public)
// @route   GET /api/v1/blog
export const getPublishedPosts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { category, tag, search } = req.query;

  const filter: any = { isPublished: true };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { excerpt: { $regex: search, $options: 'i' } }];

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar'),
    BlogPost.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, data: posts, pagination: getPaginationMeta(total, page, limit) });
});

// @desc    Get single blog post by slug (public)
// @route   GET /api/v1/blog/:slug
export const getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true })
    .populate('author', 'name avatar');
  if (!post) throw new AppError('Post not found', 404);

  post.viewCount += 1;
  await post.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, data: post });
});

// @desc    Get blog categories
// @route   GET /api/v1/blog/meta/categories
export const getBlogCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await BlogPost.distinct('category', { isPublished: true });
  res.status(200).json({ success: true, data: categories });
});

// @desc    Admin: Get all posts
// @route   GET /api/v1/blog/admin/all
export const adminGetPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { status } = req.query;

  const filter: any = {};
  if (status === 'published') filter.isPublished = true;
  if (status === 'draft') filter.isPublished = false;

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email'),
    BlogPost.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, data: posts, pagination: getPaginationMeta(total, page, limit) });
});

// @desc    Admin: Create post
// @route   POST /api/v1/blog
export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, excerpt, featuredImage, category, tags, isPublished, seoTitle, seoDescription } = req.body;

  const post = await BlogPost.create({
    title,
    slug: generateSlug(title) + '-' + Date.now().toString(36),
    content,
    excerpt,
    featuredImage,
    author: req.user._id,
    category: category || 'Guides',
    tags: tags || [],
    isPublished: isPublished || false,
    publishedAt: isPublished ? new Date() : undefined,
    seoTitle,
    seoDescription,
  });

  res.status(201).json({ success: true, data: post });
});

// @desc    Admin: Update post
// @route   PUT /api/v1/blog/:id
export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const { title, content, excerpt, featuredImage, category, tags, isPublished, seoTitle, seoDescription } = req.body;

  if (title && title !== post.title) {
    post.slug = generateSlug(title) + '-' + Date.now().toString(36);
  }

  Object.assign(post, {
    ...(title && { title }),
    ...(content && { content }),
    ...(excerpt !== undefined && { excerpt }),
    ...(featuredImage && { featuredImage }),
    ...(category && { category }),
    ...(tags && { tags }),
    ...(seoTitle !== undefined && { seoTitle }),
    ...(seoDescription !== undefined && { seoDescription }),
  });

  if (isPublished !== undefined && isPublished && !post.isPublished) {
    post.isPublished = true;
    post.publishedAt = new Date();
  } else if (isPublished !== undefined) {
    post.isPublished = isPublished;
  }

  await post.save();
  res.status(200).json({ success: true, data: post });
});

// @desc    Admin: Delete post
// @route   DELETE /api/v1/blog/:id
export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) throw new AppError('Post not found', 404);
  res.status(200).json({ success: true, data: { _id: req.params.id } });
});
