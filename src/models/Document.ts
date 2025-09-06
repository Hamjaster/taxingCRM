import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';

export interface IDocument extends MongooseDocument {
  _id: string;
  name: string;
  originalName: string;
  fileType: string;
  mimeType: string;
  size: number; // File size in bytes
  s3Key: string; // S3 object key
  s3Url: string; // S3 URL for accessing the file
  folderId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  uploadedByAdminId: mongoose.Types.ObjectId;
  description?: string;
  tags?: string[];
  
  // File metadata
  fileExtension: string;
  isPublic: boolean;
  downloadCount: number;
  
  // S3 specific fields
  s3Bucket: string;
  s3ETag?: string;
  s3VersionId?: string;
  
  // Access control
  isActive: boolean;
  expiresAt?: Date; // For temporary files
  
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  originalName: {
    type: String,
    required: true,
    trim: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'doc', 'docx', 'image', 'txt', 'xlsx', 'xls', 'other'],
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
    min: 0,
  },
  s3Key: {
    type: String,
    required: true,
    unique: true,
  },
  s3Url: {
    type: String,
    required: true,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  uploadedByAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  
  // File metadata
  fileExtension: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // S3 specific fields
  s3Bucket: {
    type: String,
    required: true,
  },
  s3ETag: {
    type: String,
  },
  s3VersionId: {
    type: String,
  },
  
  // Access control
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
DocumentSchema.index({ folderId: 1 });
DocumentSchema.index({ clientId: 1 });
DocumentSchema.index({ uploadedByAdminId: 1 });
DocumentSchema.index({ s3Key: 1 });
DocumentSchema.index({ fileType: 1 });
DocumentSchema.index({ createdAt: -1 });
DocumentSchema.index({ name: 1, folderId: 1 }); // For searching documents within folders
DocumentSchema.index({ tags: 1 }); // For tag-based searches
DocumentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic cleanup

// Pre-save middleware to set file type based on extension
DocumentSchema.pre('save', function(next) {
  if (!this.fileExtension && this.originalName) {
    this.fileExtension = this.originalName.split('.').pop()?.toLowerCase() || '';
  }
  
  // Set file type based on extension
  if (!this.fileType || this.fileType === 'other') {
    const extension = this.fileExtension.toLowerCase();
    
    if (['pdf'].includes(extension)) {
      this.fileType = 'pdf';
    } else if (['doc', 'docx'].includes(extension)) {
      this.fileType = 'doc';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
      this.fileType = 'image';
    } else if (['txt'].includes(extension)) {
      this.fileType = 'txt';
    } else if (['xlsx', 'xls'].includes(extension)) {
      this.fileType = 'xlsx';
    } else {
      this.fileType = 'other';
    }
  }
  
  next();
});

// Method to increment download count
DocumentSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  return this.save();
};

// Method to generate signed URL (will be implemented in service layer)
DocumentSchema.methods.getSignedUrl = function(expiresIn = 3600) {
  // This will be implemented in the service layer with AWS SDK
  return this.s3Url;
};

const DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;
