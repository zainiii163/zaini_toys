import mongoose, { Schema, Model, Document } from 'mongoose';

export type OtpPurpose = 'login' | 'verification' | 'reset';

export interface IOtp extends Document {
  phone: string;
  purpose: OtpPurpose;
  codeHash: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    phone: { type: String, required: true },
    purpose: { type: String, enum: ['login', 'verification', 'reset'], required: true },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

otpSchema.index({ phone: 1, purpose: 1 }, { unique: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp: Model<IOtp> = mongoose.model<IOtp>('Otp', otpSchema);