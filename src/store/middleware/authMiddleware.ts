/**
 * Auth Middleware
 *
 * Validates session on every action and handles auto-logout
 */

/**
 * Auth Middleware
 *
 * Validates session on every action and handles auto-logout
 */
import type { Middleware } from '@reduxjs/toolkit';
import { sessionExpired } from '../slices/authSlice';
import { clearPermissions } from '../slices/permissionsSlice';

export const authMiddleware: Middleware = (store) => (next) => (action: any) => {
  // Get current state before action
  const stateBefore = store.getState();
  const { auth } = stateBefore;

  // Check if user is authenticated and session hasn't already expired
  if (auth.isAuthenticated && auth.expiresAt && action.type !== sessionExpired.type) {
    const now = Date.now();
    const expiry = new Date(auth.expiresAt).getTime();

    // If token has expired, dispatch sessionExpired action
    if (now > expiry) {
      store.dispatch(sessionExpired());
      store.dispatch(clearPermissions());

      // Don't process the original action if session expired
      return next(action);
    }
  }

  // Process the action
  return next(action);
};
