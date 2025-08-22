import mongoose, { Document, Schema } from 'mongoose';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Do not continue';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  category: string;
  clientId: mongoose.Types.ObjectId;
  assignedAdminId: mongoose.Types.ObjectId;
  status: TaskStatus;
  priority: TaskPriority;
  
  // Financial fields
  priceQuoted: number;
  amountPaid: number;
  remainingBalance: number;
  
  // Date fields
  dueDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  
  // Additional fields
  notes?: string;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  assignedAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Do not continue'],
    default: 'Pending',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  priceQuoted: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  remainingBalance: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  dueDate: {
    type: Date,
  },
  startDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  notes: {
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

// Indexes for better query performance
TaskSchema.index({ clientId: 1 });
TaskSchema.index({ assignedAdminId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ category: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ isActive: 1 });

// Compound indexes
TaskSchema.index({ assignedAdminId: 1, status: 1 });
TaskSchema.index({ clientId: 1, status: 1 });

// Virtual for calculating remaining balance
TaskSchema.virtual('calculatedRemainingBalance').get(function() {
  return this.priceQuoted - this.amountPaid;
});

// Pre-save middleware to auto-calculate remaining balance
TaskSchema.pre('save', function(next) {
  if (this.isModified('priceQuoted') || this.isModified('amountPaid')) {
    this.remainingBalance = this.priceQuoted - this.amountPaid;
  }
  
  // Set completion date when status changes to completed
  if (this.isModified('status') && this.status === 'Completed' && !this.completedDate) {
    this.completedDate = new Date();
  }
  
  next();
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
