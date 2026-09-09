import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import morgan from 'morgan';
import { apiLimiter } from './middleware/rateLimit';
import { globalErrorHandler } from './middleware/error';
import { AppError } from './utils/AppError';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import brandRoutes from './routes/brand.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import reviewRoutes from './routes/review.routes';
import couponRoutes from './routes/coupon.routes';
import wishlistRoutes from './routes/wishlist.routes';
import searchRoutes from './routes/search.routes';
import uploadRoutes from './routes/upload.routes';
import settingRoutes from './routes/setting.routes';
import paymentRoutes from './routes/payment.routes';
import bannerRoutes from './routes/banner.routes';
import flashSaleRoutes from './routes/flashSale.routes';
import notificationRoutes from './routes/notification.routes';
import supportRoutes from './routes/support.routes';
import adminUserRoutes from './routes/adminUser.routes';
import blogRoutes from './routes/blog.routes';

const app: Application = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS
const isProd = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (isProd && origin && origin.endsWith('.vercel.app'))
      ) {
        callback(null, true);
      } else {
        callback(new AppError('Not allowed by CORS', 403));
      }
    },
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Sanitize against NoSQL injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// Request logging
if (isProd) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Global rate limiter (applied to all /api requests)
app.use('/api', apiLimiter);

// API Routes
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/brands`, brandRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);
app.use(`${API_PREFIX}/coupons`, couponRoutes);
app.use(`${API_PREFIX}/wishlist`, wishlistRoutes);
app.use(`${API_PREFIX}/search`, searchRoutes);
app.use(`${API_PREFIX}/upload`, uploadRoutes);
app.use(`${API_PREFIX}/settings`, settingRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/banners`, bannerRoutes);
app.use(`${API_PREFIX}/flash-sales`, flashSaleRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/support`, supportRoutes);
app.use(`${API_PREFIX}/blog`, blogRoutes);
app.use(`${API_PREFIX}/admin/users`, adminUserRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// 404 handler
app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
