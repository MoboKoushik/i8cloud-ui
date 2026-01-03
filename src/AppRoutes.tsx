/**
 * AppRoutes - Main Application Routes
 *
 * Contains all module routes with permission-based rendering
 */

import CustomSuspense from "@/components/CustomSuspense";
import { NotFoundPage } from "@/components/page-not-found/PageNotFoundRoute";
import { AbilityContext } from "@/utils/Can";
import { lazy, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const DashboardModule = lazy(() => import("@/modules/dashboard/DashboardModule"));
const AdminModule = lazy(() => import("@/modules/admin/AdminModule"));
const ProfileModule = lazy(() => import("@/modules/profile/ProfileModule"));
const AccessModule = lazy(() => import("@/modules/access/AccessModule"));
const RaasModule = lazy(() => import("@/modules/raas/RaasModule"));
const AccessAuditPage = lazy(() => import("@/modules/access-audit/pages/AccessAuditPage"));
const SignonDetailsPage = lazy(() => import("@/modules/access-audit/pages/SignonDetailsPage"));
const WorkdayAccountDetailsPage = lazy(() => import("@/modules/access-audit/pages/WorkdayAccountDetailsPage"));
const SecurityPage = lazy(() => import("@/modules/security/pages/SecurityPage"));
const SecurityGroupDetailsPage = lazy(() => import("@/modules/security/pages/SecurityGroupDetailsPage"));
const BusinessProcessSecurityPoliciesPage = lazy(() => import("@/modules/security/pages/BusinessProcessSecurityPoliciesPage"));
const DomainProcessSecurityPoliciesPage = lazy(() => import("@/modules/security/pages/DomainProcessSecurityPoliciesPage"));
const SegregationOfDutiesPage = lazy(() => import("@/modules/security/pages/SegregationOfDutiesPage"));
const SettingsPage = lazy(() => import("@/modules/settings/pages/SettingsPage"));

const AppRoutes = () => {
  const ability = useContext(AbilityContext);
  const { user } = useAuth();

  // Check if user is superadmin
  const isSuperAdmin = user?.role?.is_admin === 1;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />

      {/* Dashboard - requires read permission */}
      {(isSuperAdmin || ability.can('read', 'dashboard')) && (
        <Route
          path="dashboard/*"
          element={
            <CustomSuspense>
              <DashboardModule />
            </CustomSuspense>
          }
        />
      )}

      {/* Profile - accessible to all authenticated users */}
      <Route
        path="profile/*"
        element={
          <CustomSuspense>
            <ProfileModule />
          </CustomSuspense>
        }
      />

      {/* Access Module - requires read permission on users or roles */}
      {(isSuperAdmin || ability.can('read', 'users') || ability.can('read', 'roles')) && (
        <Route
          path="access/*"
          element={
            <CustomSuspense>
              <AccessModule />
            </CustomSuspense>
          }
        />
      )}

      {/* RaaS - requires read permission */}
      {(isSuperAdmin || ability.can('read', 'raas')) && (
        <Route
          path="raas/*"
          element={
            <CustomSuspense>
              <RaasModule />
            </CustomSuspense>
          }
        />
      )}

      {/* Access Audit - requires read permission */}
      {(isSuperAdmin || ability.can('read', 'access-audit')) && (
        <>
          <Route
            path="audit-log"
            element={
              <CustomSuspense>
                <AccessAuditPage />
              </CustomSuspense>
            }
          />

          <Route
            path="signon-details"
            element={
              <CustomSuspense>
                <SignonDetailsPage />
              </CustomSuspense>
            }
          />

          <Route
            path="workday-account-details"
            element={
              <CustomSuspense>
                <WorkdayAccountDetailsPage />
              </CustomSuspense>
            }
          />
        </>
      )}

      {/* Security Module - requires read permission */}
      {(isSuperAdmin || ability.can('read', 'security')) && (
        <>
          <Route
            path="security"
            element={
              <CustomSuspense>
                <SecurityPage />
              </CustomSuspense>
            }
          />

          <Route
            path="security-group-details"
            element={
              <CustomSuspense>
                <SecurityGroupDetailsPage />
              </CustomSuspense>
            }
          />

          <Route
            path="business-process-security-policies"
            element={
              <CustomSuspense>
                <BusinessProcessSecurityPoliciesPage />
              </CustomSuspense>
            }
          />

          <Route
            path="domain-process-security-policies"
            element={
              <CustomSuspense>
                <DomainProcessSecurityPoliciesPage />
              </CustomSuspense>
            }
          />

          <Route
            path="segregation-of-duties"
            element={
              <CustomSuspense>
                <SegregationOfDutiesPage />
              </CustomSuspense>
            }
          />
        </>
      )}

      {/* Settings - requires read permission */}
      {(isSuperAdmin || ability.can('read', 'settings')) && (
        <Route
          path="settings"
          element={
            <CustomSuspense>
              <SettingsPage />
            </CustomSuspense>
          }
        />
      )}

      {/* Admin Module - requires read permission on permissions */}
      {(isSuperAdmin || ability.can('read', 'permissions')) && (
        <Route
          path="admin/*"
          element={
            <CustomSuspense>
              <AdminModule />
            </CustomSuspense>
          }
        />
      )}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
