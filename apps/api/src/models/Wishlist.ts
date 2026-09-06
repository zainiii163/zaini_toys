import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlistItem extends mongoose.Types.Subdocument {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
  priceWhenAdded: number;
}

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  products: mongoose.Types.DocumentArray<IWishlistItem>;
  isPublic: boolean;
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: 'My Wishlist' },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        addedAt: { type: Date, default: Date.now },
        priceWhenAdded: { type: Number, default: 0 },
      },
    ],
    isPublic: { type: Boolean, default: false },
    shareToken: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

wishlistSchema.index({ user: 1 });
wishlistSchema.index({ shareToken: 1 });

export const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
