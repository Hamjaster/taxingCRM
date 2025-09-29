import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Invoice, InvoiceStatus, CreateInvoiceData, UpdateInvoiceData } from '@/types';

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Extended Invoice type for populated data from API
export interface PopulatedInvoice extends Invoice {
  client?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName?: string;
    entityName?: string;
    clientType: 'Individual' | 'Business' | 'Entity';
  };
  assignedAdmin?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  relatedTask?: {
    _id: string;
    title: string;
  };
  relatedProject?: {
    _id: string;
    name: string;
  };
}

// Filter interface
export interface InvoiceFilters {
  clientId?: string;
  status?: InvoiceStatus | 'all';
  page?: number;
  limit?: number;
  search?: string;
}

// Pagination interface
export interface InvoicePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Invoice state interface
interface InvoiceState {
  invoices: PopulatedInvoice[];
  selectedInvoice: PopulatedInvoice | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  pagination: InvoicePagination;
  filters: InvoiceFilters;
}

const initialState: InvoiceState = {
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    status: 'all',
    page: 1,
    limit: 10,
  },
};

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (filters: InvoiceFilters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_URL}/api/invoices?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch invoices');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch invoice');
      }

      return data.invoice;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData: CreateInvoiceData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/invoices`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create invoice');
      }

      return data.invoice;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async (
    { invoiceId, updates }: { invoiceId: string; updates: UpdateInvoiceData },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update invoice');
      }

      return data.invoice;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to delete invoice');
      }

      return invoiceId;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Thunk for fetching client invoices (used in admin dashboard)
export const fetchClientInvoices = createAsyncThunk(
  'invoices/fetchClientInvoices',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/invoices?clientId=${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch client invoices');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Thunk for updating invoice status (common operation)
export const updateInvoiceStatus = createAsyncThunk(
  'invoices/updateInvoiceStatus',
  async (
    { invoiceId, status }: { invoiceId: string; status: InvoiceStatus },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update invoice status');
      }

      return data.invoice;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Thunk for recording payment
export const recordPayment = createAsyncThunk(
  'invoices/recordPayment',
  async (
    { 
      invoiceId, 
      amountPaid, 
      paymentMethod 
    }: { 
      invoiceId: string; 
      amountPaid: number; 
      paymentMethod?: string; 
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amountPaid,
          paymentMethod,
          status: 'Paid' // Automatically mark as paid when payment is recorded
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to record payment');
      }

      return data.invoice;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Slice
const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<InvoiceFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedInvoice: (state, action: PayloadAction<PopulatedInvoice | null>) => {
      state.selectedInvoice = action.payload;
    },
    clearInvoices: (state) => {
      state.invoices = [];
      state.pagination = initialState.pagination;
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
    // Optimistic update for status changes
    updateInvoiceStatusLocally: (state, action: PayloadAction<{ invoiceId: string; status: InvoiceStatus }>) => {
      const { invoiceId, status } = action.payload;
      const invoice = state.invoices.find(inv => inv._id === invoiceId);
      if (invoice) {
        invoice.status = status;
      }
      if (state.selectedInvoice && state.selectedInvoice._id === invoiceId) {
        state.selectedInvoice.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch invoices
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload.invoices;
        state.pagination = action.payload.pagination || initialState.pagination;
        state.error = null;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedInvoice = action.payload;
        state.error = null;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isCreating = false;
        state.invoices.unshift(action.payload);
        state.error = null;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      
      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.invoices.findIndex(inv => inv._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice && state.selectedInvoice._id === action.payload._id) {
          state.selectedInvoice = action.payload;
        }
        state.error = null;
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      
      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.invoices = state.invoices.filter(inv => inv._id !== action.payload);
        if (state.selectedInvoice && state.selectedInvoice._id === action.payload) {
          state.selectedInvoice = null;
        }
        state.error = null;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })
      
      // Fetch client invoices
      .addCase(fetchClientInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload.invoices;
        state.pagination = action.payload.pagination || initialState.pagination;
        state.error = null;
      })
      .addCase(fetchClientInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update invoice status
      .addCase(updateInvoiceStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.invoices.findIndex(inv => inv._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice && state.selectedInvoice._id === action.payload._id) {
          state.selectedInvoice = action.payload;
        }
        state.error = null;
      })
      .addCase(updateInvoiceStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      
      // Record payment
      .addCase(recordPayment.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(recordPayment.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.invoices.findIndex(inv => inv._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice && state.selectedInvoice._id === action.payload._id) {
          state.selectedInvoice = action.payload;
        }
        state.error = null;
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  clearError, 
  setFilters, 
  setSelectedInvoice, 
  clearInvoices, 
  clearSelectedInvoice,
  updateInvoiceStatusLocally
} = invoiceSlice.actions;

// Export reducer
export default invoiceSlice.reducer;

// Selectors
export const selectInvoices = (state: { invoices: InvoiceState }) => state.invoices.invoices;
export const selectSelectedInvoice = (state: { invoices: InvoiceState }) => state.invoices.selectedInvoice;
export const selectInvoicesLoading = (state: { invoices: InvoiceState }) => state.invoices.isLoading;
export const selectInvoicesError = (state: { invoices: InvoiceState }) => state.invoices.error;
export const selectInvoicesPagination = (state: { invoices: InvoiceState }) => state.invoices.pagination;
export const selectInvoicesFilters = (state: { invoices: InvoiceState }) => state.invoices.filters;
export const selectIsCreatingInvoice = (state: { invoices: InvoiceState }) => state.invoices.isCreating;
export const selectIsUpdatingInvoice = (state: { invoices: InvoiceState }) => state.invoices.isUpdating;
export const selectIsDeletingInvoice = (state: { invoices: InvoiceState }) => state.invoices.isDeleting;
