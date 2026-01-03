/**
 * Admin Module
 *
 * Handles all admin functionality with CASL permission guards
 * - Permissions management (CRUD)
 * - Roles management (CRUD)
 * Only accessible to SuperAdmin
 */

import CustomSuspense from "@/components/CustomSuspense";
import { NotFoundPage } from "@/components/page-not-found/PageNotFoundRoute";
import { AbilityContext } from "@/utils/Can";
import { lazy, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Lazy load pages
const PermissionsPage = lazy(() => import("./pages/PermissionsPage"));
const RolesPage = lazy(() => import("./pages/RolesPage"));

const AdminModule = () => {
  const ability = useContext(AbilityContext);
  const { user } = useAuth();

  // Check if user is superadmin
  const isSuperAdmin = user?.role?.is_admin === 1;

  return (
    <Routes>
      {/* Default redirect to permissions */}
      <Route path="/" element={<Navigate to="permissions" replace />} />

      {/* Permissions Management - SuperAdmin only */}
      {(isSuperAdmin || ability.can("read", "permissions")) && (
        <Route
          path="permissions"
          element={
            <CustomSuspense>
              <PermissionsPage />
            </CustomSuspense>
          }
        />
      )}

      {/* Roles Management - SuperAdmin only */}
      {(isSuperAdmin || ability.can("read", "roles")) && (
        <Route
          path="roles"
          element={
            <CustomSuspense>
              <RolesPage />
            </CustomSuspense>
          }
        />
      )}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminModule;
