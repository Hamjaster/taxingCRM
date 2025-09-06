import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types for documents and folders
export interface DocumentItem {
  _id: string;
  name: string;
  originalName: string;
  fileType: string;
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
  
  // Populated fields
  folder?: {
    _id: string;
    name: string;
  };
  client?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName?: string;
    entityName?: string;
  };
  uploadedByAdmin?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface FolderItem {
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
  
  // Populated fields
  client?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName?: string;
    entityName?: string;
  };
  assignedAdmin?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateFolderData {
  name: string;
  clientId: string;
  description?: string;
}

export interface UpdateFolderData {
  name?: string;
  description?: string;
}

export interface CreateDocumentData {
  name: string;
  originalName: string;
  fileType: string;
  mimeType: string;
  size: number;
  s3Key: string;
  s3Url: string;
  s3Bucket: string;
  s3ETag?: string;
  s3VersionId?: string;
  folderId: string;
  clientId: string;
  description?: string;
  tags?: string[];
  fileExtension: string;
}

export interface UpdateDocumentData {
  name?: string;
  description?: string;
  tags?: string[];
}

export interface UploadDocumentData {
  file: File;
  folderId: string;
  clientId: string;
  description?: string;
}

// Document state interface
interface DocumentState {
  folders: FolderItem[];
  documents: DocumentItem[];
  selectedFolder: FolderItem | null;
  selectedDocument: DocumentItem | null;
  currentFolderDocuments: DocumentItem[];
  isLoading: boolean;
  isCreatingFolder: boolean;
  isUpdatingFolder: boolean;
  isDeletingFolder: boolean;
  isUploadingDocument: boolean;
  isUpdatingDocument: boolean;
  isDeletingDocument: boolean;
  error: string | null;
  uploadProgress: number;
  downloadUrl: string | null;
  currentView: 'folders' | 'documents';
}

const initialState: DocumentState = {
  folders: [],
  documents: [],
  selectedFolder: null,
  selectedDocument: null,
  currentFolderDocuments: [],
  isLoading: false,
  isCreatingFolder: false,
  isUpdatingFolder: false,
  isDeletingFolder: false,
  isUploadingDocument: false,
  isUpdatingDocument: false,
  isDeletingDocument: false,
  error: null,
  uploadProgress: 0,
  downloadUrl: null,
  currentView: 'folders',
};

