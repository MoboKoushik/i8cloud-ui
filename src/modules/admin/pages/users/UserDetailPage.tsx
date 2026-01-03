/**
 * UserDetailPage
 *
 * View user details with activity log and audit trail
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Paper,
  LoadingOverlay,
  Alert,
  Badge,
  Avatar,
  Accordion,
  Table,
  Modal,
} from '@mantine/core';
import {
  IconUsers,
  IconArrowLeft,
  IconEdit,
  IconKey,
  IconTrash,
  IconAlertCircle,
  IconCircleX,
  IconPower,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { getUserById, deleteUser, canModifyUser } from '../../../services/users/userService';
import { getAllRoles } from '../../../services/roles/roleService';
import { getAllPermissions } from '../../../services/permissions/permissionService';
import { User, Role, Permission } from '../../../types';
import { StatusBadge } from '../../../components/atoms/StatusBadge';
import { RoleBadge } from '../../../components/atoms/RoleBadge';
import { PermissionBadge } from '../../../components/atoms/PermissionBadge';
import { ChangeRoleModal } from '../../../components/organisms/ChangeRoleModal';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES, buildRoute } from '@/routes';
import { formatDate, getInitials } from '../../../utils/formatters';

export const UserDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelf, setIsSelf] = useState(false);

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [changeRoleModalOpened, { open: openChangeRoleModal, close: closeChangeRoleModal }] =
    useDisclosure(false);

  // Load data
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [userResponse, rolesResponse, permissionsResponse] = await Promise.all([
        getUserById(id),
        getAllRoles(),
        getAllPermissions(),
      ]);

      if (!userResponse.success || !userResponse.data) {
        throw new Error(userResponse.error?.message || 'Failed to load user');
      }

      const userData = userResponse.data;
      const allRoles = rolesResponse.data || [];
      const allPerms = permissionsResponse.data || [];
      const userRole = allRoles.find((r) => r.id === userData.roleId);
      const rolePermissions = allPerms.filter((p) =>
        userRole?.permissions.includes(p.key)
      );

      setUser(userData);
      setRole(userRole || null);
      setRoles(allRoles);
      setPermissions(rolePermissions);
      setAllPermissions(allPerms);
      setIsSelf(currentUser?.id === userData.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(buildRoute(ROUTES.ADMIN_USERS_EDIT, { id }));
    }
  };

  const handleChangeRole = () => {
    openChangeRoleModal();
  };

  const handleRoleChanged = async () => {
    // Refresh the user data after role change
    await loadData();
    closeChangeRoleModal();
  };

  const handleDeleteClick = async () => {
    if (!id || !currentUser) return;

    // Check if user can be deleted
    const canModifyResponse = await canModifyUser(id, currentUser.id, 'delete');

    if (!canModifyResponse.success || !canModifyResponse.data?.canModify) {
      notifications.show({
        title: 'Cannot Delete User',
        message: canModifyResponse.data?.reason || 'This user cannot be deleted',
        color: 'red',
      });
      return;
    }

    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (!id || !user || !currentUser) return;

    try {
      setDeleteLoading(true);

      const response = await deleteUser(id, currentUser.id);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete user');
      }

      notifications.show({
        title: 'User Deleted',
        message: `User "${user.fullName}" has been deleted successfully`,
        color: 'green',
      });

      navigate(ROUTES.ADMIN_USERS);
    } catch (err) {
      notifications.show({
        title: 'Delete Failed',
        message: err instanceof Error ? err.message : 'An error occurred',
        color: 'red',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <>
      <Container size="md" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Group gap="sm" mb="xs">
                <IconUsers size={32} stroke={1.5} />
                <Title order={1}>User Details</Title>
                {isSelf && (
                  <Badge color="orange" variant="light">
                    Your Account
                  </Badge>
                )}
              </Group>
              <Text c="dimmed">View user information, role, and permissions</Text>
            </div>

            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(ROUTES.ADMIN_USERS)}
            >
              Back to Users
            </Button>
          </Group>

          {/* Error Alert */}
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              {error}
            </Alert>
          )}

          {/* Loading State */}
          <div style={{ position: 'relative', minHeight: '400px' }}>
            <LoadingOverlay visible={loading} />

            {!loading && !error && user && (
              <Stack gap="lg">
                {/* User Info Card */}
                <Paper withBorder p="xl">
                  <Stack gap="md">
                    <Group>
                      <Avatar size={80} radius="xl" color="blue">
                        {getInitials(user.fullName)}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <Title order={2}>{user.fullName}</Title>
                        <Text size="sm" c="dimmed">
                          @{user.username}
                        </Text>
                        <Group gap="xs" mt="xs">
                          <StatusBadge status={user.status} />
                          {role && <RoleBadge role={role} />}
                        </Group>
                      </div>
                    </Group>

                    <Group grow>
                      <div>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                          Email Address
                        </Text>
                        <Text size="sm" mt={4}>
                          {user.email}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                          Account Created
                        </Text>
                        <Text size="sm" mt={4}>
                          {formatDate(user.createdAt)}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                          Last Login
                        </Text>
                        <Text size="sm" mt={4}>
                          {formatDate(user.lastLogin)}
                        </Text>
                      </div>
                    </Group>
                  </Stack>
                </Paper>

                {/* Current Role & Permissions */}
                <Paper withBorder p="xl">
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Title order={3}>Current Role & Permissions</Title>
                      {role && (
                        <Badge size="lg" variant="light">
                          {permissions.length} permissions
                        </Badge>
                      )}
                    </Group>

                    {role && (
                      <>
                        <Group>
                          <Text size="sm" c="dimmed">
                            Role:
                          </Text>
                          <RoleBadge role={role} />
                        </Group>

                        {role.description && (
                          <Text size="sm" c="dimmed">
                            {role.description}
                          </Text>
                        )}

                        <Accordion variant="separated">
                          {Object.entries(groupedPermissions).map(([moduleKey, modulePermissions]) => (
                            <Accordion.Item key={moduleKey} value={moduleKey}>
                              <Accordion.Control>
                                <Group justify="space-between">
                                  <Text fw={600}>{moduleKey}</Text>
                                  <Badge size="sm" variant="light">
                                    {modulePermissions.length}
                                  </Badge>
                                </Group>
                              </Accordion.Control>
                              <Accordion.Panel>
                                <Stack gap="xs">
                                  {modulePermissions.map((permission) => (
                                    <PermissionBadge
                                      key={permission.id}
                                      permission={permission}
                                      showRiskLevel
                                    />
                                  ))}
                                </Stack>
                              </Accordion.Panel>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </>
                    )}

                    {!role && (
                      <Alert icon={<IconAlertCircle size={16} />} color="orange">
                        No role assigned to this user
                      </Alert>
                    )}
                  </Stack>
                </Paper>

                {/* Activity Log */}
                <Paper withBorder p="xl">
                  <Stack gap="md">
                    <Title order={3}>Activity Log</Title>

                    <Accordion variant="separated" defaultValue="login-history">
                      {/* Login History */}
                      <Accordion.Item value="login-history">
                        <Accordion.Control>
                          <Text fw={600}>Login History</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Table striped>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th>Timestamp</Table.Th>
                                <Table.Th>Status</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {user.lastLogin ? (
                                <Table.Tr>
                                  <Table.Td>{formatDate(user.lastLogin)}</Table.Td>
                                  <Table.Td>
                                    <Badge color="green" variant="light">
                                      Success
                                    </Badge>
                                  </Table.Td>
                                </Table.Tr>
                              ) : (
                                <Table.Tr>
                                  <Table.Td colSpan={2}>
                                    <Text size="sm" c="dimmed" ta="center">
                                      No login history available
                                    </Text>
                                  </Table.Td>
                                </Table.Tr>
                              )}
                            </Table.Tbody>
                          </Table>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* Role Change History */}
                      <Accordion.Item value="role-history">
                        <Accordion.Control>
                          <Text fw={600}>Role Change History</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Table striped>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>From</Table.Th>
                                <Table.Th>To</Table.Th>
                                <Table.Th>Changed By</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              <Table.Tr>
                                <Table.Td colSpan={4}>
                                  <Text size="sm" c="dimmed" ta="center">
                                    No role changes recorded
                                  </Text>
                                </Table.Td>
                              </Table.Tr>
                            </Table.Tbody>
                          </Table>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* Failed Login Attempts */}
                      <Accordion.Item value="failed-logins">
                        <Accordion.Control>
                          <Text fw={600}>Failed Login Attempts</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Table striped>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th>Timestamp</Table.Th>
                                <Table.Th>Reason</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              <Table.Tr>
                                <Table.Td colSpan={2}>
                                  <Text size="sm" c="dimmed" ta="center">
                                    No failed login attempts
                                  </Text>
                                </Table.Td>
                              </Table.Tr>
                            </Table.Tbody>
                          </Table>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </Stack>
                </Paper>

                {/* Actions */}
                <Paper withBorder p="md">
                  <Group justify="space-between">
                    <Group gap="sm">
                      <Button
                        variant="filled"
                        leftSection={<IconEdit size={18} />}
                        onClick={handleEdit}
                        disabled={isSelf}
                      >
                        Edit User
                      </Button>
                      <Button
                        variant="light"
                        leftSection={<IconKey size={18} />}
                        onClick={handleChangeRole}
                        disabled={isSelf}
                      >
                        Change Role
                      </Button>
                      {user.status === 'active' ? (
                        <Button
                          variant="light"
                          color="orange"
                          leftSection={<IconCircleX size={18} />}
                          disabled={isSelf}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="light"
                          color="green"
                          leftSection={<IconPower size={18} />}
                          disabled={isSelf}
                        >
                          Activate
                        </Button>
                      )}
                    </Group>

                    <Button
                      variant="light"
                      color="red"
                      leftSection={<IconTrash size={18} />}
                      onClick={handleDeleteClick}
                      disabled={isSelf}
                    >
                      Delete User
                    </Button>
                  </Group>

                  {isSelf && (
                    <Text size="xs" c="orange" mt="sm">
                      You cannot modify or delete your own account. Ask another administrator for
                      assistance.
                    </Text>
                  )}
                </Paper>
              </Stack>
            )}
          </div>
        </Stack>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Confirm Delete" centered>
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            Are you sure you want to delete the user <strong>{user?.fullName}</strong>? This action
            cannot be undone.
          </Alert>

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={closeDeleteModal} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={handleConfirmDelete}
              loading={deleteLoading}
            >
              Delete User
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Change Role Modal */}
      {user && (
        <ChangeRoleModal
          opened={changeRoleModalOpened}
          onClose={closeChangeRoleModal}
          user={user}
          currentRole={role}
          availableRoles={roles}
          allPermissions={allPermissions}
          onRoleChanged={handleRoleChanged}
          currentUserId={currentUser?.id || ''}
        />
      )}
    </>
  );
};
