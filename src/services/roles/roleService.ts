/**
 * Role Service
 *
 * Handles role CRUD operations with security safeguards
 * - SUPER_ADMIN deletion protection
 * - Role deletion cascade validation
 * - Permission validation
 */

import rolesData from '../../data/roles.json';
import usersData from '../../data/users.json';
import permissionsData from '../../data/permissions.json';
import type { Role, ServiceResponse } from '../../types';

/**
 * Simulates API latency
 */
const simulateApiLatency = () => new Promise((resolve) => setTimeout(resolve, 300));

/**
 * Get all roles
 */
export const getAllRoles = async (): Promise<ServiceResponse<Role[]>> => {
  await simulateApiLatency();

  try {
    return {
      success: true,
      data: rolesData as unknown as Role[],
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_ROLES_ERROR',
        message: 'Failed to fetch roles',
        details: error,
      },
    };
  }
};

/**
 * Get role by ID
 */
export const getRoleById = async (roleId: string): Promise<ServiceResponse<Role | null>> => {
  await simulateApiLatency();

  try {
    const role = rolesData.find((r) => r.uuid === roleId) as Role | undefined;

    return {
      success: true,
      data: role || null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_ROLE_ERROR',
        message: `Failed to fetch role: ${roleId}`,
        details: error,
      },
    };
  }
};

/**
 * Get role by key
 */
export const getRoleByKey = async (roleKey: string): Promise<ServiceResponse<Role | null>> => {
  await simulateApiLatency();

  try {
    const role = rolesData.find((r) => r.uuid === roleKey) as Role | undefined;

    return {
      success: true,
      data: role || null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_ROLE_BY_KEY_ERROR',
        message: `Failed to fetch role by key: ${roleKey}`,
        details: error,
      },
    };
  }
};

/**
 * Get users assigned to a role
 */
export const getUsersByRole = async (roleId: string): Promise<ServiceResponse<number>> => {
  await simulateApiLatency();

  try {
    const userCount = usersData.users.filter((u) => u.roleId === roleId).length;

    return {
      success: true,
      data: userCount,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_USERS_BY_ROLE_ERROR',
        message: `Failed to count users for role: ${roleId}`,
        details: error,
      },
    };
  }
};

/**
 * Count users with specific role key (for SUPER_ADMIN protection)
 */
export const countUsersWithRoleKey = async (roleKey: string): Promise<ServiceResponse<number>> => {
  await simulateApiLatency();

  try {
    // Find role by key
    const role = rolesData.find((r) => r.uuid === roleKey);
    if (!role) {
      return {
        success: true,
        data: 0,
      };
    }

    // Count users with this role
    const userCount = usersData.users.filter((u) => u.roleId === role.uuid).length;

    return {
      success: true,
      data: userCount,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'COUNT_USERS_ERROR',
        message: `Failed to count users with role key: ${roleKey}`,
        details: error,
      },
    };
  }
};

/**
 * Validate if role can be deleted (CRITICAL SECURITY CHECK)
 */
export const canDeleteRole = async (
  roleId: string
): Promise<ServiceResponse<{ canDelete: boolean; reason?: string }>> => {
  await simulateApiLatency();

  try {
    const role = rolesData.find((r) => r.uuid === roleId) as Role | undefined;

    if (!role) {
      return {
        success: false,
        error: {
          code: 'ROLE_NOT_FOUND',
          message: 'Role not found',
        },
      };
    }

    // Check if it's SUPER_ADMIN role
    if (role.key === 'super_admin') {
      const superAdminCount = usersData.users.filter(
        (u) => u.roleId === role.id
      ).length;

      if (superAdminCount <= 1) {
        return {
          success: true,
          data: {
            canDelete: false,
            reason: 'Cannot delete the last SUPER_ADMIN account. System requires at least one SUPER_ADMIN.',
          },
        };
      }
    }

    // Check if users are assigned to this role
    const assignedUsers = usersData.users.filter((u) => u.roleId === roleId).length;

    if (assignedUsers > 0) {
      return {
        success: true,
        data: {
          canDelete: false,
          reason: `Cannot delete role. ${assignedUsers} user(s) are currently assigned to this role.`,
        },
      };
    }

    // Check if it's a system role (can be edited but not deleted)
    if (role.isSystem) {
      return {
        success: true,
        data: {
          canDelete: false,
          reason: 'System roles cannot be deleted. You can deactivate them instead.',
        },
      };
    }

    return {
      success: true,
      data: {
        canDelete: true,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'VALIDATE_DELETE_ERROR',
        message: 'Failed to validate role deletion',
        details: error,
      },
    };
  }
};

