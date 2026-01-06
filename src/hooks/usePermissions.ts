/**
 * usePermissions Hook
 *
 * Provides permission checking functionality
 * O(1) lookups via permissionMap
 */

import { useCallback, useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import {
  hasPermission as checkPermission,
  hasAnyPermission as checkAnyPermission,
  hasAllPermissions as checkAllPermissions,
} from '../utils/permissions';

export const usePermissions = () => {
  const { permissions, permissionMap } = useAppSelector((state) => state.permissions);

  /**
   * Check if user has a specific permission (O(1))
   */
  const hasPermission = useCallback(
    (permissionKey: string): boolean => {
      return checkPermission(permissionKey, permissionMap);
    },
    [permissionMap]
  );

  /**
   * Check if user has ANY of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (permissionKeys: string[]): boolean => {
      return checkAnyPermission(permissionKeys, permissionMap);
    },
    [permissionMap]
  );

  /**
   * Check if user has ALL of the specified permissions
   */
  const hasAllPermissions = useCallback(
    (permissionKeys: string[]): boolean => {
      return checkAllPermissions(permissionKeys, permissionMap);
    },
    [permissionMap]
  );

  /**
   * Get permission keys user has
   */
  const getPermissionKeys = useCallback((): (string | undefined)[] => {
    return permissions.map((p) => p.key);
  }, [permissions]);

  /**
   * Check if user has module access (at least view permission)
   */
  const hasModuleAccess = useCallback(
    (moduleKey: string): boolean => {
      return hasPermission(`${moduleKey}.view`);
    },
    [hasPermission]
  );

  /**
   * Check if user can create in module
   */
  const canCreate = useCallback(
    (moduleKey: string): boolean => {
      return hasPermission(`${moduleKey}.create`);
    },
    [hasPermission]
  );

  /**
   * Check if user can edit in module
   */
  const canEdit = useCallback(
    (moduleKey: string): boolean => {
      return hasPermission(`${moduleKey}.edit`);
    },
    [hasPermission]
  );

  /**
   * Check if user can delete in module
   */
  const canDelete = useCallback(
    (moduleKey: string): boolean => {
      return hasPermission(`${moduleKey}.delete`);
    },
    [hasPermission]
  );

  /**
   * Check if user can export from module
   */
  const canExport = useCallback(
    (moduleKey: string): boolean => {
      return hasPermission(`${moduleKey}.export`);
    },
    [hasPermission]
  );

  /**
   * Get all permissions for a specific module
   */
  const getModulePermissions = useCallback(
    (moduleKey: string) => {
      return permissions.filter((p) => p.module === moduleKey);
    },
    [permissions]
  );

  /**
   * Check if user is super admin
   */
  const isSuperAdmin = useMemo(() => {
    return hasPermission('system.admin');
  }, [hasPermission]);

  /**
   * Check if user can manage roles
   */
  const canManageRoles = useMemo(() => {
    return hasAnyPermission(['roles.create', 'roles.edit', 'roles.delete']);
  }, [hasAnyPermission]);

  /**
   * Check if user can manage users
   */
  const canManageUsers = useMemo(() => {
    return hasAnyPermission(['users.create', 'users.edit', 'users.delete']);
  }, [hasAnyPermission]);

  /**
   * Get permission count
   */
  const permissionCount = useMemo(() => {
    return permissions.length;
  }, [permissions.length]);

  return {
    // All permissions
    permissions,
    permissionMap,
    permissionCount,

    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissionKeys,

    // Module-level permissions
    hasModuleAccess,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    getModulePermissions,

    // Admin permissions
    isSuperAdmin,
    canManageRoles,
    canManageUsers,
  };
};
