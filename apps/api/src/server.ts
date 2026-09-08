import { env, connectDB } from './config/database';
import { initializeSettings } from './models/Setting';
import app from './app';

const PORT = Number(env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    try { await initializeSettings(); } catch {}
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION:', err.name, err.message);
});

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION:', err.name, err.message);
});

startServer();
