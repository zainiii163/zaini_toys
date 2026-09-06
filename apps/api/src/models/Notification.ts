import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'order' | 'promotion' | 'system' | 'price_drop' | 'back_in_stock';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app';
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['order', 'promotion', 'system', 'price_drop', 'back_in_stock'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    channel: { type: String, enum: ['email', 'sms', 'whatsapp', 'push', 'in_app'], default: 'in_app' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

export const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);
