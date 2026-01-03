/**
 * Permission Types for Dynamic RBAC System
 *
 * New format: { uuid, subject, action }
 * e.g., { uuid: "perm_001", subject: "user", action: "create" }
 */

export interface Permission {
  uuid: string; // Unique permission identifier
  subject: string; // CASL subject (e.g., "user", "role", "category", "product")
  action: string; // CASL action (e.g., "create", "read", "update", "delete")

  // Optional fields for UI display (may not be present in all permissions)
  key?: string; // Permission key (e.g., "user.create")
  actionDisplayName?: string; // Human-readable action name
  moduleDisplayName?: string; // Human-readable module name
  description?: string; // Permission description
  module?: string; // Module this permission belongs to
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'; // Risk level
  requiresApproval?: boolean; // Whether this permission requires approval
  category?: 'module' | 'admin'; // Permission category
}

export type PermissionKey = string; // e.g., "user.create"

/**
 * Permission lookup map for O(1) access checks
 * Structure: { "user.create": true, "role.read": true, ... }
 */
export type PermissionMap = Record<PermissionKey, boolean>;
