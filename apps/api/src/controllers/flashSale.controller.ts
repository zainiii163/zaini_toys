import { Request, Response } from 'express';
import { FlashSale } from '../models/FlashSale';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPaginationParams, getPaginationMeta } from '@toys/utils';

// @desc    Get active flash sale(s) with products
// @route   GET /api/v1/flash-sales/active
export const getActiveFlashSale = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const active = await FlashSale.find({
    isActive: true,
    startTime: { $lte: now },
    endTime: { $gte: now },
  })
    .sort({ startTime: -1 })
    .limit(1)
    .populate('products.product', 'name slug price salePrice images availableStock brand');

  if (active.length === 0) {
    return res.status(200).json({ success: true, data: null });
  }

  res.status(200).json({ success: true, data: active[0] });
});

// @desc    Get all flash sales
// @route   GET /api/v1/flash-sales
export const getAllFlashSales = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const [sales, total] = await Promise.all([
    FlashSale.find().sort({ startTime: -1 }).skip(skip).limit(limit),
    FlashSale.countDocuments(),
  ]);
  res.status(200).json({ success: true, data: sales, pagination: getPaginationMeta(total, page, limit) });
});

// @desc    Create flash sale
// @route   POST /api/v1/flash-sales
export const createFlashSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await FlashSale.create(req.body);
  res.status(201).json({ success: true, data: sale });
});

// @desc    Update flash sale
// @route   PUT /api/v1/flash-sales/:id
export const updateFlashSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await FlashSale.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!sale) throw new AppError('Flash sale not found', 404);
  res.status(200).json({ success: true, data: sale });
});

// @desc    Delete flash sale
// @route   DELETE /api/v1/flash-sales/:id
export const deleteFlashSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await FlashSale.findByIdAndDelete(req.params.id);
  if (!sale) throw new AppError('Flash sale not found', 404);
  res.status(200).json({ success: true, message: 'Flash sale deleted' });
});

// @desc    Get active flash sale products (individual product list)
// @route   GET /api/v1/flash-sales/products
export const getFlashSaleProducts = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const sales = await FlashSale.find({
    isActive: true,
    startTime: { $lte: now },
    endTime: { $gte: now },
  })
    .populate('products.product', 'name slug price salePrice images availableStock brand');

  const products: any[] = [];
  sales.forEach((sale) => {
    sale.products.forEach((item) => {
      if (item.product) {
        products.push({
          product: item.product,
          flashSaleId: sale._id,
          salePrice: item.salePrice,
          stockLimit: item.stockLimit,
          soldCount: item.soldCount,
        });
      }
    });
  });

  res.status(200).json({ success: true, data: products });
});
