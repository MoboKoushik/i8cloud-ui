/**
 * useAuth Hook
 *
 * Provides authentication state and operations
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  updateActivity,
} from '../store/slices/authSlice';
import { setPermissions, clearPermissions } from '../store/slices/permissionsSlice';
import { login as loginService, logout as logoutService } from '../services/auth/authService';
import { logLogin, logLogout } from '../services/audit/auditService';
import { LoginCredentials } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch(loginStart());

        const response = await loginService(credentials);

        if (!response.success || !response.data) {
          dispatch(loginFailure(response.error?.message || 'Login failed'));
          return { success: false, error: response.error?.message || 'Login failed' };
        }

        const { user, role, permissions, token, loginTime, expiresAt } = response.data;

        // Update auth state
        dispatch(
          loginSuccess({
            user,
            role,
            token,
            loginTime,
            expiresAt,
          })
        );

        // Update permissions
        dispatch(setPermissions(permissions));

        // Log login event (fire and forget)
        logLogin({
          userId: user.id,
          username: user.username,
        }).catch(console.error);

        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        dispatch(loginFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      const currentUser = authState.user;

      // Call logout service (fire and forget)
      logoutService().catch(console.error);

      // Log logout event (fire and forget)
      if (currentUser) {
        logLogout({
          userId: currentUser.id,
          username: currentUser.username,
        }).catch(console.error);
      }

      // Clear auth state
      dispatch(logoutAction());
      dispatch(clearPermissions());

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      return { success: false, error: message };
    }
  }, [dispatch, authState.user]);

  /**
   * Update last activity timestamp
   */
  const trackActivity = useCallback(() => {
    dispatch(updateActivity());
  }, [dispatch]);

  /**
   * Check if session is expired
   */
  const isSessionExpired = useCallback((): boolean => {
    if (!authState.expiresAt) return false;

    const now = new Date().getTime();
    const expiry = new Date(authState.expiresAt).getTime();

    return now > expiry;
  }, [authState.expiresAt]);

  /**
   * Get time until session expiry (in minutes)
   */
  const getTimeUntilExpiry = useCallback((): number | null => {
    if (!authState.expiresAt) return null;

    const now = new Date().getTime();
    const expiry = new Date(authState.expiresAt).getTime();
    const diffMs = expiry - now;

    if (diffMs <= 0) return 0;

    return Math.floor(diffMs / (1000 * 60)); // Convert to minutes
  }, [authState.expiresAt]);

  return {
    // State
    user: authState.user,
    role: authState.role,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,
    loginTime: authState.loginTime,
    expiresAt: authState.expiresAt,
    lastActivity: authState.lastActivity,

    // Actions
    login,
    logout,
    trackActivity,

    // Utilities
    isSessionExpired,
    getTimeUntilExpiry,
  };
};
