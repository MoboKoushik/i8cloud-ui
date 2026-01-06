/**
 * User Types
 */


export interface AuthUser {
  uuid: string;
  type: string;
  name: string;
  email: string;
  role: {
    name: string;
    is_admin: number;
    permissions: {
      subject: string;
      action: string;
    }[];
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roleId: string; // Reference to Role.id
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string; // ISO timestamp
  lastLogin: string | null; // ISO timestamp or null if never logged in
}

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserWithRole extends User {
  roleName: string; // Joined from Role
  roleKey: string;
}

export interface UserFormData {
  fullName: string;
  email: string;
  username: string;
  password?: string;
  roleId: string;
  status: UserStatus;
}
