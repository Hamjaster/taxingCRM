import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  firebaseUid?: string;
  lastLogin?: Date;
  // Admin specific fields
  permissions?: string[];
  department?: string;
  employeeId?: string;
  clients: string[]; // Array of client IDs
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  firebaseUid: {
    type: String,
    sparse: true,
  },
  lastLogin: {
    type: Date,
  },
  permissions: [{
    type: String,
  }],
  department: {
    type: String,
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
  },
  clients: [{
    type: Schema.Types.ObjectId,
    ref: 'Client',
  }],
}, {
  timestamps: true,
});

// Index for better query performance
AdminSchema.index({ email: 1 });
AdminSchema.index({ employeeId: 1 });

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
