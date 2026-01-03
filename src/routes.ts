/**
 * Application Routes
 */

export const ROUTES = {
  // Auth
  LOGIN: '/auth/login',

  // Dashboard
  DASHBOARD: '/app',

  // Admin
  ADMIN_PERMISSIONS: '/app/admin/permissions',
  ADMIN_ROLES: '/app/admin/roles',
  ADMIN_ROLES_CREATE: '/app/admin/roles/create',
  ADMIN_ROLES_EDIT: '/app/admin/roles/:id/edit',
  ADMIN_ROLES_DETAIL: '/app/admin/roles/:id',
  ADMIN_USERS: '/app/admin/users',
  ADMIN_USERS_CREATE: '/app/admin/users/create',
  ADMIN_USERS_EDIT: '/app/admin/users/:id/edit',
  ADMIN_USERS_DETAIL: '/app/admin/users/:id',
  ADMIN_AUDIT: '/app/admin/audit',

  // Error pages
  UNAUTHORIZED: '/403',
  NOT_FOUND: '/404',
} as const;

/**
 * Build a route with dynamic parameters
 * @param route - Route template with :param placeholders
 * @param params - Object with parameter values
 * @returns Built route string
 */
export const buildRoute = (route: string, params: Record<string, string | number>): string => {
  let result = route;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};
