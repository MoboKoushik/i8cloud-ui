/**
 * Data Manager Service
 *
 * Manages CRUD operations for users, roles, and permissions
 * Stores data in localStorage and provides methods to export JSON
 */

import usersDataImport from '../data/users.json';
import rolesDataImport from '../data/roles.json';
import permissionsDataImport from '../data/permissions.json';
import rolePermissionMapDataImport from '../data/role-permission-map.json';

const STORAGE_KEYS = {
  USERS: 'app_users_data',
  ROLES: 'app_roles_data',
  PERMISSIONS: 'app_permissions_data',
  ROLE_PERMISSION_MAP: 'app_role_permission_map_data',
};

// Initialize data from JSON files or localStorage
const initializeData = <T>(key: string, defaultData: T): T => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Error parsing ${key}:`, e);
    }
  }
  return defaultData;
};

// Users Management
let usersData = initializeData(STORAGE_KEYS.USERS, usersDataImport.users);

export const getUsers = () => usersData;

export const getUserById = (id: string) => usersData.find(u => u.id === id);

export const createUser = (userData: any) => {
  const timestamp = Date.now();
  const newUser = {
    ...userData,
    id: `user_${timestamp}`,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  usersData = [...usersData, newUser];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData));
  return newUser;
};

export const updateUser = (id: string, updates: any) => {
  usersData = usersData.map(user =>
    user.id === id ? { ...user, ...updates } : user
  );
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData));
  return usersData.find(u => u.id === id);
};

export const deleteUser = (id: string) => {
  usersData = usersData.filter(user => user.id !== id);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData));
  return true;
};

// Roles Management
let rolesData = initializeData(STORAGE_KEYS.ROLES, rolesDataImport);

export const getRoles = () => rolesData;

export const getRoleById = (uuid: string) => rolesData.find(r => r.uuid === uuid);

export const createRole = (roleData: any) => {
  const timestamp = Date.now();
  const newRole = {
    ...roleData,
    uuid: `role-${timestamp}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  rolesData = [...rolesData, newRole];
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(rolesData));
  return newRole;
};

export const updateRole = (uuid: string, updates: any) => {
  rolesData = rolesData.map(role =>
    role.uuid === uuid
      ? { ...role, ...updates, updated_at: new Date().toISOString() }
      : role
  );
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(rolesData));
  return rolesData.find(r => r.uuid === uuid);
};

export const deleteRole = (uuid: string) => {
  // Check if any users are assigned to this role
  const roleMapping: Record<string, string> = {
    'role_001': 'role-001',
    'role_002': 'role-002',
    'role_003': 'role-003',
    'role_004': 'role-004',
    'role_005': 'role-002',
    'role_006': 'role-002',
  };

  // Find old role IDs that map to this role
  const oldRoleIds = Object.entries(roleMapping)
    .filter(([_, newId]) => newId === uuid)
    .map(([oldId, _]) => oldId);

  const hasUsers = usersData.some(user =>
    user.roleId === uuid || oldRoleIds.includes(user.roleId)
  );

  if (hasUsers) {
    throw new Error('Cannot delete role: Users are still assigned to this role');
  }

  rolesData = rolesData.filter(role => role.uuid !== uuid);
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(rolesData));

  // Also delete role-permission mappings
  deleteRolePermissionsByRole(uuid);

  return true;
};

// Permissions Management
let permissionsData = initializeData(STORAGE_KEYS.PERMISSIONS, permissionsDataImport);

export const getPermissions = () => permissionsData;

export const getPermissionById = (uuid: string) => permissionsData.find(p => p.uuid === uuid);

export const getPermissionsBySubject = (subject: string) =>
  permissionsData.filter(p => p.subject === subject);

export const createPermission = (permissionData: any) => {
  const timestamp = Date.now();
  const newPermission = {
    ...permissionData,
    uuid: `perm-${timestamp}`,
  };
  permissionsData = [...permissionsData, newPermission];
  localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissionsData));
  return newPermission;
};

export const createModulePermissions = (moduleName: string) => {
  const timestamp = Date.now();
  const actions = ['create', 'read', 'update', 'delete'];

  const newPermissions = actions.map((action, index) => ({
    uuid: `perm-${timestamp}-${index}`,
    subject: moduleName,
    action: action,
  }));

  permissionsData = [...permissionsData, ...newPermissions];
  localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissionsData));
  return newPermissions;
};

