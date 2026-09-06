import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFlashSale extends Document {
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  products: {
    product: mongoose.Types.ObjectId;
    salePrice: number;
    stockLimit: number;
    soldCount: number;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const flashSaleSchema = new Schema<IFlashSale>(
  {
    name: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        salePrice: { type: Number, required: true },
        stockLimit: { type: Number, default: 0 },
        soldCount: { type: Number, default: 0 },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

flashSaleSchema.index({ startTime: 1, endTime: 1 });
flashSaleSchema.index({ isActive: 1 });

export const FlashSale: Model<IFlashSale> = mongoose.model<IFlashSale>('FlashSale', flashSaleSchema);