/**
 * Create new role
 */
export const createRole = async (
  roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServiceResponse<Role>> => {
  await simulateApiLatency();

  try {
    // Validate role key is unique
    const existingRole = rolesData.find((r) => r.uuid === roleData.key);
    if (existingRole) {
      return {
        success: false,
        error: {
          code: 'DUPLICATE_ROLE_KEY',
          message: `Role key '${roleData.key}' already exists`,
        },
      };
    }

    // Validate permissions exist
    const validPermissions = new Set(permissionsData.map((p) => p.uuid));
    const invalidPermissions = roleData.permissions.filter((p: any) => !validPermissions.has(p));

    if (invalidPermissions.length > 0) {
      return {
        success: false,
        error: {
          code: 'INVALID_PERMISSIONS',
          message: `Invalid permission keys: ${invalidPermissions.join(', ')}`,
        },
      };
    }

    // Validate at least one permission is assigned
    if (roleData.permissions.length === 0) {
      return {
        success: false,
        error: {
          code: 'NO_PERMISSIONS',
          message: 'Role must have at least one permission',
        },
      };
    }

    // Generate new role ID
    const newId = `role_${Date.now()}`;
    const now = new Date().toISOString();

    const newRole: Role = {
      ...roleData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    // In real API, this would save to database
    // For mock, we'll just return the new role
    return {
      success: true,
      data: newRole,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CREATE_ROLE_ERROR',
        message: 'Failed to create role',
        details: error,
      },
    };
  }
};

/**
 * Update role
 */
export const updateRole = async (
  roleId: string,
  updates: Partial<Omit<Role, 'id' | 'createdAt' | 'createdBy'>>
): Promise<ServiceResponse<Role>> => {
  await simulateApiLatency();

  try {
    const role = rolesData.find((r) => r.uuid === roleId) as Role | undefined;

    if (!role) {
      return {
        success: false,
        error: {
          code: 'ROLE_NOT_FOUND',
          message: 'Role not found',
        },
      };
    }

    // Validate role key uniqueness if being changed
    if (updates.key && updates.key !== role.key) {
      const existingRole = rolesData.find((r) => r.uuid === updates.key);
      if (existingRole) {
        return {
          success: false,
          error: {
            code: 'DUPLICATE_ROLE_KEY',
            message: `Role key '${updates.key}' already exists`,
          },
        };
      }
    }

    // Validate permissions if being updated
    if (updates.permissions) {
      const validPermissions = new Set(permissionsData.map((p) => p.uuid));
      const invalidPermissions = updates.permissions.filter((p: any) => !validPermissions.has(p));

      if (invalidPermissions.length > 0) {
        return {
          success: false,
          error: {
            code: 'INVALID_PERMISSIONS',
            message: `Invalid permission keys: ${invalidPermissions.join(', ')}`,
          },
        };
      }

      // Validate at least one permission
      if (updates.permissions.length === 0) {
        return {
          success: false,
          error: {
            code: 'NO_PERMISSIONS',
            message: 'Role must have at least one permission',
          },
        };
      }

      // CRITICAL: Prevent removing system.admin from SUPER_ADMIN role
      // if (role.key === 'super_admin' && !updates.permissions.includes('system.admin')) {
      //   return {
      //     success: false,
      //     error: {
      //       code: 'INVALID_SUPER_ADMIN_PERMISSIONS',
      //       message: 'Cannot remove system.admin permission from SUPER_ADMIN role',
      //     },
      //   };
      // }
    }

    const updatedRole: Role = {
      ...role,
      ...updates,
      id: roleId, // Ensure ID doesn't change
      createdAt: role.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: updatedRole,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UPDATE_ROLE_ERROR',
        message: 'Failed to update role',
        details: error,
      },
    };
  }
};

