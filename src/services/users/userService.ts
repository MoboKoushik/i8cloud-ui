/**
 * User Service
 *
 * Handles user CRUD operations with security safeguards
 * - Self-modification protection
 * - Role assignment validation
 * - User status management
 */

import usersData from '../../data/users.json';
import rolesData from '../../data/roles.json';
import { User, UserWithRole, ServiceResponse, UserStatus } from '../../types';

/**
 * Simulates API latency
 */
const simulateApiLatency = () => new Promise((resolve) => setTimeout(resolve, 300));

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<ServiceResponse<User[]>> => {
  await simulateApiLatency();

  try {
    // Remove passwords from response
    const users = usersData.users.map((u) => ({
      ...u,
      password: undefined as any,
    })) as User[];

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_USERS_ERROR',
        message: 'Failed to fetch users',
        details: error,
      },
    };
  }
};

/**
 * Get users with role information
 */
export const getUsersWithRoles = async (): Promise<ServiceResponse<UserWithRole[]>> => {
  await simulateApiLatency();

  try {
    const usersWithRoles = usersData.users.map((user) => {
      const role = rolesData.roles.find((r) => r.id === user.roleId);
      return {
        ...user,
        password: undefined as any,
        roleName: role?.name || 'Unknown',
        roleKey: role?.key || 'unknown',
      } as UserWithRole;
    });

    return {
      success: true,
      data: usersWithRoles,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_USERS_WITH_ROLES_ERROR',
        message: 'Failed to fetch users with roles',
        details: error,
      },
    };
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<ServiceResponse<User | null>> => {
  await simulateApiLatency();

  try {
    const user = usersData.users.find((u) => u.id === userId);

    if (!user) {
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: {
        ...user,
        password: undefined as any,
      } as User,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_USER_ERROR',
        message: `Failed to fetch user: ${userId}`,
        details: error,
      },
    };
  }
};

/**
 * Get users by role ID
 */
export const getUsersByRoleId = async (roleId: string): Promise<ServiceResponse<User[]>> => {
  await simulateApiLatency();

  try {
    const users = usersData.users
      .filter((u) => u.roleId === roleId)
      .map((u) => ({
        ...u,
        password: undefined as any,
      })) as User[];

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_USERS_BY_ROLE_ERROR',
        message: `Failed to fetch users for role: ${roleId}`,
        details: error,
      },
    };
  }
};

/**
 * Alias for getUsersByRoleId (for backwards compatibility)
 */
export const getUsersByRole = getUsersByRoleId;

/**
 * Count users with specific role key
 */
export const countUsersWithRole = async (roleKey: string): Promise<ServiceResponse<number>> => {
  await simulateApiLatency();

  try {
    const role = rolesData.roles.find((r) => r.key === roleKey);
    if (!role) {
      return {
        success: true,
        data: 0,
      };
    }

    const count = usersData.users.filter((u) => u.roleId === role.id).length;

    return {
      success: true,
      data: count,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'COUNT_USERS_ERROR',
        message: `Failed to count users with role: ${roleKey}`,
        details: error,
      },
    };
  }
};

/**
 * Validate if user can be modified (CRITICAL SECURITY CHECK)
 */
export const canModifyUser = async (
  userId: string,
  currentUserId: string,
  action: 'edit' | 'delete' | 'changeRole' | 'deactivate'
): Promise<ServiceResponse<{ canModify: boolean; reason?: string }>> => {
  await simulateApiLatency();

  try {
    // Self-modification check
    if (userId === currentUserId) {
      const actionMessages: Record<typeof action, string> = {
        edit: 'Cannot edit your own account details. Ask another administrator for assistance.',
        delete: 'Cannot delete your own account. Ask another administrator for assistance.',
        changeRole: 'Cannot change your own role. Ask another administrator for assistance.',
        deactivate: 'Cannot deactivate your own account. Ask another administrator for assistance.',
      };

      return {
        success: true,
        data: {
          canModify: false,
          reason: actionMessages[action],
        },
      };
    }

    return {
      success: true,
      data: {
        canModify: true,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'VALIDATE_MODIFY_ERROR',
        message: 'Failed to validate user modification',
        details: error,
      },
    };
  }
};

