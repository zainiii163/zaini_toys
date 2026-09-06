import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image: { url: string; publicId: string };
  icon?: string;
  parent?: mongoose.Types.ObjectId;
  level: number;
  ageGroups: string[];
  sortOrder: number;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    icon: { type: String, default: '' },
    parent: { type: Schema.Types.ObjectId, ref: 'Category' },
    level: { type: Number, default: 0 },
    ageGroups: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

categorySchema.index({ parent: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, sortOrder: 1 });

export const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);
