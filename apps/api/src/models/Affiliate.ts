import mongoose, { Schema, Document, Model } from 'mongoose';

export type AffiliateStatus = 'pending' | 'active' | 'suspended';

export interface IAffiliate extends Document {
  user: mongoose.Types.ObjectId;
  referralCode: string;
  commissionRate: number;
  status: AffiliateStatus;
  totalClicks: number;
  totalSales: number;
  totalEarnings: number;
  totalPayouts: number;
  balance: number;
  paymentMethod: string;
  paymentDetails: Record<string, unknown>;
  appliedAt: Date;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const affiliateSchema = new Schema<IAffiliate>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referralCode: { type: String, required: true, unique: true },
    commissionRate: { type: Number, default: 5 },
    status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
    totalClicks: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalPayouts: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    paymentMethod: { type: String, default: '' },
    paymentDetails: { type: Schema.Types.Mixed, default: {} },
    appliedAt: { type: Date, default: Date.now },
    approvedAt: Date,
  },
  { timestamps: true },
);

affiliateSchema.index({ user: 1 });
affiliateSchema.index({ referralCode: 1 });

export const Affiliate: Model<IAffiliate> = mongoose.model<IAffiliate>('Affiliate', affiliateSchema);
