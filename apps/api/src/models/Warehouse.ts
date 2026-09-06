import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWarehouse extends Document {
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  manager?: mongoose.Types.ObjectId;
  isActive: boolean;
  totalProducts: number;
  createdAt: Date;
  updatedAt: Date;
}

const warehouseSchema = new Schema<IWarehouse>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true },
    address: { type: String, default: '' },
    city: { type: String, required: true },
    phone: { type: String, default: '' },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    totalProducts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Warehouse: Model<IWarehouse> = mongoose.model<IWarehouse>('Warehouse', warehouseSchema);
