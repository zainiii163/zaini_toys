import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refund_requested'
  | 'refunded'
  | 'failed';

export type PaymentMethod = 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'raast';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productImage: string;
  variant?: mongoose.Types.ObjectId;
  variantName?: string;
  sku: string;
  quantity: number;
  price: number;
  salePrice?: number;
  total: number;
}

export interface IOrderAddress {
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  postalCode?: string;
}

export interface IOrder extends Document {
  orderNumber: string;

  customer: mongoose.Types.ObjectId;
  customerInfo: { name: string; email: string; phone: string };
  isGuestOrder: boolean;

  items: IOrderItem[];

  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  shippingCost: number;
  tax: number;
  total: number;
  loyaltyPointsEarned: number;
  loyaltyPointsRedeemed: number;

  shippingAddress: IOrderAddress;
  shippingMethod: 'standard' | 'express' | 'same_day';
  estimatedDelivery: Date;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentDetails?: Record<string, unknown>;

  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: Date; note?: string; updatedBy?: mongoose.Types.ObjectId }[];

  trackingNumber?: string;
  courierService?: string;
  deliveredAt?: Date;

  returnReason?: string;
  returnImages?: { url: string; publicId: string }[];
  refundAmount?: number;
  refundDate?: Date;
  refundTransactionId?: string;

  isGift: boolean;
  giftMessage?: string;
  giftWrapping: boolean;
  recipientName?: string;
  recipientAddress?: IOrderAddress;

  cancelReason?: string;
  cancelledAt?: Date;

  customerNotes?: string;
  adminNotes?: string;

  riskScore: number;
  ipAddress: string;
  userAgent: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productImage: { type: String, default: '' },
    variant: { type: Schema.Types.ObjectId },
    variantName: { type: String },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    total: { type: Number, required: true },
  },
  { _id: true },
);

const addressSchema = new Schema<IOrderAddress>(
  {
    label: { type: String, default: 'Home' },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, default: '' },
    postalCode: { type: String, default: '' },
  },
  { _id: false },
);

const statusHistorySchema = new Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },

    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String },
    },
    isGuestOrder: { type: Boolean, default: false },

    items: [orderItemSchema],

    subtotal: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    couponDiscount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    loyaltyPointsEarned: { type: Number, default: 0 },
    loyaltyPointsRedeemed: { type: Number, default: 0 },

    shippingAddress: { type: addressSchema, required: true },
    shippingMethod: { type: String, enum: ['standard', 'express', 'same_day'], default: 'standard' },
    estimatedDelivery: { type: Date },

    paymentMethod: { type: String, enum: ['cod', 'card', 'jazzcash', 'easypaisa', 'raast'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'partial_refund'], default: 'pending' },
    paymentId: { type: String },
    paymentDetails: { type: Schema.Types.Mixed },

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
        'refund_requested',
        'refunded',
        'failed',
      ],
      default: 'pending',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],

    trackingNumber: { type: String },
    courierService: { type: String },
    deliveredAt: { type: Date },

    returnReason: { type: String },
    returnImages: [
      {
        url: String,
        publicId: String,
      },
    ],
    refundAmount: { type: Number },
    refundDate: { type: Date },
    refundTransactionId: { type: String },

    isGift: { type: Boolean, default: false },
    giftMessage: { type: String },
    giftWrapping: { type: Boolean, default: false },
    recipientName: { type: String },
    recipientAddress: { type: addressSchema },

    cancelReason: { type: String },
    cancelledAt: { type: Date },

    customerNotes: { type: String },
    adminNotes: { type: String },

    riskScore: { type: Number, default: 0 },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true },
);

orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ createdAt: -1 });

export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);
