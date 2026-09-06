import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images: { url: string; publicId: string }[];
  videos: { url: string; publicId: string }[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  helpfulBy: mongoose.Types.ObjectId[];
  reportedBy: mongoose.Types.ObjectId[];
  isApproved: boolean;
  isFeatured: boolean;
  adminReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 200 },
    comment: { type: String, required: true, maxlength: 2000 },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    videos: [
      {
        url: String,
        publicId: String,
      },
    ],
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    helpfulBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    reportedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isApproved: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    adminReply: { type: String },
  },
  { timestamps: true },
);

reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);
