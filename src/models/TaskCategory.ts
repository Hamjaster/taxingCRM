import mongoose, { Document, Schema } from 'mongoose';

export interface ITaskCategory extends Document {
  _id: string;
  name: string;
  description?: string;
  createdByAdminId: mongoose.Types.ObjectId;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskCategorySchema = new Schema<ITaskCategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdByAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
TaskCategorySchema.index({ name: 1 });
TaskCategorySchema.index({ isActive: 1 });
TaskCategorySchema.index({ isDefault: 1 });
TaskCategorySchema.index({ createdByAdminId: 1 });

export default mongoose.models.TaskCategory || mongoose.model<ITaskCategory>('TaskCategory', TaskCategorySchema);
