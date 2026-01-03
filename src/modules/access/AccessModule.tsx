/**
 * Access Module
 *
 * User, Role, and Permission management
 */

import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const PermissionListPage = lazy(() => import('./pages/permissions/PermissionListPage'));
const RoleListPage = lazy(() => import('./pages/roles/RoleListPage'));
const RoleFormPage = lazy(() => import('./pages/roles/RoleFormPage'));
const UserListPage = lazy(() => import('./pages/users/UserListPage'));
const UserFormPage = lazy(() => import('./pages/users/UserFormPage'));

const AccessModule = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="users" replace />} />
      <Route path="users" element={<UserListPage />} />
      <Route path="users/create" element={<UserFormPage />} />
      <Route path="users/edit/:id" element={<UserFormPage />} />
      <Route path="roles" element={<RoleListPage />} />
      <Route path="roles/create" element={<RoleFormPage />} />
      <Route path="roles/edit/:id" element={<RoleFormPage />} />
      <Route path="permissions" element={<PermissionListPage />} />
      <Route path="*" element={<Navigate to="users" replace />} />
    </Routes>
  );
};

export default AccessModule;
