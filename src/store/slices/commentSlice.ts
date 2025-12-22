// src/store/slices/commentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email?: string;
  };
  userName?: string; // For WebSocket updates
}

interface CommentState {
  comments: Record<string, Comment[]>; // taskId -> comments[]
  isLoading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: {},
  isLoading: false,
  error: null,
};

// Fetch comments for a task
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/comments`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch comments');
      }

      const comments = await response.json();
      return { taskId, comments };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch comments');
    }
  }
);

// Add a comment
export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData: { taskId: string; content: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${commentData.taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentData.content,
          userId: commentData.userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      const comment = await response.json();
      return { taskId: commentData.taskId, comment };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add comment');
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Synchronous action for WebSocket updates
    addCommentFromSocket: (state, action: { payload: { taskId: string; comment: Comment } }) => {
      const { taskId, comment } = action.payload;
      if (!state.comments[taskId]) {
        state.comments[taskId] = [];
      }
      // Check if comment already exists (avoid duplicates)
      const exists = state.comments[taskId].some(c => c.id === comment.id);
      if (!exists) {
        state.comments[taskId].push(comment);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments[action.payload.taskId] = action.payload.comments;
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        const { taskId, comment } = action.payload;
        if (!state.comments[taskId]) {
          state.comments[taskId] = [];
        }
        // Check if comment already exists (avoid duplicates from WebSocket)
        const exists = state.comments[taskId].some(c => c.id === comment.id);
        if (!exists) {
          state.comments[taskId].push(comment);
        }
        state.error = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addCommentFromSocket } = commentSlice.actions;
export default commentSlice.reducer;

