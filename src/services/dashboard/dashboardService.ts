/**
 * Dashboard Service
 *
 * Provides dashboard KPI and summary data based on user role and permissions
 */

import { ServiceResponse } from '../../types';

/**
 * Simulate API latency
 */
const simulateApiLatency = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Dashboard KPI data structure
 */
export interface DashboardKPIs {
  // Security
  totalSecurityGroups?: number;
  activeSecurityGroups?: number;
  securityGroupsWithRisks?: number;

  // Integration
  totalIntegrations?: number;
  activeJobs?: number;
  failedJobs?: number;
  integrationSuccessRate?: number;

  // Users & Access
  totalUsers?: number;
  activeUsers?: number;
  suspendedUsers?: number;
  recentLogins?: number;

  // Audit
  auditEventsToday?: number;
  failedLoginAttempts?: number;
  criticalAuditEvents?: number;

  // Compliance
  pendingPolicyApprovals?: number;
  activeSodExceptions?: number;
  complianceScore?: number;

  // Reports
  publicReports?: number;
  scheduledReports?: number;

  // System
  systemHealth?: 'healthy' | 'warning' | 'critical';
  lastSyncTime?: string;
}

/**
 * Recent activity item
 */
export interface RecentActivity {
  id: string;
  type: 'login' | 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  username?: string;
}

/**
 * Quick action item for dashboard shortcuts
 */
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  route: string;
  permission: string;
  color?: string;
}

/**
 * Get dashboard KPIs based on user role
 */
export const getDashboardKPIs = async (roleKey: string): Promise<ServiceResponse<DashboardKPIs>> => {
  await simulateApiLatency();

  try {
    // Generate mock KPIs based on role
    const baseKPIs: DashboardKPIs = {
      systemHealth: 'healthy',
      lastSyncTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    };

    // Super Admin - Full system view
    if (roleKey === 'super_admin') {
      return {
        success: true,
        data: {
          ...baseKPIs,
          totalSecurityGroups: 48,
          activeSecurityGroups: 42,
          securityGroupsWithRisks: 6,
          totalIntegrations: 8,
          activeJobs: 156,
          failedJobs: 3,
          integrationSuccessRate: 98.1,
          totalUsers: 247,
          activeUsers: 231,
          suspendedUsers: 5,
          recentLogins: 89,
          auditEventsToday: 1247,
          failedLoginAttempts: 12,
          criticalAuditEvents: 2,
          pendingPolicyApprovals: 7,
          activeSodExceptions: 14,
          complianceScore: 94.2,
          publicReports: 28,
          scheduledReports: 15,
        },
      };
    }

    // Security Admin - Security-focused
    if (roleKey === 'security_admin') {
      return {
        success: true,
        data: {
          ...baseKPIs,
          totalSecurityGroups: 48,
          activeSecurityGroups: 42,
          securityGroupsWithRisks: 6,
          auditEventsToday: 847,
          failedLoginAttempts: 12,
          criticalAuditEvents: 2,
          pendingPolicyApprovals: 7,
          activeSodExceptions: 14,
          complianceScore: 94.2,
        },
      };
    }

    // Auditor - Audit-focused
    if (roleKey === 'auditor') {
      return {
        success: true,
        data: {
          ...baseKPIs,
          auditEventsToday: 1247,
          failedLoginAttempts: 12,
          criticalAuditEvents: 2,
          totalUsers: 247,
          activeUsers: 231,
          recentLogins: 89,
          complianceScore: 94.2,
        },
      };
    }

    // Integration Engineer - Integration-focused
    if (roleKey === 'integration_engineer') {
      return {
        success: true,
        data: {
          ...baseKPIs,
          totalIntegrations: 8,
          activeJobs: 156,
          failedJobs: 3,
          integrationSuccessRate: 98.1,
        },
      };
    }

    // Business User - Limited summary
    if (roleKey === 'business_user') {
      return {
        success: true,
        data: {
          ...baseKPIs,
          publicReports: 28,
          complianceScore: 94.2,
        },
      };
    }

    // Regional Manager - Regional view
    if (roleKey === 'regional_security_manager') {
      return {
        success: true,
        data: {
          ...baseKPIs,
          totalSecurityGroups: 18, // Filtered to region
          activeSecurityGroups: 16,
          securityGroupsWithRisks: 2,
          auditEventsToday: 342,
          failedLoginAttempts: 3,
          complianceScore: 96.5,
        },
      };
    }

    // Default - Minimal view
    return {
      success: true,
      data: baseKPIs,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DASHBOARD_ERROR',
        message: error instanceof Error ? error.message : 'Failed to load dashboard data',
      },
    };
  }
};

