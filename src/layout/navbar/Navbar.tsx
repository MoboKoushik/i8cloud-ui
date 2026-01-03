/**
 * Navbar Component - Top Header Bar
 *
 * Responsive top navigation with user menu, notifications, and settings
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Group,
  Burger,
  Text,
  Menu,
  Avatar,
  UnstyledButton,
  ActionIcon,
  Tooltip,
  rem,
  Box,
  Badge,
  Divider,
  Modal,
  TextInput,
  Stack,
  Paper,
  Indicator,
  Drawer,
  ScrollArea,
  Timeline,
} from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  IconUser,
  IconSettings,
  IconBell,
  IconSearch,
  IconAlertCircle,
  IconCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  mobileOpened: boolean;
  desktopOpened: boolean;
  toggleMobile: () => void;
  toggleDesktop: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mobileOpened,
  desktopOpened,
  toggleMobile,
  toggleDesktop,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchOpened, setSearchOpened] = useState(false);
  const [notificationOpened, setNotificationOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    notifications.show({
      title: 'Logged Out',
      message: 'You have been successfully logged out.',
      color: 'blue',
    });
    navigate('/auth/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <Group h="100%" px="lg" justify="space-between" wrap="nowrap">
      {/* Left Section */}
      <Group gap="md" wrap="nowrap">
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
          color="#495057"
        />
        <Burger
          opened={desktopOpened}
          onClick={toggleDesktop}
          visibleFrom="sm"
          size="sm"
          color="#495057"
        />

        <Group gap="xs" wrap="nowrap">
          <Box
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #228be6 0%, #1c7ed6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 4px rgba(34, 139, 230, 0.2)',
            }}
          >
            i8
          </Box>
          <Text size="lg" fw={700} c="#1971c2" visibleFrom="xs">
            i8cloud
          </Text>
        </Group>
      </Group>

      {/* Right Section */}
      <Group gap="sm" wrap="nowrap">
        {/* Role Badge - Desktop only */}
        {user?.role && (
          <Badge
            variant="light"
            color="blue"
            size="md"
            visibleFrom="md"
            style={{
              backgroundColor: '#e7f5ff',
              color: '#1971c2',
              fontWeight: 600,
            }}
          >
            {user.role.name}
          </Badge>
        )}

        {/* Search */}
        <Tooltip label="Search" position="bottom" withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            aria-label="Search"
            onClick={() => setSearchOpened(true)}
            style={{ color: '#495057' }}
          >
            <IconSearch size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

        {/* Notifications */}
        <Tooltip label="Notifications" position="bottom" withArrow>
          <Indicator inline label="3" size={16} color="red" offset={4}>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              aria-label="Notifications"
              onClick={() => setNotificationOpened(true)}
              style={{ color: '#495057' }}
            >
              <IconBell size={20} stroke={1.5} />
            </ActionIcon>
          </Indicator>
        </Tooltip>

        {/* Settings */}
        <Tooltip label="Settings" position="bottom" withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => navigate('/app/settings')}
            aria-label="Settings"
            style={{ color: '#495057' }}
          >
            <IconSettings size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

        <Divider orientation="vertical" style={{ borderColor: '#dee2e6' }} />

        {/* User Menu */}
        <Menu shadow="lg" width={240} position="bottom-end">
          <Menu.Target>
            <UnstyledButton
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f3f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Avatar
                color="blue"
                radius="xl"
                size="sm"
                style={{
                  backgroundColor: '#228be6',
                  color: '#ffffff',
                }}
              >
                {getUserInitials()}
              </Avatar>
              <Box visibleFrom="sm">
                <Text size="sm" fw={500} lineClamp={1} c="#212529">
                  {user?.name || 'User'}
                </Text>
                {user?.email && (
                  <Text size="xs" c="#868e96" lineClamp={1}>
                    {user.email}
                  </Text>
                )}
              </Box>
              <IconChevronDown size={16} stroke={1.5} style={{ color: '#868e96' }} />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown style={{ borderColor: '#dee2e6' }}>
            {/* User Info in Dropdown */}
            <Box p="sm" mb="xs" style={{ borderBottom: '1px solid #dee2e6' }}>
              <Text size="sm" fw={500} c="#212529">
                {user?.name || 'User'}
              </Text>
              <Text size="xs" c="#868e96" mt={4}>
                {user?.email || ''}
              </Text>
              {user?.role && (
                <Badge
                  variant="light"
                  color="blue"
                  size="sm"
                  mt={8}
                  style={{
                    backgroundColor: '#e7f5ff',
                    color: '#1971c2',
                  }}
                >
                  {user.role.name}
                </Badge>
              )}
            </Box>

            <Menu.Label style={{ color: '#868e96', fontSize: 12 }}>Account</Menu.Label>
            <Menu.Item
              leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => navigate('/app/profile')}
              style={{ color: '#495057' }}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => navigate('/app/settings')}
              style={{ color: '#495057' }}
            >
              Settings
            </Menu.Item>

            <Menu.Divider style={{ borderColor: '#dee2e6' }} />

            <Menu.Item
              color="red"
              leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} />}
              onClick={handleLogout}
              style={{ color: '#fa5252' }}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      {/* Search Modal */}
      <Modal
        opened={searchOpened}
        onClose={() => setSearchOpened(false)}
        title="Search"
        size="lg"
        centered
      >
        <Stack gap="md">
          <TextInput
            placeholder="Search for pages, settings, or content..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            size="md"
            autoFocus
          />

          {searchQuery && (
            <Stack gap="xs">
              <Text size="sm" fw={600} c="dimmed">
                Quick Results
              </Text>
              <Paper p="sm" withBorder style={{ cursor: 'pointer' }} onClick={() => {
                navigate('/app/dashboard');
                setSearchOpened(false);
              }}>
                <Group>
                  <IconSearch size={16} />
                  <Text size="sm">Dashboard</Text>
                </Group>
              </Paper>
              <Paper p="sm" withBorder style={{ cursor: 'pointer' }} onClick={() => {
                navigate('/app/security');
                setSearchOpened(false);
              }}>
                <Group>
                  <IconSearch size={16} />
                  <Text size="sm">Security</Text>
                </Group>
              </Paper>
              <Paper p="sm" withBorder style={{ cursor: 'pointer' }} onClick={() => {
                navigate('/app/audit-log');
                setSearchOpened(false);
              }}>
                <Group>
                  <IconSearch size={16} />
                  <Text size="sm">Access Audit</Text>
                </Group>
              </Paper>
              <Paper p="sm" withBorder style={{ cursor: 'pointer' }} onClick={() => {
                navigate('/app/settings');
                setSearchOpened(false);
              }}>
                <Group>
                  <IconSearch size={16} />
                  <Text size="sm">Settings</Text>
                </Group>
              </Paper>
            </Stack>
          )}
        </Stack>
      </Modal>

      {/* Notification Drawer */}
      <Drawer
        opened={notificationOpened}
        onClose={() => setNotificationOpened(false)}
        title="Notifications"
        position="right"
        size="md"
      >
        <ScrollArea h="calc(100vh - 80px)">
          <Stack gap="md">
            <Timeline active={-1} bulletSize={24} lineWidth={2}>
              <Timeline.Item
                bullet={<IconCheck size={12} />}
                title="Security Group Updated"
                color="green"
              >
                <Text size="xs" c="dimmed" mt={4}>
                  HR Partner security group was successfully updated
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  2 hours ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconAlertCircle size={12} />}
                title="Failed Signon Detected"
                color="red"
              >
                <Text size="xs" c="dimmed" mt={4}>
                  Multiple failed login attempts detected for admin@i8cloud.com
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  4 hours ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconInfoCircle size={12} />}
                title="Integration Completed"
                color="blue"
              >
                <Text size="xs" c="dimmed" mt={4}>
                  Payroll Processing integration completed successfully
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  6 hours ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconCheck size={12} />}
                title="Policy Changed"
                color="green"
              >
                <Text size="xs" c="dimmed" mt={4}>
                  Domain security policy updated for Customer Writeoff
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  1 day ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconAlertCircle size={12} />}
                title="Account Locked"
                color="orange"
              >
                <Text size="xs" c="dimmed" mt={4}>
                  User account payroll.processor@i8cloud.com has been locked
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  2 days ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconInfoCircle size={12} />}
                title="System Maintenance"
                color="blue"
              >
                <Text size="xs" c="dimmed" mt={4}>
                  Scheduled system maintenance completed
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  3 days ago
                </Text>
              </Timeline.Item>
            </Timeline>
          </Stack>
        </ScrollArea>
      </Drawer>
    </Group>
  );
};
