/**
 * Permission Utilities
 *
 * Helper functions for permission checking and validation
 */

import { PermissionMap, Permission } from '../types';

/**
 * Check if user has a specific permission (O(1) lookup)
 */
export const hasPermission = (permissionKey: string, permissionMap: PermissionMap): boolean => {
  return !!permissionMap[permissionKey];
};

/**
 * Check if user has ANY of the specified permissions
 */
export const hasAnyPermission = (
  permissionKeys: string[],
  permissionMap: PermissionMap
): boolean => {
  return permissionKeys.some((key) => hasPermission(key, permissionMap));
};

/**
 * Check if user has ALL of the specified permissions
 */
export const hasAllPermissions = (
  permissionKeys: string[],
  permissionMap: PermissionMap
): boolean => {
  return permissionKeys.every((key) => hasPermission(key, permissionMap));
};

/**
 * Get missing permissions from required list
 */
export const getMissingPermissions = (
  requiredPermissions: string[],
  userPermissions: PermissionMap
): string[] => {
  return requiredPermissions.filter((key) => !hasPermission(key, userPermissions));
};

/**
 * Create permission map from permission array
 */
export const createPermissionMap = (permissions: Permission[]): PermissionMap => {
  return permissions.reduce((acc, perm) => {
    acc[perm.key] = true;
    return acc;
  }, {} as PermissionMap);
};

/**
 * Group permissions by module
 */
export const groupPermissionsByModule = (
  permissions: Permission[]
): Record<string, Permission[]> => {
  return permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);
};

/**
 * Filter permissions by category
 */
export const filterPermissionsByCategory = (
  permissions: Permission[],
  category: 'module' | 'admin'
): Permission[] => {
  return permissions.filter((p) => p.category === category);
};

/**
 * Filter permissions by risk level
 */
export const filterPermissionsByRiskLevel = (
  permissions: Permission[],
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
): Permission[] => {
  return permissions.filter((p) => p.riskLevel === riskLevel);
};

/**
 * Get high-risk permissions (high + critical)
 */
export const getHighRiskPermissions = (permissions: Permission[]): Permission[] => {
  return permissions.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'critical');
};

/**
 * Compare two permission arrays and find differences
 */
export const comparePermissions = (
  oldPermissions: string[],
  newPermissions: string[]
): {
  added: string[];
  removed: string[];
  unchanged: string[];
} => {
  const oldSet = new Set(oldPermissions);
  const newSet = new Set(newPermissions);

  const added = newPermissions.filter((p) => !oldSet.has(p));
  const removed = oldPermissions.filter((p) => !newSet.has(p));
  const unchanged = oldPermissions.filter((p) => newSet.has(p));

  return { added, removed, unchanged };
};

/**
 * Get permission display name from key
 */
export const getPermissionDisplayName = (
  permissionKey: string,
  allPermissions: Permission[]
): string => {
  const permission = allPermissions.find((p) => p.key === permissionKey);
  return permission ? `${permission.moduleDisplayName} - ${permission.actionDisplayName}` : permissionKey;
};

/**
 * Validate permission key format (module.action)
 */
export const isValidPermissionKeyFormat = (key: string): boolean => {
  const parts = key.split('.');
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
};

/**
 * Extract module and action from permission key
 */
export const parsePermissionKey = (
  key: string
): { module: string; action: string } | null => {
  if (!isValidPermissionKeyFormat(key)) {
    return null;
  }

  const [module, action] = key.split('.');
  return { module, action };
};

/**
 * Get all "view" permissions (for quick "View Only" role creation)
 */
export const getViewOnlyPermissions = (permissions: Permission[]): string[] => {
  return permissions.filter((p) => p.action === 'view').map((p) => p.key);
};

/**
 * Get all permissions for a specific module
 */
export const getModulePermissions = (
  permissions: Permission[],
  moduleKey: string
): Permission[] => {
  return permissions.filter((p) => p.module === moduleKey);
};
