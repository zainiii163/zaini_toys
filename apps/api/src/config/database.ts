import mongoose from 'mongoose';
import { validateEnv, type Env } from '@toys/config';
import dotenv from 'dotenv';

dotenv.config();

export const env: Env = validateEnv(process.env as NodeJS.ProcessEnv);

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
