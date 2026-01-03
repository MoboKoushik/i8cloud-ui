/**
 * Role Types for Dynamic RBAC System
 *
 * Roles are fully dynamic and can be created/modified by SUPER ADMIN
 */

import { Permission } from './permission.types';

export interface Role {
  id: string;
  name: string; // Display name, e.g., "Security Administrator"
  key: string; // Machine-readable key, e.g., "security_admin"
  description: string; // Role purpose and scope
  isSystem: boolean; // true for default roles, false for custom roles
  isActive: boolean; // Can be deactivated without deletion
  is_admin: boolean; // true for admin roles (only admins can access admin menu)
  permissions: Permission[]; // Array of permission objects with { uuid, subject, action }
  createdAt: string; // ISO timestamp
  createdBy: string; // User ID who created this role
  updatedAt: string; // ISO timestamp
  updatedBy: string; // User ID who last updated this role
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'SECURITY_ADMIN'
  | 'AUDITOR'
  | 'INTEGRATION_ENGINEER'
  | 'BUSINESS_USER'
  | string; // Allow custom role keys

export interface RoleFormData {
  name: string;
  key: string;
  description: string;
  isActive: boolean;
  permissions: Permission[];
}
