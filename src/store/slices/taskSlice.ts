import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: string;
  clientId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName?: string;
    entityName?: string;
    clientType: 'Individual' | 'Business' | 'Entity';
  };
  assignedAdminId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'Pending' | 'In Progress' | 'Completed' | 'Do not continue';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  priceQuoted: number;
  amountPaid: number;
  remainingBalance: number;
  dueDate?: string;
  startDate?: string;
  completedDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCategory {
  _id: string;
  name: string;
  description?: string;
  isDefault: boolean;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  category: string;
  clientId: string;
  status?: string;
  priority?: string;
  priceQuoted?: number;
  amountPaid?: number;
  dueDate?: string;
  startDate?: string;
  notes?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  priority?: string;
  priceQuoted?: number;
  amountPaid?: number;
  dueDate?: string;
  startDate?: string;
  notes?: string;
}

export interface TaskFilters {
  status?: string;
  clientId?: string;
  category?: string;
  page?: number;
  limit?: number;
}

interface TaskState {
  tasks: Task[];
  categories: TaskCategory[];
  selectedTask: Task | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: TaskFilters;
}

const initialState: TaskState = {
  tasks: [],
  categories: [],
  selectedTask: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalTasks: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    status: 'all',
    page: 1,
    limit: 10,
  },
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters: TaskFilters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/tasks?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch tasks');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch task');
      }

      return data.task;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: CreateTaskData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create task');
      }

      return data.task;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }: { taskId: string; updates: UpdateTaskData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update task');
      }

      return data.task;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to delete task');
      }

      return taskId;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchTaskCategories = createAsyncThunk(
  'tasks/fetchTaskCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/task-categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch categories');
      }

      return data.categories;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createTaskCategory = createAsyncThunk(
  'tasks/createTaskCategory',
  async ({ name, description }: { name: string; description?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/task-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create category');
      }

      return data.category;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<TaskFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTask = action.payload;
        state.error = null;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isCreating = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.selectedTask && state.selectedTask._id === action.payload._id) {
          state.selectedTask = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        if (state.selectedTask && state.selectedTask._id === action.payload) {
          state.selectedTask = null;
        }
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchTaskCategories.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTaskCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchTaskCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Create category
      .addCase(createTaskCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(createTaskCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.error = null;
      })
      .addCase(createTaskCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, setSelectedTask, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
