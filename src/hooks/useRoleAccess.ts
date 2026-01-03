/**
 * useRoleAccess Hook
 *
 * Provides role-based access checking
 */

import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { usePermissions } from './usePermissions';

export const useRoleAccess = () => {
  const { role } = useAppSelector((state) => state.auth);
  const { hasPermission, hasAnyPermission } = usePermissions();

  /**
   * Check if user has specific role
   */
  const hasRole = useMemo(() => {
    return (roleKey: string): boolean => {
      return role === roleKey;
    };
  }, [role]);

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useMemo(() => {
    return (roleKeys: string[]): boolean => {
      return roleKeys.includes(role || '');
    };
  }, [role]);

  /**
   * Is Super Admin
   */
  const isSuperAdmin = useMemo(() => {
    return role === 'super_admin' || hasPermission('system.admin');
  }, [role, hasPermission]);

  /**
   * Is Security Admin
   */
  const isSecurityAdmin = useMemo(() => {
    return role === 'security_admin';
  }, [role]);

  /**
   * Is Auditor
   */
  const isAuditor = useMemo(() => {
    return role === 'auditor';
  }, [role]);

  /**
   * Is Integration Engineer
   */
  const isIntegrationEngineer = useMemo(() => {
    return role === 'integration_engineer';
  }, [role]);

  /**
   * Is Business User
   */
  const isBusinessUser = useMemo(() => {
    return role === 'business_user';
  }, [role]);

  /**
   * Can access admin features
   */
  const canAccessAdmin = useMemo(() => {
    return hasAnyPermission(['roles.view', 'users.view', 'system.admin']);
  }, [hasAnyPermission]);

  /**
   * Can manage roles
   */
  const canManageRoles = useMemo(() => {
    return hasAnyPermission(['roles.create', 'roles.edit', 'roles.delete']);
  }, [hasAnyPermission]);

  /**
   * Can manage users
   */
  const canManageUsers = useMemo(() => {
    return hasAnyPermission(['users.create', 'users.edit', 'users.delete', 'users.change_role']);
  }, [hasAnyPermission]);

  /**
   * Can view audit logs
   */
  const canViewAudit = useMemo(() => {
    return hasPermission('audit.view_all');
  }, [hasPermission]);

  /**
   * Is read-only user (only view permissions)
   */
  const isReadOnly = useMemo(() => {
    return isAuditor || isBusinessUser;
  }, [isAuditor, isBusinessUser]);

  /**
   * Has elevated permissions (admin or security admin)
   */
  const hasElevatedAccess = useMemo(() => {
    return isSuperAdmin || isSecurityAdmin;
  }, [isSuperAdmin, isSecurityAdmin]);

  return {
    // Current role
    role,

    // Role checking
    hasRole,
    hasAnyRole,

    // Specific roles
    isSuperAdmin,
    isSecurityAdmin,
    isAuditor,
    isIntegrationEngineer,
    isBusinessUser,

    // Access levels
    canAccessAdmin,
    canManageRoles,
    canManageUsers,
    canViewAudit,
    isReadOnly,
    hasElevatedAccess,
  };
};
