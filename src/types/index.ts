export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'client';
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  permissions?: string[];
  department?: string;
  employeeId?: string;
  clients: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  assignedAdminId: string;
  clientType: "Individual" | "Business" | "Entity";
  status: "Active" | "Inactive";
  ssn?: string;
  address?: string;
  avatar?: string;
  mi?: string;
  dateOfBirth?: string;
  profileImage?: string;
  spouse?: string;
  spouseFirstName?: string;
  spouseMi?: string;
  spouseLastName?: string;
  spouseDateOfBirth?: string;
  spouseSsn?: string;
  spousePhoneNo?: string;
  spouseEmail?: string;
  dependents?: Array<{
    firstName: string;
    mi: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
    phoneNo: string;
    email: string;
  }>;
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
  entityName?: string;
  publicationCountry?: string;
  entityEin?: string;
  entityPhoneNo?: string;
  entityEmailAddress?: string;
  entityAddress?: string;
  ownerFirstName?: string;
  ownerMi?: string;
  ownerLastName?: string;
  ownerDateOfBirth?: string;
  ownerSsn?: string;
  servicesToProvide?: string[];
  serviceOfProcessName?: string;
  serviceOfProcessAddress?: string;
  registeredAgentName?: string;
  registeredAgentAddress?: string;
  publicationDetails?: string;
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceType {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'Info Received' | 'In Progress' | 'Waiting' | 'Completed';

export interface Project {
  _id: string;
  name: string;
  description?: string;
  clientId: string;
  assignedAdminId: string;
  status: ProjectStatus;
  serviceTypes: string[];
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Populated fields
  client?: User;
  assignedAdmin?: User;
  serviceTypeDetails?: ServiceType[];
}

export interface Note {
  _id: string;
  projectId: string;
  authorId: string;
  content: string;
  isVisibleToClient: boolean;
  isInternal: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  // Populated fields
  author?: User;
}

export interface AuthUser {
  id: string;
  role: 'admin' | 'client';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'client';
}

export interface OTPVerification {
  phone: string;
  otpCode: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  clientId: string;
  serviceTypes: string[];
  startDate?: Date;
  dueDate?: Date;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  serviceTypes?: string[];
  startDate?: Date;
  dueDate?: Date;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface CreateNoteData {
  projectId: string;
  content: string;
  isVisibleToClient: boolean;
  attachments?: string[];
}


export interface Client {
  id: string
  firstName: string
  lastName: string
  clientType: "Individual" | "Business" | "Entity"
  status: "Active" | "Inactive"

  // Basic contact info
  ssn: string
  phoneNumber: string
  email?: string
  address?: string
  avatar?: string

  // Individual specific fields
  mi?: string
  dateOfBirth?: string
  profileImage?: string

  // Spouse information
  spouse?: string
  spouseFirstName?: string
  spouseMi?: string
  spouseLastName?: string
  spouseDateOfBirth?: string
  spouseSsn?: string
  spousePhoneNo?: string
  spouseEmail?: string

  // Dependents
  dependents?: Array<{
    firstName: string
    mi: string
    lastName: string
    dateOfBirth: string
    ssn: string
    phoneNo: string
    email: string
  }>

  // Business specific fields
  businessName?: string
  ein?: string
  entityStructure?: string
  dateBusinessFormed?: string
  sElectionEffectiveDate?: string
  noOfShareholders?: string
  shareholders?: Array<{
    ownership: string
    firstName: string
    mi: string
    lastName: string
    dateOfBirth: string
    ssn: string
    phoneNo: string
    email: string
  }>

  // Entity specific fields
  entityName?: string
  publicationCountry?: string
  entityEin?: string
  entityPhoneNo?: string
  entityEmailAddress?: string
  entityAddress?: string

  // Entity owner info
  ownerFirstName?: string
  ownerMi?: string
  ownerLastName?: string
  ownerDateOfBirth?: string
  ownerSsn?: string

  // Entity services and details
  servicesToProvide?: string[]
  serviceOfProcessName?: string
  serviceOfProcessAddress?: string
  registeredAgentName?: string
  registeredAgentAddress?: string
  publicationDetails?: string

  // Address details
  street?: string
  apt?: string
  city?: string
  state?: string
  zipCode?: string

  // Notes
  notes?: string
}

export interface Document {
  id: string;
  name: string;
  type: "pdf" | "image" | "doc";
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  documents: Document[];
}

// Updated Document types for the real system
export interface RealDocument {
  _id: string;
  name: string;
  originalName: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'image' | 'txt' | 'xlsx' | 'xls' | 'other';
  mimeType: string;
  size: number;
  s3Key: string;
  s3Url: string;
  folderId: string;
  clientId: string;
  uploadedByAdminId: string;
  description?: string;
  tags?: string[];
  fileExtension: string;
  isPublic: boolean;
  downloadCount: number;
  s3Bucket: string;
  s3ETag?: string;
  s3VersionId?: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RealFolder {
  _id: string;
  name: string;
  clientId: string;
  assignedAdminId: string;
  description?: string;
  parentFolderId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  documentCount?: number;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: string;
  assignedAdminId: string;
  
  // Invoice details
  issueDate: Date;
  dueDate: Date;
  serviceName: string;
  serviceDescription?: string;
  
  // Financial details
  totalAmount: number;
  
  // Status and metadata
  status: InvoiceStatus;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Populated fields
  client?: ClientUser;
  assignedAdmin?: Admin;
}

export interface CreateInvoiceData {
  clientId: string;
  serviceName: string;
  serviceDescription?: string;
  dueDate: Date;
  totalAmount: number;
}

export interface UpdateInvoiceData {
  serviceName?: string;
  serviceDescription?: string;
  dueDate?: Date;
  totalAmount?: number;
  status?: InvoiceStatus;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: string;
  clientId: string;
  assignedAdminId: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Do not continue';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  priceQuoted: number;
  amountPaid: number;
  remainingBalance: number;
  dueDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Populated fields
  client?: ClientUser;
  assignedAdmin?: Admin;
}


export interface ChartDataType {
  totalAccounts: Array<{ month: string; value: number }>;
  businessClients: Array<{ month: string; value: number }>;
  individualClients: Array<{ month: string; value: number }>;
  entityFormation: Array<{ month: string; value: number }>;
}

export interface NotificationType  {
  _id: string;
  senderId?: string;       // who triggered this
  senderModel?: "Client" | "Admin";         // sender type
  recipientId: string;     // who will receive this
  recipientModel: "Client" | "Admin";       // recipient type
  type: "DOCUMENT" | "INVOICE" | "TASK" | "PROJECT_STATUS";
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}