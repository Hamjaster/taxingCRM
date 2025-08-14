import crypto from 'crypto';

// OTP storage interface
export interface OTPData {
  otp: string;
  email: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

// In-memory storage for OTPs (in production, use Redis or database)
const otpStorage = new Map<string, OTPData>();

// Clean up expired OTPs periodically
setInterval(() => {
  const now = new Date();
  for (const [key, data] of otpStorage.entries()) {
    if (data.expiresAt < now) {
      otpStorage.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Store OTP with expiration time and attempt tracking
 */
export function storeOTP(email: string, otp: string, expiryMinutes: number = 10): string {
  const key = `otp_${email}`;
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);
  
  const otpData: OTPData = {
    otp,
    email,
    expiresAt,
    attempts: 0,
    maxAttempts: 3,
  };
  
  otpStorage.set(key, otpData);
  return key;
}

/**
 * Verify OTP and handle attempt tracking
 */
export function verifyOTP(email: string, providedOTP: string): {
  isValid: boolean;
  message: string;
  attemptsLeft?: number;
} {
  const key = `otp_${email}`;
  const otpData = otpStorage.get(key);
  
  if (!otpData) {
    return {
      isValid: false,
      message: 'No OTP found for this email. Please request a new code.',
    };
  }
  
  // Check if OTP has expired
  if (new Date() > otpData.expiresAt) {
    otpStorage.delete(key);
    return {
      isValid: false,
      message: 'OTP has expired. Please request a new code.',
    };
  }
  
  // Increment attempts
  otpData.attempts++;
  
  // Check if max attempts exceeded
  if (otpData.attempts > otpData.maxAttempts) {
    otpStorage.delete(key);
    return {
      isValid: false,
      message: 'Maximum verification attempts exceeded. Please request a new code.',
    };
  }
  
  // Verify OTP
  if (otpData.otp === providedOTP) {
    otpStorage.delete(key); // Remove OTP after successful verification
    return {
      isValid: true,
      message: 'OTP verified successfully.',
    };
  }
  
  // Update attempts in storage
  otpStorage.set(key, otpData);
  
  const attemptsLeft = otpData.maxAttempts - otpData.attempts;
  return {
    isValid: false,
    message: `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`,
    attemptsLeft,
  };
}

/**
 * Check if an OTP exists for an email
 */
export function hasActiveOTP(email: string): boolean {
  const key = `otp_${email}`;
  const otpData = otpStorage.get(key);
  
  if (!otpData) return false;
  
  // Check if expired
  if (new Date() > otpData.expiresAt) {
    otpStorage.delete(key);
    return false;
  }
  
  return true;
}

/**
 * Get remaining time for OTP in minutes
 */
export function getOTPRemainingTime(email: string): number {
  const key = `otp_${email}`;
  const otpData = otpStorage.get(key);
  
  if (!otpData) return 0;
  
  const now = new Date();
  if (now > otpData.expiresAt) {
    otpStorage.delete(key);
    return 0;
  }
  
  const remainingMs = otpData.expiresAt.getTime() - now.getTime();
  return Math.ceil(remainingMs / (1000 * 60)); // Convert to minutes
}

/**
 * Clear OTP for an email (useful for cleanup)
 */
export function clearOTP(email: string): void {
  const key = `otp_${email}`;
  otpStorage.delete(key);
}

/**
 * Get OTP attempts remaining
 */
export function getOTPAttemptsRemaining(email: string): number {
  const key = `otp_${email}`;
  const otpData = otpStorage.get(key);
  
  if (!otpData) return 0;
  
  return Math.max(0, otpData.maxAttempts - otpData.attempts);
}
