import mongoose, { Schema, Document, Model } from 'mongoose';

export type CouponType = 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';

export interface ICoupon extends Document {
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minimumOrder: number;
  maximumDiscount?: number;

  applicableTo: 'all' | 'products' | 'categories' | 'brands';
  products?: mongoose.Types.ObjectId[];
  categories?: mongoose.Types.ObjectId[];
  brands?: mongoose.Types.ObjectId[];

  buyQuantity?: number;
  getQuantity?: number;

  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;

  startDate: Date;
  endDate: Date;
  isActive: boolean;

  firstOrderOnly: boolean;
  birthdayCoupon: boolean;

  usedBy: { user: mongoose.Types.ObjectId; count: number }[];

  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, uppercase: true, unique: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'], required: true },
    value: { type: Number, required: true, default: 0 },
    minimumOrder: { type: Number, default: 0 },
    maximumDiscount: { type: Number },

    applicableTo: { type: String, enum: ['all', 'products', 'categories', 'brands'], default: 'all' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    brands: [{ type: Schema.Types.ObjectId, ref: 'Brand' }],

    buyQuantity: { type: Number },
    getQuantity: { type: Number },

    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },

    firstOrderOnly: { type: Boolean, default: false },
    birthdayCoupon: { type: Boolean, default: false },

    usedBy: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true },
);

couponSchema.index({ code: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });
couponSchema.index({ isActive: 1 });

export const Coupon: Model<ICoupon> = mongoose.model<ICoupon>('Coupon', couponSchema);