/**
 * Create new user
 */
export const createUser = async (
  userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'> & { password: string }
): Promise<ServiceResponse<User>> => {
  await simulateApiLatency();

  try {
    // Validate username is unique
    const existingUser = usersData.users.find((u) => u.username === userData.username);
    if (existingUser) {
      return {
        success: false,
        error: {
          code: 'DUPLICATE_USERNAME',
          message: `Username '${userData.username}' already exists`,
        },
      };
    }

    // Validate email is unique
    const existingEmail = usersData.users.find((u) => u.email === userData.email);
    if (existingEmail) {
      return {
        success: false,
        error: {
          code: 'DUPLICATE_EMAIL',
          message: `Email '${userData.email}' already exists`,
        },
      };
    }

    // Validate role exists
    const role = rolesData.roles.find((r) => r.id === userData.roleId);
    if (!role) {
      return {
        success: false,
        error: {
          code: 'ROLE_NOT_FOUND',
          message: 'Selected role does not exist',
        },
      };
    }

    // Validate role is active
    if (!role.isActive) {
      return {
        success: false,
        error: {
          code: 'ROLE_INACTIVE',
          message: 'Cannot assign inactive role to user',
        },
      };
    }

    // Generate new user ID
    const newId = `user_${Date.now()}`;
    const now = new Date().toISOString();

    const newUser: User = {
      ...userData,
      id: newId,
      createdAt: now,
      lastLogin: null,
    };

    // In real API, password would be hashed before storage
    // Return user without password
    return {
      success: true,
      data: {
        ...newUser,
        password: undefined as any,
      } as User,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CREATE_USER_ERROR',
        message: 'Failed to create user',
        details: error,
      },
    };
  }
};

/**
 * Update user
 */
export const updateUser = async (
  userId: string,
  updates: Partial<Omit<User, 'id' | 'createdAt'>>,
  currentUserId: string
): Promise<ServiceResponse<User>> => {
  await simulateApiLatency();

  try {
    const user = usersData.users.find((u) => u.id === userId);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };
    }

    // Validate modification is allowed
    const validationResult = await canModifyUser(userId, currentUserId, 'edit');
    if (!validationResult.success || !validationResult.data?.canModify) {
      return {
        success: false,
        error: {
          code: 'MODIFICATION_NOT_ALLOWED',
          message: validationResult.data?.reason || 'User modification not allowed',
        },
      };
    }

    // Validate username uniqueness if being changed
    if (updates.username && updates.username !== user.username) {
      const existingUser = usersData.users.find((u) => u.username === updates.username);
      if (existingUser) {
        return {
          success: false,
          error: {
            code: 'DUPLICATE_USERNAME',
            message: `Username '${updates.username}' already exists`,
          },
        };
      }
    }

    // Validate email uniqueness if being changed
    if (updates.email && updates.email !== user.email) {
      const existingEmail = usersData.users.find((u) => u.email === updates.email);
      if (existingEmail) {
        return {
          success: false,
          error: {
            code: 'DUPLICATE_EMAIL',
            message: `Email '${updates.email}' already exists`,
          },
        };
      }
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      id: userId, // Ensure ID doesn't change
      createdAt: user.createdAt, // Preserve creation date
      password: undefined as any,
    } as User;

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UPDATE_USER_ERROR',
        message: 'Failed to update user',
        details: error,
      },
    };
  }
};

/**
 * Change user's role
 */
