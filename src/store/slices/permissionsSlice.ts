/**
 * Permissions Slice - CRITICAL for Dynamic RBAC
 *
 * Stores user permissions in both array and lookup map format
 * The lookup map enables O(1) permission checks
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Permission, PermissionMap } from '../../types';

interface PermissionsState {
  permissions: Permission[];
  permissionMap: PermissionMap; // For O(1) permission checks
  loading: boolean;
}

const initialState: PermissionsState = {
  permissions: [],
  permissionMap: {},
  loading: false,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<Permission[]>) => {
      state.permissions = action.payload;

      // Create lookup map for O(1) permission checks
      state.permissionMap = action.payload.reduce((acc, perm) => {
        acc[perm.key] = true;
        return acc;
      }, {} as PermissionMap);
    },
    clearPermissions: (state) => {
      state.permissions = [];
      state.permissionMap = {};
    },
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;

export default permissionsSlice.reducer;
