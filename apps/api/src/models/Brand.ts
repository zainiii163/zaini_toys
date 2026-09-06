import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  logo: { url: string; publicId: string };
  description: string;
  website?: string;
  country: string;
  isActive: boolean;
  productCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    logo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    country: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    productCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true },
);

brandSchema.index({ slug: 1 });
brandSchema.index({ isActive: 1 });

export const Brand: Model<IBrand> = mongoose.model<IBrand>('Brand', brandSchema);
