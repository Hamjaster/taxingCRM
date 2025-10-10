import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  type: string;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true, // Index for faster queries
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'LOGIN'],
    default: 'EMAIL_VERIFICATION',
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // MongoDB TTL index for automatic cleanup
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxAttempts: {
    type: Number,
    default: 3,
    min: 1,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Ensure only one active OTP per email and type combination
OTPSchema.index({ email: 1, type: 1 }, { unique: true });

// Create the model
const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;
