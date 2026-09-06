import mongoose, { Schema, Document, Model } from 'mongoose';

export type InventoryLogType = 'in' | 'out' | 'adjustment' | 'return' | 'damaged' | 'transfer';

export interface IInventoryLog extends Document {
  inventory: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  type: InventoryLogType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  performedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const inventoryLogSchema = new Schema<IInventoryLog>(
  {
    inventory: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['in', 'out', 'adjustment', 'return', 'damaged', 'transfer'], required: true },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: { type: String, default: '' },
    reference: { type: String },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

inventoryLogSchema.index({ product: 1, createdAt: -1 });
inventoryLogSchema.index({ inventory: 1 });

export const InventoryLog: Model<IInventoryLog> = mongoose.model<IInventoryLog>('InventoryLog', inventoryLogSchema);