// Async thunks
export const fetchFolders = createAsyncThunk(
  'documents/fetchFolders',
  async (clientId?: string, { rejectWithValue }) => {
    try {
      const params = clientId ? `?clientId=${clientId}` : '';
      const response = await fetch(`/api/folders${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch folders');
      }

      return data.folders;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchFolderWithDocuments = createAsyncThunk(
  'documents/fetchFolderWithDocuments',
  async (folderId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch folder');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createFolder = createAsyncThunk(
  'documents/createFolder',
  async (folderData: CreateFolderData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(folderData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create folder');
      }

      return data.folder;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateFolder = createAsyncThunk(
  'documents/updateFolder',
  async (
    { folderId, updates }: { folderId: string; updates: UpdateFolderData },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update folder');
      }

      return data.folder;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteFolder = createAsyncThunk(
  'documents/deleteFolder',
  async (folderId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to delete folder');
      }

      return folderId;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (uploadData: UploadDocumentData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('folderId', uploadData.folderId);
      formData.append('clientId', uploadData.clientId);
      if (uploadData.description) {
        formData.append('description', uploadData.description);
      }

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to upload document');
      }

      return data.document;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async (
    { documentId, updates }: { documentId: string; updates: UpdateDocumentData },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update document');
      }

      return data.document;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to delete document');
      }

      return documentId;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const downloadDocument = createAsyncThunk(
  'documents/downloadDocument',
  async (documentId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get download URL');
      }
     
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Slice
const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedFolder: (state, action: PayloadAction<FolderItem | null>) => {
      state.selectedFolder = action.payload;
      state.currentView = action.payload ? 'documents' : 'folders';
    },
    setSelectedDocument: (state, action: PayloadAction<DocumentItem | null>) => {
      state.selectedDocument = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<'folders' | 'documents'>) => {
      state.currentView = action.payload;
      if (action.payload === 'folders') {
        state.selectedFolder = null;
        state.currentFolderDocuments = [];
      }
    },
    clearDocuments: (state) => {
      state.documents = [];
      state.currentFolderDocuments = [];
    },
    clearFolders: (state) => {
      state.folders = [];
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setDownloadUrl: (state, action: PayloadAction<string | null>) => {
      state.downloadUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch folders
    builder
      .addCase(fetchFolders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload;
        state.error = null;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch folder with documents
      .addCase(fetchFolderWithDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFolderWithDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedFolder = action.payload.folder;
        state.currentFolderDocuments = action.payload.documents;
        state.currentView = 'documents';
        state.error = null;
      })
      .addCase(fetchFolderWithDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create folder
      .addCase(createFolder.pending, (state) => {
        state.isCreatingFolder = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.isCreatingFolder = false;
        state.folders.unshift(action.payload);
        state.error = null;
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.isCreatingFolder = false;
        state.error = action.payload as string;
      })
      
      // Update folder
      .addCase(updateFolder.pending, (state) => {
        state.isUpdatingFolder = true;
        state.error = null;
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        state.isUpdatingFolder = false;
        const index = state.folders.findIndex(folder => folder._id === action.payload._id);
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
        if (state.selectedFolder && state.selectedFolder._id === action.payload._id) {
          state.selectedFolder = action.payload;
        }
        state.error = null;
      })
      .addCase(updateFolder.rejected, (state, action) => {
        state.isUpdatingFolder = false;
        state.error = action.payload as string;
      })
      
      // Delete folder
      .addCase(deleteFolder.pending, (state) => {
        state.isDeletingFolder = true;
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.isDeletingFolder = false;
        state.folders = state.folders.filter(folder => folder._id !== action.payload);
        if (state.selectedFolder && state.selectedFolder._id === action.payload) {
          state.selectedFolder = null;
          state.currentView = 'folders';
          state.currentFolderDocuments = [];
        }
        state.error = null;
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.isDeletingFolder = false;
        state.error = action.payload as string;
      })
      
      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.isUploadingDocument = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploadingDocument = false;
        state.currentFolderDocuments.unshift(action.payload);
        state.uploadProgress = 100;
        state.error = null;
        
        // Update folder document count
        const folderId = action.payload.folderId;
        const folderIndex = state.folders.findIndex(f => f._id === folderId);
        if (folderIndex !== -1) {
          state.folders[folderIndex].documentCount = (state.folders[folderIndex].documentCount || 0) + 1;
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploadingDocument = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      })
      
      // Update document
      .addCase(updateDocument.pending, (state) => {
        state.isUpdatingDocument = true;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.isUpdatingDocument = false;
        const index = state.currentFolderDocuments.findIndex(doc => doc._id === action.payload._id);
        if (index !== -1) {
          state.currentFolderDocuments[index] = action.payload;
        }
        if (state.selectedDocument && state.selectedDocument._id === action.payload._id) {
          state.selectedDocument = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.isUpdatingDocument = false;
        state.error = action.payload as string;
      })
      
      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.isDeletingDocument = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isDeletingDocument = false;
        state.currentFolderDocuments = state.currentFolderDocuments.filter(doc => doc._id !== action.payload);
        if (state.selectedDocument && state.selectedDocument._id === action.payload) {
          state.selectedDocument = null;
        }
        state.error = null;
        
        // Update folder document count
        if (state.selectedFolder) {
          const folderIndex = state.folders.findIndex(f => f._id === state.selectedFolder!._id);
          if (folderIndex !== -1) {
            state.folders[folderIndex].documentCount = Math.max((state.folders[folderIndex].documentCount || 1) - 1, 0);
          }
        }
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isDeletingDocument = false;
        state.error = action.payload as string;
      })
      
      // Download document
      .addCase(downloadDocument.pending, (state) => {
        state.error = null;
      })
      .addCase(downloadDocument.fulfilled, (state, action) => {
        state.downloadUrl = action.payload.downloadUrl;
        state.error = null;
      })
      .addCase(downloadDocument.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  clearError, 
  setSelectedFolder, 
  setSelectedDocument, 
  setCurrentView,
  clearDocuments,
  clearFolders,
  setUploadProgress,
  setDownloadUrl,
} = documentSlice.actions;

// Export reducer
export default documentSlice.reducer;

// Selectors
export const selectFolders = (state: { documents: DocumentState }) => state.documents.folders;
export const selectCurrentFolderDocuments = (state: { documents: DocumentState }) => state.documents.currentFolderDocuments;
export const selectSelectedFolder = (state: { documents: DocumentState }) => state.documents.selectedFolder;
export const selectSelectedDocument = (state: { documents: DocumentState }) => state.documents.selectedDocument;
export const selectDocumentsLoading = (state: { documents: DocumentState }) => state.documents.isLoading;
export const selectDocumentsError = (state: { documents: DocumentState }) => state.documents.error;
export const selectCurrentView = (state: { documents: DocumentState }) => state.documents.currentView;
export const selectUploadProgress = (state: { documents: DocumentState }) => state.documents.uploadProgress;
export const selectIsUploadingDocument = (state: { documents: DocumentState }) => state.documents.isUploadingDocument;
