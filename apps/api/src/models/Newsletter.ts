import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  name?: string;
  isSubscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    isSubscribed: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: Date,
    source: { type: String, default: 'website' },
  },
  { timestamps: true },
);

newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isSubscribed: 1 });

export const Newsletter: Model<INewsletter> = mongoose.model<INewsletter>('Newsletter', newsletterSchema);
