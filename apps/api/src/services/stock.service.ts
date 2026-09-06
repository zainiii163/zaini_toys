import { Product } from '../models/Product';
import { AppError } from '../utils/AppError';

export interface ReservedItem {
  productId: string;
  variantId?: string;
  quantity: number;
  productName: string;
}

export const reserveStock = async (
  items: { productId: string; variantId?: string; quantity: number; productName: string }[],
): Promise<void> => {
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new AppError(`Product not found: ${item.productName}`, 404);

    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      if (!variant) throw new AppError(`Variant not found for ${item.productName}`, 404);
      if (variant.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.productName} (${item.variantId})`, 400);
      }
      variant.stock -= item.quantity;
    } else {
      if (product.availableStock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.productName}. Only ${product.availableStock} left.`, 400);
      }
      product.stock -= item.quantity;
      product.reservedStock += item.quantity;
    }

    product.totalSold += item.quantity;
    await product.save();
  }
};

export const releaseStock = async (
  items: { productId: string; variantId?: string; quantity: number }[],
): Promise<void> => {
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      if (variant) variant.stock += item.quantity;
    } else {
      product.stock += item.quantity;
      product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
    }
    product.totalSold = Math.max(0, product.totalSold - item.quantity);
    await product.save();
  }
};

export const commitReservedStock = async (
  items: { productId: string; variantId?: string; quantity: number }[],
): Promise<void> => {
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    if (!item.variantId) {
      const reserved = Math.min(product.reservedStock, item.quantity);
      product.reservedStock -= reserved;
    }
    // Note: totalSold already incremented on reserve
    await product.save();
  }
};
