import { env, connectDB } from './config/database';
import { initializeSettings } from './models/Setting';
import app from './app';

const PORT = Number(env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await initializeSettings();

    const server = app.listen(PORT, () => {
      console.log(`✅ API Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = (signal: string): void => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled rejections and exceptions
    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err: Error) => {
      console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
