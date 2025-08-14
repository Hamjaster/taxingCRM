import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
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
  assignedAdminId: string; // Reference to assigned admin
  
  // Client specific fields
  clientType: "Individual" | "Business" | "Entity";
  status: "Active" | "Inactive";
  
  // Basic contact info
  ssn?: string;
  address?: string;
  avatar?: string;

  // Individual specific fields
  mi?: string;
  dateOfBirth?: string;
  profileImage?: string;

  // Spouse information
  spouse?: string;
  spouseFirstName?: string;
  spouseMi?: string;
  spouseLastName?: string;
  spouseDateOfBirth?: string;
  spouseSsn?: string;
  spousePhoneNo?: string;
  spouseEmail?: string;

  // Dependents
  dependents?: Array<{
    firstName: string;
    mi: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
    phoneNo: string;
    email: string;
  }>;

  // Business specific fields
  businessName?: string;
  ein?: string;
  entityStructure?: string;
  dateBusinessFormed?: string;
  sElectionEffectiveDate?: string;
  noOfShareholders?: string;
  shareholders?: Array<{
    ownership: string;
    firstName: string;
    mi: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
    phoneNo: string;
    email: string;
  }>;

  // Entity specific fields
  entityName?: string;
  publicationCountry?: string;
  entityEin?: string;
  entityPhoneNo?: string;
  entityEmailAddress?: string;
  entityAddress?: string;

  // Entity owner info
  ownerFirstName?: string;
  ownerMi?: string;
  ownerLastName?: string;
  ownerDateOfBirth?: string;
  ownerSsn?: string;

  // Entity services and details
  servicesToProvide?: string[];
  serviceOfProcessName?: string;
  serviceOfProcessAddress?: string;
  registeredAgentName?: string;
  registeredAgentAddress?: string;
  publicationDetails?: string;

  // Address details
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Notes
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>({
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
  assignedAdminId: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  clientType: {
    type: String,
    enum: ["Individual", "Business", "Entity"],
    required: true,
    default: "Individual",
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  
  // Basic contact info
  ssn: String,
  address: String,
  avatar: String,

  // Individual specific fields
  mi: String,
  dateOfBirth: String,
  profileImage: String,

  // Spouse information
  spouse: String,
  spouseFirstName: String,
  spouseMi: String,
  spouseLastName: String,
  spouseDateOfBirth: String,
  spouseSsn: String,
  spousePhoneNo: String,
  spouseEmail: String,

  // Dependents
  dependents: [{
    firstName: String,
    mi: String,
    lastName: String,
    dateOfBirth: String,
    ssn: String,
    phoneNo: String,
    email: String,
  }],

  // Business specific fields
  businessName: String,
  ein: String,
  entityStructure: String,
  dateBusinessFormed: String,
  sElectionEffectiveDate: String,
  noOfShareholders: String,
  shareholders: [{
    ownership: String,
    firstName: String,
    mi: String,
    lastName: String,
    dateOfBirth: String,
    ssn: String,
    phoneNo: String,
    email: String,
  }],

  // Entity specific fields
  entityName: String,
  publicationCountry: String,
  entityEin: String,
  entityPhoneNo: String,
  entityEmailAddress: String,
  entityAddress: String,

  // Entity owner info
  ownerFirstName: String,
  ownerMi: String,
  ownerLastName: String,
  ownerDateOfBirth: String,
  ownerSsn: String,

  // Entity services and details
  servicesToProvide: [String],
  serviceOfProcessName: String,
  serviceOfProcessAddress: String,
  registeredAgentName: String,
  registeredAgentAddress: String,
  publicationDetails: String,

  // Address details
  street: String,
  apt: String,
  city: String,
  state: String,
  zipCode: String,

  // Notes
  notes: String,
}, {
  timestamps: true,
});

// Index for better query performance
ClientSchema.index({ email: 1 });
ClientSchema.index({ assignedAdminId: 1 });
ClientSchema.index({ clientType: 1 });
ClientSchema.index({ status: 1 });

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
