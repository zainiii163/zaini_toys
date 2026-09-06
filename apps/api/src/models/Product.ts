import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ImageAsset {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IProductVariant extends mongoose.Types.Subdocument {
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: ImageAsset[];
  attributes: { name: string; value: string }[];
  isActive: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  description: string;
  shortDescription: string;

  price: number;
  salePrice?: number;
  costPrice: number;
  profitMargin: number;

  images: (ImageAsset & { isPrimary?: boolean })[];
  videos: (ImageAsset & { title?: string })[];
  model360?: ImageAsset;

  brand: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  ageRange: { min: number; max: number };
  recommendedAge: number;
  gender: 'unisex' | 'male' | 'female';

  material: string[];
  color: string[];
  size: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };

  educationalBenefits: string[];
  skillDevelopment: string[];
  safetyWarnings: string[];
  chokingHazardWarning: boolean;
  batteryRequired: boolean;
  batteryType?: string;
  certificationInfo?: string;

  manufacturer: string;
  countryOfOrigin: string;
  warranty?: string;
  whatsIncluded: string[];
  assemblyRequired: boolean;
  assemblyInfo?: string;

  stock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  trackInventory: boolean;

  hasVariants: boolean;
  variants: mongoose.Types.DocumentArray<IProductVariant>;

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];

  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  viewCount: number;

  seller?: mongoose.Types.ObjectId;
  commission?: number;

  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    barcode: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stock: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    attributes: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { _id: true },
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String, sparse: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },

    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    costPrice: { type: Number, default: 0, min: 0 },
    profitMargin: { type: Number, default: 0 },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    videos: [
      {
        url: { type: String },
        publicId: { type: String },
        title: { type: String },
      },
    ],
    model360: {
      url: String,
      publicId: String,
    },

    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    ageRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 99 },
    },
    recommendedAge: { type: Number, default: 0 },
    gender: { type: String, enum: ['unisex', 'male', 'female'], default: 'unisex' },

    material: [{ type: String }],
    color: [{ type: String }],
    size: { type: String, default: '' },
    weight: { type: Number },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    educationalBenefits: [{ type: String }],
    skillDevelopment: [{ type: String }],
    safetyWarnings: [{ type: String }],
    chokingHazardWarning: { type: Boolean, default: false },
    batteryRequired: { type: Boolean, default: false },
    batteryType: { type: String },
    certificationInfo: { type: String },

    manufacturer: { type: String, default: '' },
    countryOfOrigin: { type: String, default: '' },
    warranty: { type: String },
    whatsIncluded: [{ type: String }],
    assemblyRequired: { type: Boolean, default: false },
    assemblyInfo: { type: String },

    stock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },
    availableStock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    trackInventory: { type: Boolean, default: true },

    hasVariants: { type: Boolean, default: false },
    variants: [variantSchema],

    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    seoKeywords: [{ type: String }],

    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },

    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    commission: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.pre('save', function (next) {
  if (this.isModified('price') || this.isModified('salePrice')) {
    this.profitMargin = this.price > 0 ? ((this.price - this.costPrice) / this.price) * 100 : 0;
  }
  this.availableStock = Math.max(0, this.stock - this.reservedStock);
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ageRange.min': 1, 'ageRange.max': 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ barcode: 1 });

export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