/**
 * Get recent activity for dashboard
 */
export const getRecentActivity = async (
  roleKey: string,
  limit: number = 10
): Promise<ServiceResponse<RecentActivity[]>> => {
  await simulateApiLatency();

  try {
    const now = Date.now();
    const activities: RecentActivity[] = [];

    // Generate mock recent activity based on role
    if (roleKey === 'super_admin' || roleKey === 'security_admin' || roleKey === 'auditor') {
      activities.push(
        {
          id: 'act_001',
          type: 'alert',
          title: 'Failed Login Attempts Detected',
          description: '12 failed login attempts from IP 192.168.1.45',
          timestamp: new Date(now - 5 * 60 * 1000).toISOString(),
          severity: 'high',
        },
        {
          id: 'act_002',
          type: 'create',
          title: 'New Security Group Created',
          description: 'Security group "Finance-Restricted" created by security.admin',
          timestamp: new Date(now - 15 * 60 * 1000).toISOString(),
          severity: 'low',
          username: 'security.admin',
        },
        {
          id: 'act_003',
          type: 'approve',
          title: 'Policy Change Approved',
          description: 'Domain security policy DS-2024-089 approved',
          timestamp: new Date(now - 35 * 60 * 1000).toISOString(),
          severity: 'medium',
        },
        {
          id: 'act_004',
          type: 'update',
          title: 'User Role Changed',
          description: 'User "john.doe" role changed from Viewer to Editor',
          timestamp: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
          severity: 'medium',
          username: 'super.admin',
        },
        {
          id: 'act_005',
          type: 'alert',
          title: 'SoD Exception Flagged',
          description: 'New segregation of duties conflict detected for user sarah.chen',
          timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
          severity: 'critical',
        }
      );
    }

    if (roleKey === 'integration_engineer') {
      activities.push(
        {
          id: 'act_101',
          type: 'alert',
          title: 'Integration Job Failed',
          description: 'Job "AD-Sync-Daily" failed with error code 500',
          timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
          severity: 'high',
        },
        {
          id: 'act_102',
          type: 'update',
          title: 'Integration Restarted',
          description: 'Workday integration restarted successfully',
          timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
          severity: 'low',
        },
        {
          id: 'act_103',
          type: 'create',
          title: 'New Integration Schedule',
          description: 'Created new schedule for Azure AD sync',
          timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
          severity: 'low',
          username: 'integration.eng',
        }
      );
    }

    return {
      success: true,
      data: activities.slice(0, limit),
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'ACTIVITY_ERROR',
        message: error instanceof Error ? error.message : 'Failed to load recent activity',
      },
    };
  }
};

/**
 * Get quick actions based on user permissions
 */
