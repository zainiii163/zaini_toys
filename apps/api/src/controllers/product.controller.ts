import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Brand } from '../models/Brand';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta, generateSlug } from '@toys/utils';
import type { AuthRequest } from '../middleware/auth';

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  ageMin?: number;
  ageMax?: number;
  rating?: number;
  sort?: string;
  availability?: string;
  color?: string;
  material?: string;
  skill?: string;
  featured?: string;
  newArrival?: string;
  bestSeller?: string;
  trending?: string;
  onSale?: string;
  isGiftEligible?: string;
}

const DEFAULT_POPULATE = [
  { path: 'brand', select: 'name slug logo' },
  { path: 'category', select: 'name slug' },
];

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/v1/products
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    ageMin,
    ageMax,
    rating,
    sort,
    availability,
    color,
    material,
    skill,
    featured,
    newArrival,
    bestSeller,
    trending,
    onSale,
  } = req.query as any as QueryParams;

  const { page, limit, skip } = getPaginationParams(req.query);

  const filter: any = { isActive: true };

  // Search
  if (search) {
    filter.$text = { $search: search as string };
  }

  // Category (match self or descendants) - by id or slug
  if (category) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);
    const cat = isObjectId
      ? await Category.findById(category)
      : await Category.findOne({ slug: category });
    if (cat) {
      const descendants = await Category.find({
        $or: [{ _id: cat._id }, { parent: cat._id }],
      }).select('_id');
      filter.category = { $in: descendants.map((d) => d._id) };
    }
  }

  // Brand
  if (brand) {
    filter.brand = brand;
  }

  // Price range
  if (minPrice || maxPrice) {
    filter.$or = [
      { price: { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) } },
      { salePrice: { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) } },
    ];
  }

  // Age range
  if (ageMin !== undefined || ageMax !== undefined) {
    filter['ageRange.min'] = { $lte: ageMax ?? 99 };
    filter['ageRange.max'] = { $gte: ageMin ?? 0 };
  }

  // Rating
  if (rating) {
    filter.averageRating = { $gte: rating };
  }

  // Availability
  if (availability === 'in_stock') {
    filter.availableStock = { $gt: 0 };
  } else if (availability === 'out_of_stock') {
    filter.availableStock = { $lte: 0 };
  }

  // Color / Material / Skill
  if (color) filter.color = color;
  if (material) filter.material = material;
  if (skill) filter.skillDevelopment = skill;

  // Flags
  if (featured) filter.isFeatured = true;
  if (newArrival) filter.isNewArrival = true;
  if (bestSeller) filter.isBestSeller = true;
  if (trending) filter.isTrending = true;
  if (onSale) {
    filter.$expr = { $and: [{ $gt: ['$salePrice', 0] }, { $lt: ['$salePrice', '$price'] }] };
  }

  // Sort
  const sortMap: Record<string, any> = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { averageRating: -1 },
    newest: { createdAt: -1 },
    bestseller: { totalSold: -1 },
    trending: { viewCount: -1 },
    name_asc: { name: 1 },
  };
  const sortBy = sort ? sortMap[sort] : { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate(DEFAULT_POPULATE)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const pagination = getPaginationMeta(total, page, limit);

  res.status(200).json({ success: true, data: products, pagination });
});

// @desc    Get featured products
// @route   GET /api/v1/products/featured
export const getFeatured = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 12, 50);
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate(DEFAULT_POPULATE)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  res.status(200).json({ success: true, data: products });
});

// @desc    Get new arrivals
// @route   GET /api/v1/products/new-arrivals
export const getNewArrivals = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 12, 50);
  const products = await Product.find({ isActive: true, isNewArrival: true })
    .populate(DEFAULT_POPULATE)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  res.status(200).json({ success: true, data: products });
});

// @desc    Get best sellers
// @route   GET /api/v1/products/best-sellers
export const getBestSellers = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 12, 50);
  const products = await Product.find({ isActive: true, isBestSeller: true })
    .populate(DEFAULT_POPULATE)
    .sort({ totalSold: -1 })
    .limit(limit)
    .lean();
  res.status(200).json({ success: true, data: products });
});

