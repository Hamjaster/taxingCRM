import crypto from 'crypto';
import connectDB from './mongodb';
import OTP, { IOTP } from '../models/OTP';
import { EmailOptions } from './nodemailer';

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
export async function storeOTP(email: string, otp: string, expiryMinutes: number = 1): Promise<string> {
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

/**
 * Send OTP email
 */
export async function sendOTPEmail(email: string, otp: string, type: string = 'Verification'): Promise<boolean> {
  try {
    const subject = `${type} Code - TaxingCRM`;
    const html = generateOTPEmailHTML(otp, type);
    const text = generateOTPEmailText(otp, type);
    
    const emailOptions: EmailOptions = {
      to: email,
      subject,
      html,
      text,
    };

    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailOptions),
    });

    if (!response.ok) {
      console.error('Failed to send OTP email:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

function generateOTPEmailHTML(otp: string, type: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${type} Code - TaxingCRM</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                margin-top: 20px;
                margin-bottom: 20px;
            }
            .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 2px solid #f0f0f0;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #2563eb;
                margin: 0;
                font-size: 28px;
            }
            .content {
                padding: 20px 0;
            }
            .otp-box {
                background-color: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                padding: 25px;
                margin: 25px 0;
                text-align: center;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #1e40af;
                letter-spacing: 8px;
                margin: 20px 0;
                padding: 15px;
                background-color: #dbeafe;
                border-radius: 8px;
                display: inline-block;
            }
            .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                color: #92400e;
            }
            .footer {
                text-align: center;
                padding: 20px 0;
                border-top: 2px solid #f0f0f0;
                margin-top: 30px;
                color: #6b7280;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>TaxingCRM</h1>
            </div>
            
            <div class="content">
                <h2>Your ${type} Code</h2>
                
                <div class="otp-box">
                    <h3>Use this code to ${type.toLowerCase()}:</h3>
                    <div class="otp-code">${otp}</div>
                    <p>This code will expire in 1 minute.</p>
                </div>
                
                <div class="warning">
                    <strong>Security Notice:</strong> Never share this code with anyone. TaxingCRM will never ask for your verification code.
                </div>
                
                <p>If you didn't request this code, please ignore this email or contact our support team.</p>
                
                <p>Best regards,<br>
                <strong>TaxingCRM Team</strong></p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2024 TaxingCRM. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateOTPEmailText(otp: string, type: string): string {
  return `
Your ${type} Code - TaxingCRM

Use this code to ${type.toLowerCase()}: ${otp}

This code will expire in 1 minute.

Security Notice: Never share this code with anyone. TaxingCRM will never ask for your verification code.

If you didn't request this code, please ignore this email or contact our support team.

Best regards,
TaxingCRM Team

This is an automated message. Please do not reply to this email.
© 2024 TaxingCRM. All rights reserved.
  `;
}
