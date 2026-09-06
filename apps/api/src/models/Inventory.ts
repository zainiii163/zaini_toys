import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;
  variant?: mongoose.Types.ObjectId;
  warehouse: mongoose.Types.ObjectId;
  sku: string;
  barcode: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
  damagedStock: number;
  returnedStock: number;
  lowStockThreshold: number;
  batchNumber?: string;
  expiryDate?: Date;
  lastRestockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: Schema.Types.ObjectId },
    warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    sku: { type: String, required: true },
    barcode: { type: String },
    stock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },
    availableStock: { type: Number, default: 0 },
    damagedStock: { type: Number, default: 0 },
    returnedStock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    batchNumber: { type: String },
    expiryDate: { type: Date },
    lastRestockedAt: { type: Date },
  },
  { timestamps: true },
);

inventorySchema.index({ product: 1, warehouse: 1 }, { unique: true });
inventorySchema.index({ sku: 1 });
inventorySchema.index({ barcode: 1 });

export const Inventory: Model<IInventory> = mongoose.model<IInventory>('Inventory', inventorySchema);
