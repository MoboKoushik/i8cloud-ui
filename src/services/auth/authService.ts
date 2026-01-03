/**
 * Authentication Service
 *
 * Handles user authentication, session management, and token validation
 * Works with new data structure: users, roles, permissions, role-permission-map
 */

import usersData from '../../data/users.json';
import rolesData from '../../data/roles.json';
import permissionsData from '../../data/permissions.json';
import rolePermissionMapData from '../../data/role-permission-map.json';
import type { ServiceResponse, LoginCredentials, LoginResponse } from '../../types';

/**
 * Simulates API latency for realistic UX
 */
const simulateApiLatency = () => new Promise((resolve) => setTimeout(resolve, 300));

/**
 * Authenticate user with credentials
 */
export const login = async (
  credentials: LoginCredentials
): Promise<ServiceResponse<LoginResponse>> => {
  await simulateApiLatency();

  try {
    console.log('[AUTH] Login attempt:', credentials.username);

    // Find user by username
    const user = usersData.users.find((u) => u.username === credentials.username);

    if (!user) {
      console.log('[AUTH] User not found');
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password',
        },
      };
    }

    // Validate password
    if (user.password !== credentials.password) {
      console.log('[AUTH] Password mismatch');
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password',
        },
      };
    }

    // Validate user status
    if (user.status !== 'active') {
      return {
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: `Account is ${user.status}. Please contact your administrator.`,
        },
      };
    }

    // Find user's role by roleId (users.json has roleId like "role_001")
    // We need to map this to our new roles.json format (which has uuid like "role-001")
    const roleMapping: Record<string, string> = {
      'role_001': 'role-001',
      'role_002': 'role-002',
      'role_003': 'role-003',
      'role_004': 'role-004',
      'role_005': 'role-002', // business user
      'role_006': 'role-003', // regional manager
    };

    const roleUuid = roleMapping[user.roleId];
    const role = rolesData.find((r: any) => r.uuid === roleUuid);

    if (!role) {
      return {
        success: false,
        error: {
          code: 'ROLE_NOT_FOUND',
          message: 'User role not found. Please contact your administrator.',
        },
      };
    }

    // Validate role is active
    if (!role.is_active) {
      return {
        success: false,
        error: {
          code: 'ROLE_INACTIVE',
          message: 'Your role is inactive. Please contact your administrator.',
        },
      };
    }

    // Get permissions for this role from role-permission-map
    const rolePermissionMappings = rolePermissionMapData.filter(
      (rp: any) => rp.role_id === role.uuid
    );

    // Get permission details for each mapping
    const userPermissions = rolePermissionMappings
      .map((rp: any) => {
        const permission = permissionsData.find((p: any) => p.uuid === rp.permission_id);
        if (!permission) return null;
        return {
          subject: permission.subject,
          action: permission.action,
        };
      })
      .filter(Boolean);

    // Generate mock session token
    const token = generateMockToken(user.id);

    // Calculate session expiry (8 hours from now)
    const loginTime = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

    // Return user data in AuthUser format
    const authUser = {
      uuid: user.id,
      type: 'BACKEND' as const,
      name: user.fullName,
      email: user.email,
      role: {
        name: role.name,
        is_admin: role.is_admin,
        permissions: userPermissions,
      },
    };

    console.log('[AUTH] Login successful!', authUser);

    return {
      success: true,
      data: {
        user: authUser,
        role: role.name,
        permissions: userPermissions,
        token,
        loginTime,
        expiresAt,
      },
    } as any;
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    return {
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'An error occurred during login. Please try again.',
        details: error,
      },
    };
  }
};

/**
 * Logout user (clear session)
 */
export const logout = async (): Promise<ServiceResponse<void>> => {
  await simulateApiLatency();

  // In real API, this would invalidate the token on the server
  return {
    success: true,
  };
};

/**
 * Validate session token
 */
export const validateToken = async (token: string): Promise<ServiceResponse<boolean>> => {
  await simulateApiLatency();

  try {
    // In real API, this would validate token with backend
    // For mock, just check if token is not empty
    const isValid = Boolean(token && token.length > 0);

    return {
      success: true,
      data: isValid,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'TOKEN_VALIDATION_ERROR',
        message: 'Failed to validate token',
        details: error,
      },
    };
  }
};

/**
 * Refresh session token
 */
export const refreshToken = async (currentToken: string): Promise<ServiceResponse<string>> => {
  await simulateApiLatency();

  try {
    // In real API, this would exchange old token for new one
    const newToken = generateMockToken(currentToken);

    return {
      success: true,
      data: newToken,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'TOKEN_REFRESH_ERROR',
        message: 'Failed to refresh token',
        details: error,
      },
    };
  }
};

/**
 * Generate mock JWT-like token
 */
function generateMockToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
    })
  );
  const signature = btoa(`mock-signature-${userId}-${Date.now()}`);
  return `${header}.${payload}.${signature}`;
}

/**
 * Get current user by token (for session restoration)
 */
export const getCurrentUser = async (token: string): Promise<ServiceResponse<any>> => {
  await simulateApiLatency();

  try {
    // In real API, backend would decode token and return user
    // For mock, extract userId from token payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user = usersData.users.find((u) => u.id === payload.userId);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };
    }

    return {
      success: true,
      data: {
        ...user,
        password: undefined as any, // Remove password
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_USER_ERROR',
        message: 'Failed to get user information',
        details: error,
      },
    };
  }
};
