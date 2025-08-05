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
  email: string;
  firstName: string;
  lastName: string;
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
