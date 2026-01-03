/**
 * Authentication & Session Types
 */

import { AuthUser } from './user.types';

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: AuthUser;
    token: string;
    expiresAt: string; // ISO timestamp
  };
  error?: string;
}

export interface Session {
  token: string;
  user: AuthUser;
  loginTime: string; // ISO timestamp
  expiresAt: string; // ISO timestamp
  lastActivity: string; // ISO timestamp
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loginTime: string | null;
  expiresAt: string | null;
  lastActivity: string | null;
  loading: boolean;
  error: string | null;
}
