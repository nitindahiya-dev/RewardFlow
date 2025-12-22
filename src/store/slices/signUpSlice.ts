import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from '../../config/api';

interface User {
    id: string;
    name: string;
    email: string;
}

interface SignUpState {
    user: User | null;
    isSignUp: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: SignUpState = {
    user : null,
    isSignUp: false,
    isLoading : false,
    error: null,
}

export const SignUpUser = createAsyncThunk(
    'auth/signup',
    async (credentials: { name: string; email: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(credentials),
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || "SignUp Failed")
            }

            const data = await response.json();
            return data.user;
        } catch (error:any){
                return rejectWithValue(error.message || "SignUp Failed");
        }
    }
);

const signUpSlice = createSlice({
    name: 'signUp',
    initialState,
    reducers: {
        // Synchronous reducers (if needed)
        resetSignUpState: (state) => {
            state.user = null;
            state.isSignUp = false;
            state.isLoading = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle pending state (when request is sent)
            .addCase(SignUpUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.isSignUp = false;
            })
            // Handle fulfilled state (when request succeeds)
            .addCase(SignUpUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSignUp = true;
                state.user = action.payload;
                state.error = null;
            })
            // Handle rejected state (when request fails)
            .addCase(SignUpUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isSignUp = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetSignUpState, clearError } = signUpSlice.actions;
export default signUpSlice.reducer;