// @desc    Get trending products
// @route   GET /api/v1/products/trending
export const getTrending = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 12, 50);
  const products = await Product.find({ isActive: true, isTrending: true })
    .populate(DEFAULT_POPULATE)
    .sort({ viewCount: -1 })
    .limit(limit)
    .lean();
  res.status(200).json({ success: true, data: products });
});

// @desc    Get product by slug
// @route   GET /api/v1/products/:slug
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .populate('seller', 'name avatar')
    .lean();

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Increment view count
  Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } }).catch(() => {});

  res.status(200).json({ success: true, data: product });
});

// @desc    Get product by ID
// @route   GET /api/v1/products/id/:id
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate('brand')
    .populate('category')
    .lean();

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({ success: true, data: product });
});

// @desc    Get product by barcode
// @route   GET /api/v1/products/barcode/:code
export const getProductByBarcode = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ barcode: req.params.code }).lean();
  if (!product) throw new AppError('No product found with this barcode', 404);
  res.status(200).json({ success: true, data: product });
});

// @desc    Admin: Create product
// @route   POST /api/v1/products
export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = req.body;

  let slug = generateSlug(data.name);
  const existing = await Product.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const product = await Product.create({ ...data, slug });

  // Update counters
  await Category.updateOne({ _id: data.category }, { $inc: { productCount: 1 } });
  await Brand.updateOne({ _id: data.brand }, { $inc: { productCount: 1 } });

  res.status(201).json({ success: true, data: product });
});

// @desc    Admin: Update product
// @route   PUT /api/v1/products/:id
export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  const data = req.body;

  if (data.name && data.name !== product.name) {
    data.slug = generateSlug(data.name);
  }

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: data },
    { new: true, runValidators: true },
  );

  res.status(200).json({ success: true, data: updated });
});

// @desc    Admin: Delete product
// @route   DELETE /api/v1/products/:id
export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  await Product.findByIdAndUpdate(req.params.id, { isActive: false });

  await Category.updateOne({ _id: product.category }, { $inc: { productCount: -1 } });
  await Brand.updateOne({ _id: product.brand }, { $inc: { productCount: -1 } });

  res.status(200).json({ success: true, message: 'Product deactivated' });
});

// @desc    Admin: Add variant
// @route   POST /api/v1/products/:id/variants
export const addVariant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  product.variants.push(req.body);
  product.hasVariants = true;
  await product.save();

  res.status(201).json({ success: true, data: product });
});

// @desc    Admin: Update variant
// @route   PUT /api/v1/products/:id/variants/:vid
export const updateVariant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  const variant = product.variants.id(req.params.vid);
  if (!variant) throw new AppError('Variant not found', 404);

  Object.assign(variant, req.body);
  await product.save();

  res.status(200).json({ success: true, data: product });
});

// @desc    Admin: Delete variant
// @route   DELETE /api/v1/products/:id/variants/:vid
export const deleteVariant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  product.variants.pull(req.params.vid);
  if (product.variants.length === 0) product.hasVariants = false;
  await product.save();

  res.status(200).json({ success: true, data: product });
});

// @desc    Related products
// @route   GET /api/v1/products/:id/related
export const getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  const related = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: [
      { category: product.category },
      { brand: product.brand },
      { tags: { $in: product.tags.slice(0, 3) } },
    ],
  })
    .populate(DEFAULT_POPULATE)
    .limit(8)
    .lean();

  res.status(200).json({ success: true, data: related });
});

// @desc    Admin: Bulk create products
// @route   POST /api/v1/products/bulk
export const bulkCreate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const products = req.body.products;
  if (!Array.isArray(products) || products.length === 0) {
    throw new AppError('Products array is required', 400);
  }

  const created = [];
  for (const data of products) {
    let slug = generateSlug(data.name);
    const existing = await Product.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now().toString(36)}${created.length}`;
    created.push(await Product.create({ ...data, slug }));
  }

  res.status(201).json({ success: true, data: created });
});
