import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { generateSlug } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

// @desc    Get categories (flat or tree)
// @route   GET /api/v1/categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { includeInactive } = req.query;
  const filter: any = includeInactive ? {} : { isActive: true };

  const categories = await Category.find(filter).sort({ sortOrder: 1 }).lean();
  res.status(200).json({ success: true, data: categories });
});

// @desc    Get category tree
// @route   GET /api/v1/categories/tree
export const getCategoryTree = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();

  const buildTree = (parentId: string | undefined | null): any[] => {
    return categories
      .filter((c) => (parentId ? String(c.parent || '') === String(parentId) : !c.parent))
      .map((c) => ({
        ...c,
        children: buildTree(String(c._id)),
      }));
  };

  const tree = buildTree(undefined);
  res.status(200).json({ success: true, data: tree });
});

// @desc    Get category by slug
// @route   GET /api/v1/categories/:slug
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ slug: req.params.slug }).lean();
  if (!category) throw new AppError('Category not found', 404);

  const children = await Category.find({ parent: category._id, isActive: true }).lean();
  res.status(200).json({ success: true, data: { category, children } });
});

// @desc    Admin: Create category
// @route   POST /api/v1/categories
export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = req.body;

  let slug = generateSlug(data.name);
  const existing = await Category.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  let level = 0;
  if (data.parent) {
    const parent = await Category.findById(data.parent);
    if (!parent) throw new AppError('Parent category not found', 404);
    level = parent.level + 1;
  }

  const category = await Category.create({ ...data, slug, level });
  res.status(201).json({ success: true, data: category });
});

// @desc    Admin: Update category
// @route   PUT /api/v1/categories/:id
export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  const data = req.body;
  if (data.name && data.name !== category.name) {
    data.slug = generateSlug(data.name);
  }

  const updated = await Category.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
  res.status(200).json({ success: true, data: updated });
});

// @desc    Admin: Delete category
// @route   DELETE /api/v1/categories/:id
export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  const hasChildren = await Category.findOne({ parent: category._id });
  if (hasChildren) {
    throw new AppError('Cannot delete category with subcategories. Move or delete them first.', 400);
  }

  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.status(200).json({ success: true, message: 'Category deactivated' });
});
