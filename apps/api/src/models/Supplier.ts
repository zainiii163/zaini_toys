import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  products: mongoose.Types.ObjectId[];
  balance: number;
  totalPurchases: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  rating: number;
  notes: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, default: '' },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: 'Pakistan' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    balance: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'partial'], default: 'paid' },
    rating: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

supplierSchema.index({ name: 1 });
supplierSchema.index({ isActive: 1 });

export const Supplier: Model<ISupplier> = mongoose.model<ISupplier>('Supplier', supplierSchema);
