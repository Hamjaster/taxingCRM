import mongoose, { Document, Schema } from 'mongoose';

export interface IFolder extends Document {
  _id: string;
  name: string;
  clientId: mongoose.Types.ObjectId;
  assignedAdminId: mongoose.Types.ObjectId;
  description?: string;
  parentFolderId?: mongoose.Types.ObjectId; // For nested folders (future enhancement)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>({
  name: {
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
  description: {
    type: String,
    trim: true,
  },
  parentFolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
FolderSchema.index({ clientId: 1 });
FolderSchema.index({ assignedAdminId: 1 });
FolderSchema.index({ parentFolderId: 1 });
FolderSchema.index({ name: 1, clientId: 1 }); // Compound index for folder name uniqueness per client

// Ensure folder names are unique per client
FolderSchema.index({ name: 1, clientId: 1, parentFolderId: 1 }, { unique: true });

const Folder = mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema);

export default Folder;
