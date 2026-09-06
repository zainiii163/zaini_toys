import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.preprocess((val) => Number(val), z.number().default(5000)),

  MONGODB_URI: z.string().min(1),

  JWT_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_EXPIRE: z.string().default('15m'),
  JWT_REFRESH_EXPIRE: z.string().default('7d'),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  SAFEPAY_SECRET_KEY: z.string().optional(),
  SAFEPAY_MERCHANT_ID: z.string().optional(),
  SAFEPAY_BASE_URL: z.string().optional(),

  JAZZCASH_MERCHANT_ID: z.string().optional(),
  JAZZCASH_PASSWORD: z.string().optional(),
  JAZZCASH_RETURN_URL: z.string().optional(),
  JAZZCASH_BASE_URL: z.string().optional(),

  EASYPAISA_STORE_ID: z.string().optional(),
  EASYPAISA_API_KEY: z.string().optional(),

  RAAST_MERCHANT_ID: z.string().optional(),

  OPENAI_API_KEY: z.string().optional(),

  CUSTOMER_URL: z.string().default('http://localhost:5173'),
  ADMIN_URL: z.string().default('http://localhost:5174'),
  API_URL: z.string().default('http://localhost:5000'),

  COOKIE_DOMAIN: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: NodeJS.ProcessEnv): Env {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  return parsed.data;
}
