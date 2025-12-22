// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import userReducer from './slices/userSlice';
import signUpReducer from './slices/signUpSlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    signUp : signUpReducer,
    tasks: taskReducer,
    user: userReducer,
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;