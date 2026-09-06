import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: { url: string; publicId: string };
  mobileImage?: { url: string; publicId: string };
  link?: string;
  linkType: 'product' | 'category' | 'brand' | 'custom';
  position: 'hero' | 'mid' | 'sidebar' | 'footer';
  sortOrder: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    mobileImage: {
      url: String,
      publicId: String,
    },
    link: { type: String },
    linkType: { type: String, enum: ['product', 'category', 'brand', 'custom'], default: 'custom' },
    position: { type: String, enum: ['hero', 'mid', 'sidebar', 'footer'], default: 'hero' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true },
);

export const Banner: Model<IBanner> = mongoose.model<IBanner>('Banner', bannerSchema);
