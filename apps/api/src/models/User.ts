import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress extends mongoose.Types.Subdocument {
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  isDefault: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface IChildProfile extends mongoose.Types.Subdocument {
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  interests: string[];
  favoriteCategories: Types.ObjectId[];
  favoriteBrands: Types.ObjectId[];
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'admin' | 'manager' | 'inventory_manager' | 'order_manager' | 'support' | 'marketing' | 'content';
  avatar: { url: string; publicId: string };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;
  addresses: mongoose.Types.DocumentArray<IAddress>;
  wishlist: Types.ObjectId[];
  childProfiles: mongoose.Types.DocumentArray<IChildProfile>;
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'vip';
  referralCode: string;
  referredBy?: Types.ObjectId;
  totalSpent: number;
  orderCount: number;
  lastLogin?: Date;
  loginHistory: { ip: string; device: string; date: Date }[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  phoneOtp?: string;
  phoneOtpExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: 'Home' },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  { _id: true },
);

const childProfileSchema = new Schema<IChildProfile>(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    interests: [{ type: String }],
    favoriteCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    favoriteBrands: [{ type: Schema.Types.ObjectId, ref: 'Brand' }],
  },
  { _id: true },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ['customer', 'admin', 'manager', 'inventory_manager', 'order_manager', 'support', 'marketing', 'content'],
      default: 'customer',
    },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    addresses: [addressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    childProfiles: [childProfileSchema],
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyTier: { type: String, enum: ['bronze', 'silver', 'gold', 'vip'], default: 'bronze' },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    totalSpent: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    lastLogin: Date,
    loginHistory: [
      {
        ip: String,
        device: String,
        date: { type: Date, default: Date.now },
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    phoneOtp: { type: String, select: false },
    phoneOtpExpire: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.password;
        delete ret.phoneOtp;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ referralCode: 1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
