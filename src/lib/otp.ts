import crypto from 'crypto';
import connectDB from './mongodb';
import OTP, { IOTP } from '../models/OTP';

// OTP storage interface for backward compatibility
export interface OTPData {
  otp: string;
  email: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Store OTP with expiration time and attempt tracking
 */
export async function storeOTP(email: string, otp: string, expiryMinutes: number = 10): Promise<string> {
  await connectDB();
  
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);
  
  // Remove any existing OTP for this email first
  await OTP.deleteOne({ email: email.toLowerCase() });
  
  // Create new OTP record
  const otpRecord = new OTP({
    email: email.toLowerCase(),
    otp,
    expiresAt,
    attempts: 0,
    maxAttempts: 3,
  });
  
  await otpRecord.save();
  return `otp_${email}`;
}

/**
 * Verify OTP and handle attempt tracking
 */
export async function verifyOTP(email: string, providedOTP: string): Promise<{
  isValid: boolean;
  message: string;
  attemptsLeft?: number;
}> {
  await connectDB();
  
  const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
  
  if (!otpRecord) {
    return {
      isValid: false,
      message: 'No OTP found for this email. Please request a new code.',
    };
  }
  
  // Check if OTP has expired
  if (new Date() > otpRecord.expiresAt) {
    await OTP.deleteOne({ email: email.toLowerCase() });
    return {
      isValid: false,
      message: 'OTP has expired. Please request a new code.',
    };
  }
  
  // Increment attempts
  otpRecord.attempts++;
  
  // Check if max attempts exceeded
  if (otpRecord.attempts > otpRecord.maxAttempts) {
    await OTP.deleteOne({ email: email.toLowerCase() });
    return {
      isValid: false,
      message: 'Maximum verification attempts exceeded. Please request a new code.',
    };
  }
  
  // Verify OTP
  if (otpRecord.otp === providedOTP) {
    await OTP.deleteOne({ email: email.toLowerCase() }); // Remove OTP after successful verification
    return {
      isValid: true,
      message: 'OTP verified successfully.',
    };
  }
  
  // Update attempts in database
  await otpRecord.save();
  
  const attemptsLeft = otpRecord.maxAttempts - otpRecord.attempts;
  return {
    isValid: false,
    message: `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`,
    attemptsLeft,
  };
}

/**
 * Check if an OTP exists for an email
 */
export async function hasActiveOTP(email: string): Promise<boolean> {
  await connectDB();
  
  const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
  
  if (!otpRecord) return false;
  
  // Check if expired
  if (new Date() > otpRecord.expiresAt) {
    await OTP.deleteOne({ email: email.toLowerCase() });
    return false;
  }
  
  return true;
}

/**
 * Get remaining time for OTP in minutes
 */
export async function getOTPRemainingTime(email: string): Promise<number> {
  await connectDB();
  
  const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
  
  if (!otpRecord) return 0;
  
  const now = new Date();
  if (now > otpRecord.expiresAt) {
    await OTP.deleteOne({ email: email.toLowerCase() });
    return 0;
  }
  
  const remainingMs = otpRecord.expiresAt.getTime() - now.getTime();
  return Math.ceil(remainingMs / (1000 * 60)); // Convert to minutes
}

/**
 * Clear OTP for an email (useful for cleanup)
 */
export async function clearOTP(email: string): Promise<void> {
  await connectDB();
  await OTP.deleteOne({ email: email.toLowerCase() });
}

/**
 * Get OTP attempts remaining
 */
export async function getOTPAttemptsRemaining(email: string): Promise<number> {
  await connectDB();
  
  const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
  
  if (!otpRecord) return 0;
  
  return Math.max(0, otpRecord.maxAttempts - otpRecord.attempts);
}

/**
 * Manual cleanup of expired OTPs (optional, as MongoDB TTL handles this automatically)
 */
export async function cleanupExpiredOTPs(): Promise<number> {
  await connectDB();
  
  const result = await OTP.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  
  return result.deletedCount || 0;
}
