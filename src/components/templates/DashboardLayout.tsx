/**
 * DashboardLayout Template - Modern Design with Collapsible Sidebar
 *
 * Main application layout with collapsible sidebar and elegant top header
 */

import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Group,
  Text,
  Menu,
  Avatar,
  UnstyledButton,
  rem,
  Modal,
  Button,
  Stack,
  Box,
  Badge,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  IconUser,
  IconSettings,
  IconBell,
  IconSearch,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AppSidebar } from '../organisms/AppSidebar';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '@/routes';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logoutModalOpened, { open: openLogoutModal, close: closeLogoutModal }] =
    useDisclosure(false);

  const handleLogout = () => {
    logout();
    notifications.show({
      title: 'Logged Out',
      message: 'You have been successfully logged out.',
      color: 'blue',
    });
    navigate(ROUTES.LOGIN);
    closeLogoutModal();
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.fullName[0].toUpperCase();
  };

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  return (
    <>
      <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Collapsible Sidebar */}
        <AppSidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />

        {/* Main Content Area */}
        <Box
          style={{
            flex: 1,
            marginLeft: `${sidebarWidth}px`,
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          {/* Top Header */}
          <Box
            component="header"
            style={{
              height: '60px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: 'white',
              position: 'sticky',
              top: 0,
              zIndex: 50,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box
              style={{
                height: '100%',
                maxWidth: '100%',
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Left Section */}
              <Group gap="sm">
                {/* Welcome Message */}
                <Box>
                  <Text size="xs" c="#64748b" style={{ lineHeight: 1 }}>
                    Welcome back
                  </Text>
                  <Text size="sm" fw={600} c="#0f172a" mt={2}>
                    {user?.fullName || 'User'}
                  </Text>
                </Box>
              </Group>

              {/* Right Section */}
              <Group gap="xs">
                {/* Role Badge */}
                {role && (
                  <Badge
                    variant="light"
                    color="blue"
                    size="md"
                    radius="md"
                    style={{
                      textTransform: 'none',
                      fontWeight: 500,
                      padding: '6px 12px',
                    }}
                  >
                    {role.name}
                  </Badge>
                )}

                {/* Search */}
                <Tooltip label="Search" position="bottom" withArrow>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    radius="md"
                    aria-label="Search"
                  >
                    <IconSearch size={18} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>

                {/* Notifications */}
                <Tooltip label="Notifications" position="bottom" withArrow>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    radius="md"
                    aria-label="Notifications"
                  >
                    <IconBell size={18} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>

                {/* Settings */}
                <Tooltip label="Settings" position="bottom" withArrow>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    radius="md"
                    aria-label="Settings"
                    onClick={() => navigate('/settings')}
                  >
                    <IconSettings size={18} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>

                {/* Divider */}
                <Box
                  style={{
                    width: '1px',
                    height: '32px',
                    backgroundColor: '#e2e8f0',
                    margin: '0 8px',
                  }}
                />

                {/* User Menu */}
                <Menu
                  shadow="md"
                  width={260}
                  position="bottom-end"
                  offset={12}
                  withArrow
                  arrowPosition="center"
                  styles={{
                    dropdown: {
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '8px',
                      boxShadow:
                        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                    arrow: {
                      border: '1px solid #e2e8f0',
                    },
                  }}
                >
                  <Menu.Target>
                    <UnstyledButton
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '6px 12px 6px 6px',
                        borderRadius: '10px',
                        transition: 'background-color 0.2s',
                        border: '1px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <Avatar
                        radius="md"
                        size="sm"
                        styles={{
                          root: {
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          },
                        }}
                      >
                        {getUserInitials()}
                      </Avatar>
                      <IconChevronDown size={14} stroke={2} style={{ color: '#94a3b8' }} />
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {/* User Info Header */}
                    <Box
                      p="md"
                      mb="xs"
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        borderRadius: '8px 8px 0 0',
                      }}
                    >
                      <Group gap="sm">
                        <Avatar
                          radius="md"
                          size="md"
                          styles={{
                            root: {
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            },
                          }}
                        >
                          {getUserInitials()}
                        </Avatar>
                        <Box style={{ flex: 1 }}>
                          <Text size="sm" fw={600} c="#0f172a">
                            {user?.fullName || 'User'}
                          </Text>
                          <Text size="xs" c="#64748b" mt={2}>
                            {user?.email || ''}
                          </Text>
                        </Box>
                      </Group>
                      {role && (
                        <Badge
                          variant="light"
                          color="blue"
                          size="xs"
                          radius="sm"
                          mt={10}
                          style={{ textTransform: 'none' }}
                        >
                          {role.name}
                        </Badge>
                      )}
                    </Box>

                    {/* Menu Items */}
                    <Menu.Label
                      style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginTop: '4px',
                        marginBottom: '4px',
                        paddingLeft: '12px',
                      }}
                    >
                      Account
                    </Menu.Label>

                    <Menu.Item
                      leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                      onClick={() => navigate('/profile')}
                      styles={{
                        item: {
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontSize: '14px',
                        },
                      }}
                    >
                      Profile Settings
                    </Menu.Item>

                    <Menu.Item
                      leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} />}
                      onClick={() => navigate('/settings')}
                      styles={{
                        item: {
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontSize: '14px',
                        },
                      }}
                    >
                      Preferences
                    </Menu.Item>

                    <Menu.Divider style={{ margin: '8px 0' }} />

                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} />}
                      onClick={openLogoutModal}
                      styles={{
                        item: {
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontSize: '14px',
                        },
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Box>
          </Box>

          {/* Page Content */}
          <Box
            component="main"
            style={{
              flex: 1,
              backgroundColor: '#f8fafc',
              overflow: 'auto',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Logout Confirmation Modal */}
      <Modal
        opened={logoutModalOpened}
        onClose={closeLogoutModal}
        title="Confirm Logout"
        centered
        size="sm"
        radius="md"
        styles={{
          title: {
            fontWeight: 600,
            fontSize: '16px',
          },
        }}
      >
        <Stack gap="lg">
          <Text size="sm" c="#475569">
            Are you sure you want to logout? Any unsaved changes will be lost.
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={closeLogoutModal} radius="md">
              Cancel
            </Button>
            <Button color="red" onClick={handleLogout} radius="md">
              Logout
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
