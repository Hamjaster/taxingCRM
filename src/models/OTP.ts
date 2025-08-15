import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
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
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // MongoDB TTL index for automatic cleanup
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

// Ensure only one active OTP per email
OTPSchema.index({ email: 1 }, { unique: true });

// Create the model
const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;
