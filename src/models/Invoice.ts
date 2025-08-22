import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
  _id: string;
  invoiceNumber: string;
  clientId: mongoose.Types.ObjectId;
  assignedAdminId: mongoose.Types.ObjectId;
  
  // Invoice details
  issueDate: Date;
  dueDate: Date;
  serviceName: string;
  serviceDescription?: string;
  
  totalAmount: number;

  // Status and metadata
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

 
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
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
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Invoice details
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
    trim: true,
  },
  serviceDescription: {
    type: String,
    trim: true,
  },
  
  
  // Status and metadata
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Draft',
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
InvoiceSchema.index({ clientId: 1 });
InvoiceSchema.index({ assignedAdminId: 1 });
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ issueDate: -1 });
InvoiceSchema.index({ dueDate: 1 });


const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
