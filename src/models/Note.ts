import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  _id: string;
  projectId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  isVisibleToClient: boolean;
  isInternal: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  isVisibleToClient: {
    type: Boolean,
    default: false,
  },
  isInternal: {
    type: Boolean,
    default: true,
  },
  attachments: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Indexes for better query performance
NoteSchema.index({ projectId: 1 });
NoteSchema.index({ authorId: 1 });
NoteSchema.index({ isVisibleToClient: 1 });
NoteSchema.index({ isInternal: 1 });
NoteSchema.index({ createdAt: -1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
