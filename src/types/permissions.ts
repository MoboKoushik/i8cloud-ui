/**
 * Permission Types and Constants
 */

export type Action = 'create' | 'read' | 'update' | 'delete';

export type Subject =
  | 'dashboard'
  | 'raas'
  | 'integration'
  | 'access-audit'
  | 'security'
  | 'security-group'
  | 'business-process'
  | 'domain-process'
  | 'segregation-duties'
  | 'settings'
  | 'users'
  | 'roles'
  | 'permissions'
  | 'all'; // SuperAdmin has permission on 'all'

export interface Permission {
  id: number;
  action: Action;
  subject: Subject;
  description?: string;
}

export interface RolePermission {
  roleId: number;
  permissionId: number;
  permission: Permission;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  is_admin: number; // 1 for admin, 0 for regular
  is_superadmin?: number; // 1 for superadmin
  permissions?: RolePermission[];
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role?: Role;
  created_at?: string;
  updated_at?: string;
}

// Menu item with permissions
export interface MenuItem {
  label: string;
  icon: any;
  path: string;
  subject: Subject;
  requiredAction?: Action; // Default is 'read'
  show?: boolean;
  children?: MenuItem[];
}

// Permission check result
export interface PermissionCheck {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
