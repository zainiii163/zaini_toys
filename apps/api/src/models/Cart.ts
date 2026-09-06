import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem extends mongoose.Types.Subdocument {
  product: mongoose.Types.ObjectId;
  variant?: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId: string;
  items: mongoose.Types.DocumentArray<ICartItem>;
  couponCode?: string;
  couponDiscount: number;
  savedForLater: mongoose.Types.DocumentArray<ICartItem>;
  totalItems: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: Schema.Types.ObjectId },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', sparse: true },
    sessionId: { type: String, required: true },
    items: [cartItemSchema],
    couponCode: { type: String },
    couponDiscount: { type: Number, default: 0 },
    savedForLater: [cartItemSchema],
    totalItems: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

cartSchema.index({ sessionId: 1 });
cartSchema.index({ user: 1 });

export const Cart: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);
