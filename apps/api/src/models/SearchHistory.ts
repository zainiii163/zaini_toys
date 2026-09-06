import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchHistory extends Document {
  user: mongoose.Types.ObjectId;
  query: string;
  count: number;
  results?: number;
  createdAt: Date;
  updatedAt: Date;
}

const searchHistorySchema = new Schema<ISearchHistory>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    query: { type: String, required: true, trim: true, index: true },
    count: { type: Number, default: 1 },
    results: { type: Number },
  },
  { timestamps: true },
);

searchHistorySchema.index({ user: 1, query: 1 }, { unique: true });

export const SearchHistory = mongoose.model<ISearchHistory>('SearchHistory', searchHistorySchema);
