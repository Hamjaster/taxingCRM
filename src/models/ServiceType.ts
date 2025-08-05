import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceType extends Document {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceTypeSchema = new Schema<IServiceType>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
ServiceTypeSchema.index({ name: 1 });
ServiceTypeSchema.index({ isActive: 1 });

export default mongoose.models.ServiceType || mongoose.model<IServiceType>('ServiceType', ServiceTypeSchema);
