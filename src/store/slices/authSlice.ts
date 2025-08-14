import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Admin, ClientUser } from '@/types';

// Define the auth state interface
export interface AuthState {
  user: Admin | ClientUser | null;
  role: 'admin' | 'client' | null;
  isAuthenticated: boolean;
  hasFetchedClients: boolean;
  isLoading: boolean;
  error: string | null;
  clients: ClientUser[]; // For admin users to store their clients
}

// Initial state
const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  hasFetchedClients: false,
  isLoading: false,
  error: null,
  clients: [],
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string; userType?: 'admin' | 'client' }, { rejectWithValue }) => {
    try {
      // Determine the correct API endpoint based on user type
      const endpoint = credentials.userType === 'client' ? '/api/client/login' : '/api/admin/login';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || data.error || 'Login failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'admin' | 'client';
    assignedAdminId?: string; // For client registration
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Registration failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for fetching admin's clients
export const fetchAdminClients = createAsyncThunk(
  'auth/fetchAdminClients',
  async (_, { rejectWithValue }) => {
    try {
      // send bearer token in authorization header
      const response = await fetch('/api/admin/clients', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || data.error || 'Failed to fetch clients');
      }

      return data.data || data.clients || data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  },
  {
    condition: (_, { getState }) => {
      const { auth } = getState() as any;
      // Cancel if already loading or clients already loaded
      if (auth.isLoading || auth.clients.length > 0) {
        return false;
      }
    }
  }
);

// Async thunk for creating a new client
export const createClient = createAsyncThunk(
  'auth/createClient',
  async (clientData: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        body: JSON.stringify(clientData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || data.error || 'Failed to create client');
      }

      return data.data || data.client || data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for updating client status (activate/deactivate)
export const updateClientStatus = createAsyncThunk(
  'auth/updateClientStatus',
  async ({ clientId, isActive }: { clientId: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'  ,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || data.error || 'Failed to update client status');
      }

      return { clientId, isActive };
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for sending OTP
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || data.error || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for verifying OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || data.error || 'OTP verification failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        return rejectWithValue('Logout failed');
      }

      return true;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<{ user: Admin | ClientUser; role: 'admin' | 'client' }>) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.clients = [];
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<Admin | ClientUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    addClient: (state, action: PayloadAction<ClientUser>) => {
      if (state.role === 'admin') {
        state.clients.push(action.payload);
      }
    },
    updateClient: (state, action: PayloadAction<{ clientId: string; updates: Partial<ClientUser> }>) => {
      if (state.role === 'admin') {
        const clientIndex = state.clients.findIndex(client => client._id === action.payload.clientId);
        if (clientIndex !== -1) {
          state.clients[clientIndex] = { ...state.clients[clientIndex], ...action.payload.updates };
        }
      }
    },
    removeClient: (state, action: PayloadAction<string>) => {
      if (state.role === 'admin') {
        state.clients = state.clients.filter(client => client._id !== action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.role = action.payload.data.role || (action.payload.data.assignedAdminId ? 'client' : 'admin');
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('token', action.payload.data.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.data;
        localStorage.setItem('token', action.payload.data.token);
        state.role = action.payload.data.role || (action.payload.data.assignedAdminId ? 'client' : 'admin');
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch clients cases
      .addCase(fetchAdminClients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload.data || action.payload;
        state.hasFetchedClients = true;
      })
      .addCase(fetchAdminClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.clients = [];
        state.error = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Create client cases
      .addCase(createClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients.push(action.payload.data || action.payload);
        state.error = null;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update client status cases
      .addCase(updateClientStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClientStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { clientId, isActive } = action.payload;
        const clientIndex = state.clients.findIndex(client => client._id === clientId);
        if (clientIndex !== -1) {
          state.clients[clientIndex].isActive = isActive;
        }
        state.error = null;
      })
      .addCase(updateClientStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send OTP cases
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify OTP cases
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.role = 'client';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setUser,
  clearAuth,
  updateUserProfile,
  addClient,
  updateClient,
  removeClient,
} = authSlice.actions;

export default authSlice.reducer;
