// store/slices/statsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ChartDataPoint {
  month: string;
  value: number;
}

interface StatData {
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface StatsState {
  chartData: {
    totalAccounts: ChartDataPoint[];
    businessClients: ChartDataPoint[];
    individualClients: ChartDataPoint[];
    entityFormation: ChartDataPoint[];
    registeredAgent: ChartDataPoint[];
    publication: ChartDataPoint[];
  };
  currentStats: {
    totalAccounts: StatData;
    businessClients: StatData;
    individualClients: StatData;
    entityFormation: StatData;
    registeredAgent: StatData;
    publication: StatData;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  chartData: {
    totalAccounts: [],
    businessClients: [],
    individualClients: [],
    entityFormation: [],
    registeredAgent: [],
    publication: [],
  },
  currentStats: {
    totalAccounts: { value: 0, change: 0, trend: 'up' },
    businessClients: { value: 0, change: 0, trend: 'up' },
    individualClients: { value: 0, change: 0, trend: 'up' },
    entityFormation: { value: 0, change: 0, trend: 'up' },
    registeredAgent: { value: 0, change: 0, trend: 'up' },
    publication: { value: 0, change: 0, trend: 'up' },
  },
  isLoading: false,
  error: null,
};

// Async thunk for fetching stats
export const fetchClientStats = createAsyncThunk(
  'stats/fetchClientStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/clients/stats`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch stats');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching stats'
      );
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStatsError: (state) => {
      state.error = null;
    },
    resetStats: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats cases
      .addCase(fetchClientStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chartData = {
          ...action.payload.chartData,
          // Add placeholder data for registeredAgent and publication
          registeredAgent: action.payload.chartData.registeredAgent || [
            { month: 'Jan', value: 0 },
            { month: 'Feb', value: 0 },
            { month: 'Mar', value: 0 },
            { month: 'Apr', value: 0 },
            { month: 'May', value: 0 },
            { month: 'Jun', value: 0 },
          ],
          publication: action.payload.chartData.publication || [
            { month: 'Jan', value: 0 },
            { month: 'Feb', value: 0 },
            { month: 'Mar', value: 0 },
            { month: 'Apr', value: 0 },
            { month: 'May', value: 0 },
            { month: 'Jun', value: 0 },
          ],
        };
        state.currentStats = action.payload.currentStats;
        state.error = null;
      })
      .addCase(fetchClientStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStatsError, resetStats } = statsSlice.actions;

export default statsSlice.reducer;