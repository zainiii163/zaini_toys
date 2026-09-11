import crypto from 'crypto';
import { Otp, type OtpPurpose } from '../models/Otp';

const TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

const hashCode = (code: string): string =>
  crypto.createHash('sha256').update(code).digest('hex');

const constantTimeEqual = (a: string, b: string): boolean => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
};

// Generate a cryptographically random 6-digit OTP
export const generateOtp = (): string =>
  crypto.randomInt(100000, 1000000).toString();

export const storeOtp = async (phone: string, purpose: OtpPurpose): Promise<string> => {
  const code = generateOtp();
  await Otp.findOneAndUpdate(
    { phone, purpose },
    { codeHash: hashCode(code), attempts: 0, expiresAt: new Date(Date.now() + TTL_MS) },
    { upsert: true, new: true },
  );
  return code;
};

// Verify an OTP. On success the record is consumed; on repeated failure it is
// invalidated after MAX_ATTEMPTS.
export const verifyOtpCode = async (
  phone: string,
  purpose: OtpPurpose,
  code: string,
): Promise<boolean> => {
  const record = await Otp.findOne({ phone, purpose });
  if (!record) return false;

  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    return false;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await record.deleteOne();
    return false;
  }

  if (!constantTimeEqual(hashCode(code), record.codeHash)) {
    record.attempts += 1;
    await record.save();
    return false;
  }

  await record.deleteOne();
  return true;
};

export const invalidateOtp = async (phone: string, purpose: OtpPurpose): Promise<void> => {
  await Otp.deleteOne({ phone, purpose });
};