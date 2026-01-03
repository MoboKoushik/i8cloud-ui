/**
 * useSessionTimeout Hook
 *
 * Monitors session expiry and idle timeout
 * Auto-logout on expiration
 */

import { useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sessionExpired, updateActivity } from '../store/slices/authSlice';
import { clearPermissions } from '../store/slices/permissionsSlice';

// Configuration
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const CHECK_INTERVAL_MS = 60 * 1000; // Check every minute
const WARNING_BEFORE_EXPIRY_MS = 5 * 60 * 1000; // Warn 5 minutes before expiry

interface UseSessionTimeoutOptions {
  onSessionExpired?: () => void;
  onWarning?: (minutesLeft: number) => void;
}

export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}) => {
  const dispatch = useAppDispatch();
  const { expiresAt, lastActivity, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showWarning, setShowWarning] = useState(false);
  const [minutesUntilExpiry, setMinutesUntilExpiry] = useState<number | null>(null);

  /**
   * Check if session has expired
   */
  const checkSessionExpiry = useCallback(() => {
    if (!isAuthenticated || !expiresAt) return;

    const now = Date.now();
    const expiry = new Date(expiresAt).getTime();

    // Check token expiry
    if (now > expiry) {
      dispatch(sessionExpired());
      dispatch(clearPermissions());
      setShowWarning(false);
      options.onSessionExpired?.();
      return;
    }

    // Check for warning threshold
    const timeUntilExpiry = expiry - now;
    if (timeUntilExpiry <= WARNING_BEFORE_EXPIRY_MS && timeUntilExpiry > 0) {
      const minutes = Math.ceil(timeUntilExpiry / 60000);
      setMinutesUntilExpiry(minutes);
      setShowWarning(true);
      options.onWarning?.(minutes);
    } else {
      setShowWarning(false);
      setMinutesUntilExpiry(null);
    }
  }, [isAuthenticated, expiresAt, dispatch, options]);

  /**
   * Check if user has been idle too long
   */
  const checkIdleTimeout = useCallback(() => {
    if (!isAuthenticated || !lastActivity) return;

    const now = Date.now();
    const lastActive = new Date(lastActivity).getTime();
    const idleDuration = now - lastActive;

    if (idleDuration > IDLE_TIMEOUT_MS) {
      dispatch(sessionExpired());
      dispatch(clearPermissions());
      setShowWarning(false);
      options.onSessionExpired?.();
    }
  }, [isAuthenticated, lastActivity, dispatch, options]);

  /**
   * Track user activity
   */
  const trackActivity = useCallback(() => {
    if (isAuthenticated) {
      dispatch(updateActivity());
      setShowWarning(false); // Reset warning on activity
    }
  }, [isAuthenticated, dispatch]);

  /**
   * Setup activity listeners
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, trackActivity);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, trackActivity);
      });
    };
  }, [isAuthenticated, trackActivity]);

  /**
   * Setup session check interval
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check immediately
    checkSessionExpiry();
    checkIdleTimeout();

    // Then check periodically
    const interval = setInterval(() => {
      checkSessionExpiry();
      checkIdleTimeout();
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isAuthenticated, checkSessionExpiry, checkIdleTimeout]);

  return {
    showWarning,
    minutesUntilExpiry,
    trackActivity,
  };
};