export const getQuickActions = async (roleKey: string): Promise<ServiceResponse<QuickAction[]>> => {
  await simulateApiLatency(100);

  try {
    const actions: QuickAction[] = [];

    // Super Admin - All actions
    if (roleKey === 'super_admin') {
      actions.push(
        {
          id: 'qa_001',
          label: 'Create User',
          description: 'Add a new user to the system',
          icon: 'IconUserPlus',
          route: '/admin/users/create',
          permission: 'users.create',
          color: 'blue',
        },
        {
          id: 'qa_002',
          label: 'Create Role',
          description: 'Define a new user role',
          icon: 'IconShieldPlus',
          route: '/admin/roles/create',
          permission: 'roles.create',
          color: 'green',
        },
        {
          id: 'qa_003',
          label: 'View Audit Logs',
          description: 'Review system activity',
          icon: 'IconClipboardList',
          route: '/admin/audit',
          permission: 'audit.view',
          color: 'orange',
        },
        {
          id: 'qa_004',
          label: 'Security Groups',
          description: 'Manage security groups',
          icon: 'IconShield',
          route: '/security-groups',
          permission: 'security_groups.view',
          color: 'violet',
        }
      );
    }

    // Security Admin - Security-focused
    if (roleKey === 'security_admin') {
      actions.push(
        {
          id: 'qa_101',
          label: 'Security Groups',
          description: 'Manage security groups',
          icon: 'IconShield',
          route: '/security-groups',
          permission: 'security_groups.view',
          color: 'violet',
        },
        {
          id: 'qa_102',
          label: 'Sign-on Activity',
          description: 'Monitor authentication',
          icon: 'IconLogin',
          route: '/sign-on',
          permission: 'sign_on.view',
          color: 'cyan',
        },
        {
          id: 'qa_103',
          label: 'Policy Changes',
          description: 'Review policy updates',
          icon: 'IconFileDescription',
          route: '/policies/business',
          permission: 'policy.view',
          color: 'orange',
        },
        {
          id: 'qa_104',
          label: 'SoD Exceptions',
          description: 'Review duty segregation',
          icon: 'IconAlertTriangle',
          route: '/sod-exceptions',
          permission: 'sod.view',
          color: 'red',
        }
      );
    }

    // Auditor - Audit-focused
    if (roleKey === 'auditor') {
      actions.push(
        {
          id: 'qa_201',
          label: 'Access Audit',
          description: 'Review access logs',
          icon: 'IconFileSearch',
          route: '/audit-log',
          permission: 'access_audit.view',
          color: 'blue',
        },
        {
          id: 'qa_202',
          label: 'Sign-on Activity',
          description: 'Monitor authentication',
          icon: 'IconLogin',
          route: '/sign-on',
          permission: 'sign_on.view',
          color: 'cyan',
        },
        {
          id: 'qa_203',
          label: 'Export Reports',
          description: 'Generate compliance reports',
          icon: 'IconDownload',
          route: '/audit-log',
          permission: 'access_audit.export',
          color: 'green',
        }
      );
    }

    // Integration Engineer
    if (roleKey === 'integration_engineer') {
      actions.push(
        {
          id: 'qa_301',
          label: 'Integration Dashboard',
          description: 'Monitor integrations',
          icon: 'IconPlugConnected',
          route: '/integration',
          permission: 'integration.view',
          color: 'blue',
        },
        {
          id: 'qa_302',
          label: 'Restart Jobs',
          description: 'Manage failed jobs',
          icon: 'IconRefresh',
          route: '/integration',
          permission: 'integration.restart',
          color: 'orange',
        }
      );
    }

    // Business User
    if (roleKey === 'business_user') {
      actions.push(
        {
          id: 'qa_401',
          label: 'View Reports',
          description: 'Access public reports',
          icon: 'IconReport',
          route: '/raas-reports',
          permission: 'raas.view_public',
          color: 'blue',
        }
      );
    }

    // Regional Manager
    if (roleKey === 'regional_security_manager') {
      actions.push(
        {
          id: 'qa_501',
          label: 'Security Groups',
          description: 'Manage regional groups',
          icon: 'IconShield',
          route: '/security-groups',
          permission: 'security_groups.view',
          color: 'violet',
        },
        {
          id: 'qa_502',
          label: 'Access Audit',
          description: 'Review regional access',
          icon: 'IconFileSearch',
          route: '/audit-log',
          permission: 'access_audit.view',
          color: 'blue',
        }
      );
    }

    return {
      success: true,
      data: actions,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'ACTIONS_ERROR',
        message: error instanceof Error ? error.message : 'Failed to load quick actions',
      },
    };
  }
};
