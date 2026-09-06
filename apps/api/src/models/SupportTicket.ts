import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITicketMessage extends mongoose.Types.Subdocument {
  sender: mongoose.Types.ObjectId;
  message: string;
  attachments?: { url: string; publicId: string }[];
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  ticketNumber: string;
  user: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  category: 'order' | 'refund' | 'product' | 'shipping' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: mongoose.Types.ObjectId;
  messages: mongoose.Types.DocumentArray<ITicketMessage>;
  createdAt: Date;
  updatedAt: Date;
}

const ticketMessageSchema = new Schema<ITicketMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    attachments: [
      {
        url: String,
        publicId: String,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, enum: ['order', 'refund', 'product', 'shipping', 'other'], default: 'other' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: [ticketMessageSchema],
  },
  { timestamps: true },
);

supportTicketSchema.index({ user: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ ticketNumber: 1 });

export const SupportTicket: Model<ISupportTicket> = mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
