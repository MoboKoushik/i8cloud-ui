/**
 * Permission Service
 *
 * Handles permission retrieval and validation
 */

import permissionsData from '../../data/permissions.json';
import modulesData from '../../data/modules.json';
import { Permission, ServiceResponse, PermissionMap } from '../../types';
import { generatePermissionSubject, generatePermissionUUID } from '../../utils/formatters';

/**
 * Simulates API latency
 */
const simulateApiLatency = () => new Promise((resolve) => setTimeout(resolve, 300));

/**
 * Get all available permissions in the system
 */
export const getAllPermissions = async (): Promise<ServiceResponse<Permission[]>> => {
  await simulateApiLatency();

  try {
    return {
      success: true,
      data: permissionsData.permissions as Permission[],
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_PERMISSIONS_ERROR',
        message: 'Failed to fetch permissions',
        details: error,
      },
    };
  }
};

/**
 * Get permissions by module key
 */
export const getPermissionsByModule = async (
  moduleKey: string
): Promise<ServiceResponse<Permission[]>> => {
  await simulateApiLatency();

  try {
    const modulePermissions = permissionsData.permissions.filter(
      (p) => p.module === moduleKey
    ) as Permission[];

    return {
      success: true,
      data: modulePermissions,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_MODULE_PERMISSIONS_ERROR',
        message: `Failed to fetch permissions for module: ${moduleKey}`,
        details: error,
      },
    };
  }
};

/**
 * Get permissions grouped by module
 */
export const getGroupedPermissions = async (): Promise<
  ServiceResponse<Record<string, Permission[]>>
> => {
  await simulateApiLatency();

  try {
    const grouped = permissionsData.permissions.reduce((acc, permission) => {
      const p = permission as Permission;
      if (!acc[p.module]) {
        acc[p.module] = [];
      }
      acc[p.module].push(p);
      return acc;
    }, {} as Record<string, Permission[]>);

    return {
      success: true,
      data: grouped,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_GROUPED_PERMISSIONS_ERROR',
        message: 'Failed to fetch grouped permissions',
        details: error,
      },
    };
  }
};

/**
 * Get permissions by category (module vs admin)
 */
export const getPermissionsByCategory = async (
  category: 'module' | 'admin'
): Promise<ServiceResponse<Permission[]>> => {
  await simulateApiLatency();

  try {
    const categoryPermissions = permissionsData.permissions.filter(
      (p) => p.category === category
    ) as Permission[];

    return {
      success: true,
      data: categoryPermissions,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_CATEGORY_PERMISSIONS_ERROR',
        message: `Failed to fetch ${category} permissions`,
        details: error,
      },
    };
  }
};

/**
 * Get permission by key
 */
export const getPermissionByKey = async (
  key: string
): Promise<ServiceResponse<Permission | null>> => {
  await simulateApiLatency();

  try {
    const permission = (permissionsData.permissions.find((p) => p.key === key) as Permission) || null;

    return {
      success: true,
      data: permission,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_PERMISSION_ERROR',
        message: `Failed to fetch permission: ${key}`,
        details: error,
      },
    };
  }
};

/**
 * Validate permission keys against available permissions
 */
export const validatePermissionKeys = async (
  keys: string[]
): Promise<ServiceResponse<{ valid: boolean; invalidKeys: string[] }>> => {
  await simulateApiLatency();

  try {
    const validKeys = new Set(permissionsData.permissions.map((p) => p.key));
    const invalidKeys = keys.filter((key) => !validKeys.has(key));

    return {
      success: true,
      data: {
        valid: invalidKeys.length === 0,
        invalidKeys,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'VALIDATE_PERMISSIONS_ERROR',
        message: 'Failed to validate permission keys',
        details: error,
      },
    };
  }
};

/**
 * Create permission map from permission array (for O(1) lookups)
 */
export const createPermissionMap = (permissions: Permission[]): PermissionMap => {
  return permissions.reduce((acc, perm) => {
    acc[perm.key] = true;
    return acc;
  }, {} as PermissionMap);
};

/**
 * Get permissions for a specific role
 */
export const getPermissionsForRole = async (
  permissionKeys: string[]
): Promise<ServiceResponse<Permission[]>> => {
  await simulateApiLatency();

  try {
    const rolePermissions = permissionsData.permissions.filter((p) =>
      permissionKeys.includes(p.key)
    ) as Permission[];

    return {
      success: true,
      data: rolePermissions,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_ROLE_PERMISSIONS_ERROR',
        message: 'Failed to fetch role permissions',
        details: error,
      },
    };
  }
};

/**
 * Search permissions by name or description
 */
export const searchPermissions = async (
  query: string
): Promise<ServiceResponse<Permission[]>> => {
  await simulateApiLatency();

  try {
    const lowercaseQuery = query.toLowerCase();
    const results = permissionsData.permissions.filter(
      (p) =>
        p.actionDisplayName.toLowerCase().includes(lowercaseQuery) ||
        p.moduleDisplayName.toLowerCase().includes(lowercaseQuery) ||
        p.description.toLowerCase().includes(lowercaseQuery) ||
        p.key.toLowerCase().includes(lowercaseQuery)
    ) as Permission[];

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'SEARCH_PERMISSIONS_ERROR',
        message: 'Failed to search permissions',
        details: error,
      },
    };
  }
};

/**
 * Create permissions for a new module
 * Generates 4 permissions: create, read, update, delete
 */
export const createPermissionsForModule = async (
  moduleName: string
): Promise<ServiceResponse<Permission[]>> => {
  await simulateApiLatency();

  try {
    // Generate permission subject from module name
    const subject = generatePermissionSubject(moduleName);

    // Check if module already exists (case-insensitive)
    const permissions = Array.isArray(permissionsData) ? permissionsData : permissionsData.permissions || [];
    const existingModule = permissions.find(
      (p: any) => p.subject?.toLowerCase() === subject.toLowerCase()
    );

    if (existingModule) {
      return {
        success: false,
        error: {
          code: 'DUPLICATE_MODULE',
          message: `Permissions for module "${subject}" already exist`,
        },
      };
    }

    // Generate 4 permissions
    const actions = ['create', 'read', 'update', 'delete'];
    const newPermissions: Permission[] = actions.map((action) => ({
      uuid: generatePermissionUUID(),
      subject: subject,
      action: action,
    }));

    // Note: In a real implementation, this would write to the backend API
    // For now, we simulate success and return the permissions
    // The actual file writing would happen on the backend

    return {
      success: true,
      data: newPermissions,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CREATE_PERMISSIONS_ERROR',
        message: 'Failed to create permissions for module',
        details: error,
      },
    };
  }
};
