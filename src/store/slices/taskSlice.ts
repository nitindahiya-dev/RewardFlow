// src/store/slices/taskSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to safely format dates
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'Invalid Date';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString();
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid Date';
  }
};

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string | null;
  createdAt: string;
  userId: string;
  dueDate?: string | null;
  priority?: string | null; // Low, Medium, High
  assignee?: string | null; // User ID or wallet address
  tags?: string[]; // Array of tags
  attachments?: string[]; // Array of attachment URLs
  // Web3 fields
  hasWeb3Reward?: boolean;
  blockchainTaskId?: string | null;
  rewardAmount?: string | null;
  rewardToken?: string | null;
  transactionHash?: string | null;
  badgeTokenId?: string | null;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  searchResults: Task[];
  searchQuery: string;
  isSearching: boolean;
  searchError: string | null;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  searchResults: [],
  searchQuery: '',
  isSearching: false,
  searchError: null,
};

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tasks');
      }

      const tasks = await response.json();
      // Format createdAt and dueDate dates to strings
      return tasks.map((task: any) => ({
        ...task,
        createdAt: formatDate(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: { 
    title: string; 
    description: string; 
    userId: string; 
    dueDate?: string | null;
    priority?: string | null;
    assignee?: string | null;
    tags?: string[];
    attachments?: string[];
    hasWeb3Reward?: boolean;
    rewardAmount?: string | null;
    rewardToken?: string | null;
    transactionHash?: string | null;
    blockchainTaskId?: string | null;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      const task = await response.json();
      return {
        ...task,
        createdAt: formatDate(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (taskData: { 
    id: string; 
    userId: string;
    title?: string; 
    description?: string; 
    completed?: boolean; 
    dueDate?: string | null;
    priority?: string | null;
    assignee?: string | null;
    tags?: string[];
    attachments?: string[];
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      const task = await response.json();
      return {
        ...task,
        createdAt: formatDate(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskData: { taskId: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskData.taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: taskData.userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      const result = await response.json();
      return {
        taskId: taskData.taskId,
        refundTxHash: result.refundTxHash,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

export const searchTasks = createAsyncThunk(
  'tasks/searchTasks',
  async (searchData: { query: string; userId: string }, { rejectWithValue }) => {
    try {
      // CHECK: Query length < 2 characters → Show recent tasks
      if (searchData.query.length < 2) {
        // Return empty results for short queries
        return [];
      }

      const response = await fetch(`http://localhost:5000/api/tasks/search?q=${encodeURIComponent(searchData.query)}&userId=${searchData.userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search tasks');
      }

      const results = await response.json();
      return results.map((task: any) => ({
        ...task,
        createdAt: formatDate(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search tasks');
    }
  }
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggleTaskComplete',
  async (taskData: { 
    taskId: string; 
    userId: string; 
    transactionHash?: string; 
    badgeTokenId?: string | null;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskData.taskId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: taskData.userId,
          ...(taskData.transactionHash && { transactionHash: taskData.transactionHash }),
          ...(taskData.badgeTokenId && { badgeTokenId: taskData.badgeTokenId }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete task');
      }

      const result = await response.json();
      return {
        task: {
          ...result,
          createdAt: formatDate(result.createdAt),
          dueDate: result.dueDate ? new Date(result.dueDate).toISOString() : null,
        },
        stats: result.stats,
        blockchainTxHash: result.blockchainTxHash,
        badgeTokenId: result.badgeTokenId,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Synchronous actions for WebSocket updates
    addTaskFromSocket: (state, action: { payload: Task }) => {
      const task = action.payload;
      // Check if task already exists (avoid duplicates)
      const existingIndex = state.tasks.findIndex(t => t.id === task.id);
      if (existingIndex === -1) {
        state.tasks.unshift({
          ...task,
          createdAt: formatDate(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        });
      }
    },
    updateTaskFromSocket: (state, action: { payload: Task }) => {
      const task = action.payload;
      const index = state.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...task,
          createdAt: formatDate(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        };
      }
    },
    deleteTaskFromSocket: (state, action: { payload: string }) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create task
      .addCase(createTask.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Optimistic update - add temporary task
        if (action.meta.arg) {
          const optimisticTask: Task = {
            id: `temp-${Date.now()}`,
            title: action.meta.arg.title,
            description: action.meta.arg.description || '',
            completed: false,
            createdAt: new Date().toLocaleDateString(),
            userId: action.meta.arg.userId,
            dueDate: action.meta.arg.dueDate || null,
            priority: action.meta.arg.priority || null,
            assignee: action.meta.arg.assignee || null,
            tags: action.meta.arg.tags || [],
            attachments: action.meta.arg.attachments || [],
            hasWeb3Reward: action.meta.arg.hasWeb3Reward || false,
          };
          state.tasks.unshift(optimisticTask);
        }
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove optimistic task and add real task
        state.tasks = state.tasks.filter(task => !task.id.startsWith('temp-'));
        state.tasks.unshift({
          ...action.payload,
          createdAt: formatDate(action.payload.createdAt),
          dueDate: action.payload.dueDate ? new Date(action.payload.dueDate).toISOString() : null,
        });
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        // Remove optimistic task on error
        state.tasks = state.tasks.filter(task => !task.id.startsWith('temp-'));
        state.error = action.payload as string;
      })
      // Update task
      .addCase(updateTask.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Optimistic update - update task in local state immediately
        if (action.meta.arg) {
          const index = state.tasks.findIndex(task => task.id === action.meta.arg.id);
          if (index !== -1) {
            const existingTask = state.tasks[index];
            // Store original task for rollback if needed
            state.tasks[index] = {
              ...existingTask,
              ...(action.meta.arg.title !== undefined && { title: action.meta.arg.title }),
              ...(action.meta.arg.description !== undefined && { description: action.meta.arg.description || '' }),
              ...(action.meta.arg.completed !== undefined && { completed: action.meta.arg.completed }),
              ...(action.meta.arg.dueDate !== undefined && { dueDate: action.meta.arg.dueDate }),
              ...(action.meta.arg.priority !== undefined && { priority: action.meta.arg.priority }),
              ...(action.meta.arg.assignee !== undefined && { assignee: action.meta.arg.assignee }),
              ...(action.meta.arg.tags !== undefined && { tags: action.meta.arg.tags }),
              ...(action.meta.arg.attachments !== undefined && { attachments: action.meta.arg.attachments }),
            };
          }
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        // Replace optimistic update with real task from server
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = {
            ...action.payload,
            createdAt: formatDate(action.payload.createdAt),
            dueDate: action.payload.dueDate ? new Date(action.payload.dueDate).toISOString() : null,
          };
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        // Revert optimistic update - refetch tasks to get correct state
        // In a production app, you'd store the original task and revert it here
        state.error = action.payload as string;
      })
      // Delete task
      .addCase(deleteTask.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Optimistic Update: Remove task from list
        if (action.meta.arg) {
          state.tasks = state.tasks.filter(task => task.id !== action.meta.arg.taskId);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update Redux: deleteTask(taskId) - task already removed optimistically
        state.tasks = state.tasks.filter(task => task.id !== action.payload.taskId);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        // Revert optimistic update - refetch tasks to restore task in UI
        // In production, you'd store the deleted task and restore it here
        state.error = action.payload as string;
      })
      // Toggle task complete
      .addCase(toggleTaskComplete.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Optimistic Update: Mark task as completed
        if (action.meta.arg) {
          const index = state.tasks.findIndex(task => task.id === action.meta.arg.taskId);
          if (index !== -1) {
            state.tasks[index] = {
              ...state.tasks[index],
              completed: !state.tasks[index].completed,
              completedAt: state.tasks[index].completed ? null : new Date().toISOString(),
            };
          }
        }
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update Redux: updateTask(completedTask)
        const index = state.tasks.findIndex(task => task.id === action.payload.task.id);
        if (index !== -1) {
          state.tasks[index] = {
            ...action.payload.task,
            createdAt: formatDate(action.payload.task.createdAt),
            dueDate: action.payload.task.dueDate ? new Date(action.payload.task.dueDate).toISOString() : null,
          };
        }
        state.error = null;
      })
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.isLoading = false;
        // Revert optimistic update
        if (action.meta.arg) {
          const index = state.tasks.findIndex(task => task.id === action.meta.arg.taskId);
          if (index !== -1) {
            state.tasks[index] = {
              ...state.tasks[index],
              completed: !state.tasks[index].completed,
              completedAt: state.tasks[index].completed ? new Date().toISOString() : null,
            };
          }
        }
        state.error = action.payload as string;
      })
      // Search tasks
      .addCase(searchTasks.pending, (state, action) => {
        state.isSearching = true;
        state.searchError = null;
        state.searchQuery = action.meta.arg.query;
      })
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
        state.searchError = null;
      })
      .addCase(searchTasks.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload as string;
        // Keep previous search results if available
      });
  },
});

export const { 
  clearError, 
  addTaskFromSocket, 
  updateTaskFromSocket, 
  deleteTaskFromSocket 
} = taskSlice.actions;

export default taskSlice.reducer;

