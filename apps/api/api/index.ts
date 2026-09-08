import mongoose from 'mongoose';
import app from '../src/app';
import { initializeSettings } from '../src/models/Setting';

let cached = global as any;
if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.mongoose.conn) return cached.mongoose.conn;
  if (!cached.mongoose.promise) {
    cached.mongoose.promise = mongoose.connect(process.env.MONGODB_URI!).then((m) => m);
  }
  cached.mongoose.conn = await cached.mongoose.promise;
  try { await initializeSettings(); } catch {}
  return cached.mongoose.conn;
}

export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}

export const config = {
  api: { bodyParser: false },
};
