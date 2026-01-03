/**
 * Auth Slice - Authentication & Session State
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from '../../types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loginTime: null,
  expiresAt: null,
  lastActivity: null,
  loading: false,
  error: null,
};

interface LoginSuccessPayload {
  user: AuthUser;
  token: string;
  loginTime: string;
  expiresAt: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loginTime = action.payload.loginTime;
      state.expiresAt = action.payload.expiresAt;
      state.lastActivity = new Date().toISOString();
      state.loading = false;
      state.error = null;

      // Persist to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('expires_at', action.payload.expiresAt);
      localStorage.setItem('login_time', action.payload.loginTime);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: () => {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('expires_at');
      localStorage.removeItem('login_time');
      return initialState; // Reset to initial state
    },
    updateActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    sessionExpired: (state) => {
      return {
        ...initialState,
        error: 'Session expired. Please login again.',
      };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateActivity,
  sessionExpired,
} = authSlice.actions;

export default authSlice.reducer;
