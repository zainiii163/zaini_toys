import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: Record<string, unknown>;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const defaultSettings: Record<string, unknown> = {
  store: {
    name: 'Toy Shop',
    logo: { url: '', publicId: '' },
    tagline: '',
    description: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    address: '',
    city: '',
    currency: 'PKR',
    language: 'en',
    timezone: 'Asia/Karachi',
  },
  social: {
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    twitter: '',
    linkedin: '',
  },
  shipping: {
    enabled: true,
    methods: {
      standard: { enabled: true, cost: 200, minOrderForFree: 3000, deliveryDays: '3-5' },
      express: { enabled: true, cost: 500, minOrderForFree: 0, deliveryDays: '1-2' },
      same_day: { enabled: false, cost: 800, minOrderForFree: 0, deliveryDays: 'same day' },
    },
    zones: [
      { name: 'Karachi', cities: ['Karachi'], costMultiplier: 1 },
      { name: 'Lahore', cities: ['Lahore'], costMultiplier: 1 },
      { name: 'Rest of Pakistan', cities: [], costMultiplier: 1.2 },
    ],
  },
  payment: {
    cod: { enabled: true },
    card: { enabled: false, provider: 'safepay' },
    jazzcash: { enabled: false },
    easypaisa: { enabled: false },
    raast: { enabled: false },
  },
  tax: {
    enabled: true,
    rate: 0,
    included: false,
  },
  emailSettings: {
    from: '',
    templates: {
      welcome: {},
      order_confirmation: {},
      shipping: {},
    },
  },
  seo: {
    defaultTitle: 'Toy Shop - Best Toys in Pakistan',
    defaultDescription: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
  },
  notification: {
    email: { orderConfirmation: true, shippingUpdate: true, reviewRequest: true, abandonedCart: true },
    sms: { otp: true, orderConfirmation: true },
    whatsapp: { orderConfirmation: false, tracking: false },
  },
};

export const initializeSettings = async (): Promise<void> => {
  for (const [key, value] of Object.entries(defaultSettings)) {
    const exists = await Setting.findOne({ key });
    if (!exists) {
      await Setting.create({ key, value });
    }
  }
};

export const Setting: Model<ISetting> = mongoose.model<ISetting>('Setting', settingSchema);
