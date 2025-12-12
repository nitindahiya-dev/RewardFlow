// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Load initial state from localStorage
const loadAuthState = (): AuthState => {
  try {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      return {
        user: parsed.user,
        isAuthenticated: parsed.isAuthenticated || false,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
  }
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = loadAuthState();

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage
      try {
        localStorage.removeItem('auth');
      } catch (error) {
        console.error('Failed to clear auth from localStorage:', error);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        // Save to localStorage
        try {
          localStorage.setItem('auth', JSON.stringify({
            user: action.payload,
            isAuthenticated: true,
          }));
        } catch (error) {
          console.error('Failed to save auth to localStorage:', error);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Clear localStorage on error
        try {
          localStorage.removeItem('auth');
        } catch (error) {
          console.error('Failed to clear auth from localStorage:', error);
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;