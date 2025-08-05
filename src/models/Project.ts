import mongoose, { Document, Schema } from 'mongoose';

export type ProjectStatus = 'Info Received' | 'In Progress' | 'Waiting' | 'Completed';

export interface IProject extends Document {
  _id: string;
  name: string;
  description?: string;
  clientId: mongoose.Types.ObjectId;
  assignedAdminId: mongoose.Types.ObjectId;
  status: ProjectStatus;
  serviceTypes: mongoose.Types.ObjectId[];
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedAdminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Info Received', 'In Progress', 'Waiting', 'Completed'],
    default: 'Info Received',
  },
  serviceTypes: [{
    type: Schema.Types.ObjectId,
    ref: 'ServiceType',
  }],
  startDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
ProjectSchema.index({ clientId: 1 });
ProjectSchema.index({ assignedAdminId: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ priority: 1 });
ProjectSchema.index({ isActive: 1 });
ProjectSchema.index({ createdAt: -1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
