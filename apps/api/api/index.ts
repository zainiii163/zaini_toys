import { RequestHandler } from 'express';
import app from '../src/app';
import { connectDB } from '../src/config/database';
import { initializeSettings } from '../src/models/Setting';

let isConnected = false;

const handler: RequestHandler = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    await initializeSettings();
    isConnected = true;
  }
  return app(req, res);
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
