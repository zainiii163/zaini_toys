import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPurchaseOrder extends Document {
  poNumber: string;
  supplier: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'ordered' | 'shipped' | 'received' | 'cancelled';
  expectedDelivery?: Date;
  receivedDate?: Date;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paidAmount: number;
  notes: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    poNumber: { type: String, required: true, unique: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['pending', 'ordered', 'shipped', 'received', 'cancelled'], default: 'pending' },
    expectedDelivery: { type: Date },
    receivedDate: { type: Date },
    paymentStatus: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
    paidAmount: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

purchaseOrderSchema.index({ supplier: 1 });
purchaseOrderSchema.index({ poNumber: 1 });

export const PurchaseOrder: Model<IPurchaseOrder> = mongoose.model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema);
