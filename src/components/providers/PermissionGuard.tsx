/**
 * PermissionGuard Component
 *
 * Conditionally renders children based on user permissions
 * Hides elements if user lacks required permissions
 */

import { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

interface PermissionGuardProps {
  permission?: string; // Single permission key
  permissions?: string[]; // Multiple permission keys
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  fallback?: ReactNode; // Optional fallback to render if no permission
  children: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions,
  requireAll = true,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // Determine if user has access
  let hasAccess = false;

  if (permission) {
    // Single permission check
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    // Multiple permissions check
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    // No permissions specified - allow access
    hasAccess = true;
  }

  // Render children if has access, otherwise render fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