export const updatePermission = (uuid: string, updates: any) => {
  permissionsData = permissionsData.map(perm =>
    perm.uuid === uuid ? { ...perm, ...updates } : perm
  );
  localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissionsData));
  return permissionsData.find(p => p.uuid === uuid);
};

export const deletePermission = (uuid: string) => {
  // Check if permission is assigned to any role
  const hasRoleMapping = rolePermissionMapData.some(
    mapping => mapping.permission_id === uuid
  );

  if (hasRoleMapping) {
    throw new Error('Cannot delete permission: It is assigned to one or more roles');
  }

  permissionsData = permissionsData.filter(perm => perm.uuid !== uuid);
  localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissionsData));
  return true;
};

export const deleteModulePermissions = (moduleName: string) => {
  // Check if any permissions from this module are assigned to roles
  const modulePermissions = permissionsData.filter(p => p.subject === moduleName);
  const modulePermissionIds = modulePermissions.map(p => p.uuid);

  const hasRoleMapping = rolePermissionMapData.some(
    mapping => modulePermissionIds.includes(mapping.permission_id)
  );

  if (hasRoleMapping) {
    throw new Error(`Cannot delete module: Permissions are assigned to one or more roles`);
  }

  permissionsData = permissionsData.filter(perm => perm.subject !== moduleName);
  localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissionsData));
  return true;
};

// Role-Permission Mapping Management
let rolePermissionMapData = initializeData(
  STORAGE_KEYS.ROLE_PERMISSION_MAP,
  rolePermissionMapDataImport
);

export const getRolePermissionMap = () => rolePermissionMapData;

export const getPermissionsByRoleId = (roleId: string) => {
  const mappings = rolePermissionMapData.filter(m => m.role_id === roleId);
  return mappings.map(m => {
    const permission = permissionsData.find(p => p.uuid === m.permission_id);
    return permission;
  }).filter(Boolean);
};

export const updateRolePermissions = (roleId: string, permissionIds: string[]) => {
  // Remove existing mappings for this role
  rolePermissionMapData = rolePermissionMapData.filter(m => m.role_id !== roleId);

  // Create new mappings
  const timestamp = Date.now();
  const newMappings = permissionIds.map((permId, index) => ({
    uuid: `rp-${timestamp}-${index}`,
    role_id: roleId,
    permission_id: permId,
  }));

  rolePermissionMapData = [...rolePermissionMapData, ...newMappings];
  localStorage.setItem(STORAGE_KEYS.ROLE_PERMISSION_MAP, JSON.stringify(rolePermissionMapData));
  return newMappings;
};

export const deleteRolePermissionsByRole = (roleId: string) => {
  rolePermissionMapData = rolePermissionMapData.filter(m => m.role_id !== roleId);
  localStorage.setItem(STORAGE_KEYS.ROLE_PERMISSION_MAP, JSON.stringify(rolePermissionMapData));
  return true;
};

// Export functions to download JSON files
export const exportUsersJSON = () => {
  const dataStr = JSON.stringify({ users: usersData }, null, 2);
  downloadJSON(dataStr, 'users.json');
};

export const exportRolesJSON = () => {
  const dataStr = JSON.stringify(rolesData, null, 2);
  downloadJSON(dataStr, 'roles.json');
};

export const exportPermissionsJSON = () => {
  const dataStr = JSON.stringify(permissionsData, null, 2);
  downloadJSON(dataStr, 'permissions.json');
};

export const exportRolePermissionMapJSON = () => {
  const dataStr = JSON.stringify(rolePermissionMapData, null, 2);
  downloadJSON(dataStr, 'role-permission-map.json');
};

export const exportAllJSON = () => {
  exportUsersJSON();
  exportRolesJSON();
  exportPermissionsJSON();
  exportRolePermissionMapJSON();
};

const downloadJSON = (dataStr: string, filename: string) => {
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', filename);
  linkElement.click();
};

// Reset to original data
export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.ROLES);
  localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
  localStorage.removeItem(STORAGE_KEYS.ROLE_PERMISSION_MAP);

  usersData = usersDataImport.users;
  rolesData = rolesDataImport;
  permissionsData = permissionsDataImport;
  rolePermissionMapData = rolePermissionMapDataImport;

  return true;
};
