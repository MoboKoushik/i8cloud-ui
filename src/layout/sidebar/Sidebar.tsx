/**
 * Sidebar Component - Navigation Menu with Permission-Based Access
 *
 * Responsive sidebar with CASL permission checks
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { Stack, NavLink, ScrollArea, Tooltip, ActionIcon } from '@mantine/core';
import {
  IconDashboard,
  IconLock,
  IconSettings,
  IconReportAnalytics,
  IconShieldCheck,
} from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { AbilityContext } from '../../utils/Can';
import { useContext } from 'react';

interface SidebarProps {
  toggleMobile: () => void;
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ toggleMobile, collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const ability = useContext(AbilityContext);

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close mobile menu after navigation
    if (window.innerWidth < 768) {
      toggleMobile();
    }
  };

  // Check if user is superadmin or admin
  const isSuperAdmin = user?.role?.is_admin === 1;
  const isAdmin = user?.role?.is_admin === 1;

  // Menu items with permission checks
  const menuItems = [
    {
      label: 'Dashboard',
      icon: IconDashboard,
      path: '/app/dashboard',
      show: isSuperAdmin || ability.can('read', 'dashboard'),
    },
    {
      label: 'RaaS Reports',
      icon: IconReportAnalytics,
      path: '/app/raas',
      show: isSuperAdmin || ability.can('read', 'raas'),
    },
    {
      label: 'Access Audit',
      icon: IconShieldCheck,
      path: '/app/audit-log',
      show: isSuperAdmin || ability.can('read', 'access-audit'),
    },
    {
      label: 'Security',
      icon: IconShieldCheck,
      path: '/app/security',
      show: isSuperAdmin || ability.can('read', 'security'),
    },
    {
      label: 'Access',
      icon: IconLock,
      path: '/app/access',
      show: isSuperAdmin || isAdmin || ability.can('read', 'users') || ability.can('read', 'roles'),
      children: [
        {
          label: 'Users',
          path: '/app/access/users',
          show: isSuperAdmin || ability.can('read', 'users'),
        },
        {
          label: 'Roles',
          path: '/app/access/roles',
          show: isSuperAdmin || ability.can('read', 'roles'),
        },
        {
          label: 'Permissions',
          path: '/app/access/permissions',
          show: isSuperAdmin || ability.can('read', 'permissions'),
        },
      ].filter((child) => child.show),
    },
    {
      label: 'Settings',
      icon: IconSettings,
      path: '/app/settings',
      show: isSuperAdmin || ability.can('read', 'settings'),
    },
  ].filter((item) => item.show && (!item.children || item.children.length > 0));

  // Collapsed sidebar - show only icons with tooltips
  if (collapsed) {
    return (
      <ScrollArea h="100%" type="auto">
        <Stack gap={8} p="sm" align="center" mt="sm">
          {menuItems
            .filter((item) => !item.children)
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Tooltip
                  key={item.path}
                  label={item.label}
                  position="right"
                  withArrow
                  styles={{
                    tooltip: {
                      backgroundColor: '#212529',
                      color: '#ffffff',
                    },
                  }}
                >
                  <ActionIcon
                    size="lg"
                    variant={isActive ? 'filled' : 'subtle'}
                    color={isActive ? 'blue' : 'gray'}
                    onClick={() => handleNavigation(item.path)}
                    style={{
                      width: 46,
                      height: 46,
                      backgroundColor: isActive ? theme.primaryColor : 'transparent',
                      color: isActive ? theme.sidebarTextColor : theme.sidebarTextColor,
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Icon size={22} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              );
            })}
        </Stack>
      </ScrollArea>
    );
  }

  // Expanded sidebar - show full navigation
  return (
    <ScrollArea h="100%" type="auto">
      <Stack gap={4} p="md" mt="sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          if (item.children) {
            return (
              <NavLink
                key={item.path}
                label={item.label}
                leftSection={<Icon size={20} stroke={1.5} />}
                active={isActive}
                defaultOpened={isActive}
                styles={{
                  root: {
                    borderRadius: 8,
                    fontWeight: 500,
                    color: isActive ? theme.primaryColor : theme.sidebarTextColor,
                    backgroundColor: isActive ? `${theme.primaryColor}20` : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive ? `${theme.primaryColor}20` : `${theme.sidebarColor}20`,
                    },
                  },
                  label: {
                    fontWeight: 500,
                  },
                }}
              >
                {item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    label={child.label}
                    active={location.pathname === child.path}
                    onClick={() => handleNavigation(child.path)}
                    styles={{
                      root: {
                        borderRadius: 8,
                        fontSize: 14,
                        color: location.pathname === child.path ? theme.primaryColor : theme.sidebarTextColor,
                        backgroundColor:
                          location.pathname === child.path ? `${theme.primaryColor}15` : 'transparent',
                        '&:hover': {
                          backgroundColor:
                            location.pathname === child.path ? `${theme.primaryColor}15` : `${theme.sidebarColor}10`,
                        },
                      },
                    }}
                  />
                ))}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              label={item.label}
              leftSection={<Icon size={20} stroke={1.5} />}
              active={isActive}
              onClick={() => handleNavigation(item.path)}
              styles={{
                root: {
                  borderRadius: 8,
                  fontWeight: 500,
                  color: isActive ? theme.primaryColor : theme.sidebarTextColor,
                  backgroundColor: isActive ? `${theme.primaryColor}20` : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? `${theme.primaryColor}20` : `${theme.sidebarColor}20`,
                  },
                },
                label: {
                  fontWeight: 500,
                },
              }}
            />
          );
        })}
      </Stack>
    </ScrollArea>
  );
};