/**
 * Delete role (with validation)
 */
export const deleteRole = async (roleId: string): Promise<ServiceResponse<void>> => {
  await simulateApiLatency();

  try {
    // Validate deletion is allowed
    const validationResult = await canDeleteRole(roleId);

    if (!validationResult.success) {
      return validationResult as ServiceResponse<void>;
    }

    if (!validationResult.data?.canDelete) {
      return {
        success: false,
        error: {
          code: 'DELETE_NOT_ALLOWED',
          message: validationResult.data?.reason || 'Role cannot be deleted',
        },
      };
    }

    // In real API, this would delete from database
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DELETE_ROLE_ERROR',
        message: 'Failed to delete role',
        details: error,
      },
    };
  }
};

/**
 * Duplicate role (create copy with modified name)
 */
export const duplicateRole = async (roleId: string): Promise<ServiceResponse<Role>> => {
  await simulateApiLatency();

  try {
    const role = rolesData.find((r) => r.uuid === roleId) as Role | undefined;

    if (!role) {
      return {
        success: false,
        error: {
          code: 'ROLE_NOT_FOUND',
          message: 'Role not found',
        },
      };
    }

    // Create new role data with " (Copy)" suffix
    const newRoleData: any = {
      name: `${role.name} (Copy)`,
      key: `${role.key}_copy_${Date.now()}`,
      description: role.description,
      isSystem: false, // Copied roles are always custom
      isActive: role.isActive,
      permissions: [...role.permissions],
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
    };

    return createRole(newRoleData);
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DUPLICATE_ROLE_ERROR',
        message: 'Failed to duplicate role',
        details: error,
      },
    };
  }
};

/**
 * Search roles by name or description
 */
export const searchRoles = async (query: string): Promise<ServiceResponse<Role[]>> => {
  await simulateApiLatency();

  try {
    const lowercaseQuery = query.toLowerCase();
    const results = rolesData.filter(
      (r: any) => r.name.toLowerCase().includes(lowercaseQuery) ||
        r.key.toLowerCase().includes(lowercaseQuery) ||
        r.description.toLowerCase().includes(lowercaseQuery)
    ) as unknown as Role[];

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'SEARCH_ROLES_ERROR',
        message: 'Failed to search roles',
        details: error,
      },
    };
  }
};

/**
 * Get active roles only
 */
export const getActiveRoles = async (): Promise<ServiceResponse<Role[]>> => {
  await simulateApiLatency();

  try {
    const activeRoles = rolesData.filter((r: any) => r.isActive) as unknown as Role[];

    return {
      success: true,
      data: activeRoles,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_ACTIVE_ROLES_ERROR',
        message: 'Failed to fetch active roles',
        details: error,
      },
    };
  }
};

/**
 * Get system roles only
 */
export const getSystemRoles = async (): Promise<ServiceResponse<Role[]>> => {
  await simulateApiLatency();

  try {
    const systemRoles = rolesData.filter((r: any) => r.isSystem) as unknown as Role[];

    return {
      success: true,
      data: systemRoles,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_SYSTEM_ROLES_ERROR',
        message: 'Failed to fetch system roles',
        details: error,
      },
    };
  }
};

/**
 * Get custom roles only
 */
export const getCustomRoles = async (): Promise<ServiceResponse<Role[]>> => {
  await simulateApiLatency();

  try {
    const customRoles = rolesData.filter((r: any) => !r.isSystem) as unknown as Role[];

    return {
      success: true,
      data: customRoles,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_CUSTOM_ROLES_ERROR',
        message: 'Failed to fetch custom roles',
        details: error,
      },
    };
  }
};
