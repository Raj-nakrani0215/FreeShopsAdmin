import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  _id: string;
  fullName: string;
  email: string;
  image: string;
  userType: string;
  accessToken: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    try {
      const response = await fetch(`${baseUrl}/api/v1/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed');
      }

      const { data, accessToken } = await response.json();
      // Combine user data with access token
      const userData = { ...data, accessToken };
      
      // Store token in localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add a reducer to restore auth state from localStorage
    restoreAuth: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, restoreAuth } = authSlice.actions;
export default authSlice.reducer; 