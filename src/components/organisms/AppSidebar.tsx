/**
 * AppSidebar Component - Collapsible Modern Design
 *
 * Sleek sidebar with collapse/expand functionality
 * Icon-only when collapsed, full labels when expanded
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScrollArea, Stack, Tooltip, UnstyledButton, Box, Text } from '@mantine/core';
import {
  IconDashboard,
  IconShield,
  IconPlugConnected,
  IconFileSearch,
  IconLogin,
  IconBriefcase,
  IconFileDescription,
  IconAlertTriangle,
  IconReport,
  IconUsers,
  IconSettings,
  IconLock,
  IconUserCheck,
  IconClipboardList,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { getAllModules } from '../../services/modules/moduleService';
import type { Module } from '../../types';

// Icon mapping
const iconMap: Record<string, any> = {
  IconDashboard,
  IconShield,
  IconPlugConnected,
  IconFileSearch,
  IconLogin,
  IconBriefcase,
  IconFileDescription,
  IconAlertTriangle,
  IconReport,
  IconUsers,
  IconSettings,
  IconLock,
  IconUserCheck,
  IconClipboardList,
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, collapsed }) => {
  const button = (
    <UnstyledButton
      onClick={onClick}
      style={{
        width: collapsed ? '44px' : '100%',
        height: '44px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '12px',
        paddingLeft: collapsed ? '0' : '12px',
        paddingRight: collapsed ? '0' : '12px',
        backgroundColor: active ? '#3b82f6' : 'transparent',
        color: active ? 'white' : '#64748b',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = '#f1f5f9';
          e.currentTarget.style.color = '#1e293b';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#64748b';
        }
      }}
    >
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '20px' }}>
        {icon}
      </Box>
      {!collapsed && (
        <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>
          {label}
        </Text>
      )}
      {active && (
        <Box
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '24px',
            backgroundColor: '#3b82f6',
            borderRadius: '0 2px 2px 0',
          }}
        />
      )}
    </UnstyledButton>
  );

  if (collapsed) {
    return (
      <Tooltip
        label={label}
        position="right"
        offset={16}
        withArrow
        styles={{
          tooltip: {
            backgroundColor: '#1e293b',
            color: 'white',
            fontSize: '13px',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: '6px',
          },
        }}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();
  const { hasPermission } = usePermissions();
  const [modules, setModules] = useState<Module[]>([]);

  // Check if user is admin
  const isAdmin = role?.is_admin || false;

  useEffect(() => {
    const loadModules = async () => {
      const response = await getAllModules();
      if (response.success && response.data) {
        // Filter modules based on user permissions
        // Exclude "Admin" category if user is not admin
        const accessibleModules = response.data.filter(
          (module) => {
            const hasAccess = module.isActive && hasPermission(`${module.key}.view`);
            const isAdminModule = module.category === 'Admin';

            // If it's an admin module, only show if user is admin
            if (isAdminModule) {
              return hasAccess && isAdmin;
            }

            return hasAccess;
          }
        );
        setModules(accessibleModules);
      }
    };

    loadModules();
  }, [hasPermission, isAdmin]);

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <Box
      style={{
        width: `${sidebarWidth}px`,
        height: '100vh',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.02)',
      }}
    >
      {/* Logo & Toggle */}
      <Box
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: collapsed ? '0 10px' : '0 16px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        {/* Logo */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            flex: 1,
          }}
          onClick={() => handleNavigation('/dashboard')}
        >
          <Box
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 700,
              color: 'white',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              flexShrink: 0,
            }}
          >
            i8
          </Box>
          {!collapsed && (
            <Text size="lg" fw={700} c="#0f172a" style={{ whiteSpace: 'nowrap' }}>
              i8cloud
            </Text>
          )}
        </Box>

        {/* Toggle Button */}
        <UnstyledButton
          onClick={onToggle}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          {collapsed ? <IconChevronRight size={18} stroke={2} /> : <IconChevronLeft size={18} stroke={2} />}
        </UnstyledButton>
      </Box>

      {/* Navigation Items */}
      <ScrollArea style={{ flex: 1 }} p="sm" type="never">
        <Stack gap={6} align={collapsed ? 'center' : 'stretch'}>
          {/* Dashboard - Always visible */}
          <NavItem
            icon={<IconDashboard size={20} stroke={2} />}
            label="Dashboard"
            active={location.pathname === '/dashboard'}
            onClick={() => handleNavigation('/dashboard')}
            collapsed={collapsed}
          />

          {/* Divider */}
          {modules.length > 0 && (
            <Box
              style={{
                width: collapsed ? '32px' : '100%',
                height: '1px',
                backgroundColor: '#e2e8f0',
                margin: '8px 0',
              }}
            />
          )}

          {/* Dynamic modules */}
          {modules.map((module) => {
            const Icon = iconMap[module.icon] || IconSettings;
            return (
              <NavItem
                key={module.id}
                icon={<Icon size={20} stroke={2} />}
                label={module.name}
                active={location.pathname.startsWith(module.route)}
                onClick={() => handleNavigation(module.route)}
                collapsed={collapsed}
              />
            );
          })}
        </Stack>
      </ScrollArea>

      {/* Bottom Section - Settings */}
      <Box
        style={{
          padding: '10px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          alignItems: collapsed ? 'center' : 'stretch',
        }}
      >
        <NavItem
          icon={<IconSettings size={20} stroke={2} />}
          label="Settings"
          active={location.pathname === '/settings'}
          onClick={() => handleNavigation('/settings')}
          collapsed={collapsed}
        />
      </Box>
    </Box>
  );
};