export const changeUserRole = async (
  userId: string,
  newRoleId: string,
  currentUserId: string,
  reason?: string
): Promise<ServiceResponse<User>> => {
  await simulateApiLatency();

  try {
    const user = usersData.users.find((u) => u.id === userId);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };
    }

    // Validate modification is allowed
    const validationResult = await canModifyUser(userId, currentUserId, 'changeRole');
    if (!validationResult.success || !validationResult.data?.canModify) {
      return {
        success: false,
        error: {
          code: 'ROLE_CHANGE_NOT_ALLOWED',
          message: validationResult.data?.reason || 'Role change not allowed',
        },
      };
    }

    // Validate new role exists
    const newRole = rolesData.roles.find((r) => r.id === newRoleId);
    if (!newRole) {
      return {
        success: false,
        error: {
          code: 'ROLE_NOT_FOUND',
          message: 'Selected role does not exist',
        },
      };
    }

    // Validate new role is active
    if (!newRole.isActive) {
      return {
        success: false,
        error: {
          code: 'ROLE_INACTIVE',
          message: 'Cannot assign inactive role to user',
        },
      };
    }

    const updatedUser: User = {
      ...user,
      roleId: newRoleId,
      password: undefined as any,
    } as User;

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CHANGE_ROLE_ERROR',
        message: 'Failed to change user role',
        details: error,
      },
    };
  }
};

/**
 * Delete user
 */
export const deleteUser = async (
  userId: string,
  currentUserId: string
): Promise<ServiceResponse<void>> => {
  await simulateApiLatency();

  try {
    const user = usersData.users.find((u) => u.id === userId);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };
    }

    // Validate deletion is allowed
    const validationResult = await canModifyUser(userId, currentUserId, 'delete');
    if (!validationResult.success || !validationResult.data?.canModify) {
      return {
        success: false,
        error: {
          code: 'DELETION_NOT_ALLOWED',
          message: validationResult.data?.reason || 'User deletion not allowed',
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
        code: 'DELETE_USER_ERROR',
        message: 'Failed to delete user',
        details: error,
      },
    };
  }
};

/**
 * Update user status (activate/deactivate/suspend)
 */
export const updateUserStatus = async (
  userId: string,
  status: UserStatus,
  currentUserId: string
): Promise<ServiceResponse<User>> => {
  await simulateApiLatency();

  try {
    const user = usersData.users.find((u) => u.id === userId);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };
    }

    // Validate modification is allowed
    if (status !== 'active') {
      const validationResult = await canModifyUser(userId, currentUserId, 'deactivate');
      if (!validationResult.success || !validationResult.data?.canModify) {
        return {
          success: false,
          error: {
            code: 'STATUS_CHANGE_NOT_ALLOWED',
            message: validationResult.data?.reason || 'Status change not allowed',
          },
        };
      }
    }

    const updatedUser: User = {
      ...user,
      status,
      password: undefined as any,
    } as User;

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UPDATE_STATUS_ERROR',
        message: 'Failed to update user status',
        details: error,
      },
    };
  }
};

/**
 * Search users by name, username, or email
 */
export const searchUsers = async (query: string): Promise<ServiceResponse<User[]>> => {
  await simulateApiLatency();

  try {
    const lowercaseQuery = query.toLowerCase();
    const results = usersData.users
      .filter(
        (u) =>
          u.fullName.toLowerCase().includes(lowercaseQuery) ||
          u.username.toLowerCase().includes(lowercaseQuery) ||
          u.email.toLowerCase().includes(lowercaseQuery)
      )
      .map((u) => ({
        ...u,
        password: undefined as any,
      })) as User[];

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'SEARCH_USERS_ERROR',
        message: 'Failed to search users',
        details: error,
      },
    };
  }
};

/**
 * Get active users only
 */
export const getActiveUsers = async (): Promise<ServiceResponse<User[]>> => {
  await simulateApiLatency();

  try {
    const activeUsers = usersData.users
      .filter((u) => u.status === 'active')
      .map((u) => ({
        ...u,
        password: undefined as any,
      })) as User[];

    return {
      success: true,
      data: activeUsers,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_ACTIVE_USERS_ERROR',
        message: 'Failed to fetch active users',
        details: error,
      },
    };
  }
};
