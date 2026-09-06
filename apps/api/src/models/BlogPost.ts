import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: { url: string; publicId: string };
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  viewCount: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    featuredImage: {
      url: String,
      publicId: String,
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, default: 'Guides' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    viewCount: { type: Number, default: 0 },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true },
);

blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });

export const BlogPost: Model<IBlogPost> = mongoose.model<IBlogPost>('BlogPost', blogSchema);
