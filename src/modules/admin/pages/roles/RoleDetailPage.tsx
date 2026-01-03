/**
 * RoleDetailPage
 *
 * View role details, permissions, and assigned users
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
  Badge,
  LoadingOverlay,
  Alert,
  Accordion,
  Table,
  Grid,
  Modal,
} from '@mantine/core';
import {
  IconShield,
  IconArrowLeft,
  IconEdit,
  IconCopy,
  IconTrash,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { getRoleById, deleteRole, canDeleteRole } from '../../../services/roles/roleService';
import { getUsersByRole } from '../../../services/users/userService';
import { getAllPermissions } from '../../../services/permissions/permissionService';
import { getAllModules } from '../../../services/modules/moduleService';
import { Role, User, Permission, Module } from '../../../types';
import { StatusBadge } from '../../../components/atoms/StatusBadge';
import { RoleBadge } from '../../../components/atoms/RoleBadge';
import { PermissionBadge } from '../../../components/atoms/PermissionBadge';
import { usePermissions } from '../../../hooks/usePermissions';
import { PermissionGuard } from '../../../components/providers/PermissionGuard';
import { ROUTES, buildRoute } from '@/routes';
import { formatDate, formatDateTime } from '../../../utils/formatters';

export const RoleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = usePermissions();

  const [role, setRole] = useState<Role | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

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

      const [roleResponse, usersResponse, permissionsResponse, modulesResponse] = await Promise.all([
        getRoleById(id),
        getUsersByRole(id),
        getAllPermissions(),
        getAllModules(),
      ]);

      if (!roleResponse.success || !roleResponse.data) {
        throw new Error(roleResponse.error?.message || 'Failed to load role');
      }

      setRole(roleResponse.data);
      setUsers(usersResponse.data || []);
      setPermissions(permissionsResponse.data || []);
      setModules(modulesResponse.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(buildRoute(ROUTES.ADMIN_ROLES_EDIT, { id }));
    }
  };

  const handleDuplicate = () => {
    navigate(ROUTES.ADMIN_ROLES_CREATE, { state: { duplicateFrom: role } });
  };

  const handleDeleteClick = async () => {
    if (!id) return;

    // Check if role can be deleted
    const canDeleteResponse = await canDeleteRole(id);

    if (!canDeleteResponse.success || !canDeleteResponse.data?.canDelete) {
      notifications.show({
        title: 'Cannot Delete Role',
        message: canDeleteResponse.data?.reason || 'This role cannot be deleted',
        color: 'red',
      });
      return;
    }

    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (!id) return;

    try {
      setDeleteLoading(true);

      const response = await deleteRole(id);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete role');
      }

      notifications.show({
        title: 'Role Deleted',
        message: `Role "${role?.name}" has been deleted successfully`,
        color: 'green',
      });

      navigate(ROUTES.ADMIN_ROLES);
    } catch (err) {
      notifications.show({
        title: 'Delete Failed',
        message: err instanceof Error ? err.message : 'An error occurred',
        color: 'red',
      });
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };

  // Group permissions by module
  const groupedPermissions = permissions
    .filter((p) => role?.permissions.includes(p.key))
    .reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);

  const getModuleName = (moduleKey: string) => {
    const module = modules.find((m) => m.key === moduleKey);
    return module?.name || moduleKey;
  };

  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Group gap="sm" mb="xs">
                <IconShield size={32} stroke={1.5} />
                <Title order={1}>Role Details</Title>
              </Group>
            </div>

            <Group>
              <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => navigate(ROUTES.ADMIN_ROLES)}
              >
                Back to Roles
              </Button>

              <PermissionGuard permission="roles.edit">
                <Button
                  leftSection={<IconEdit size={18} />}
                  onClick={handleEdit}
                >
                  Edit Role
                </Button>
              </PermissionGuard>
            </Group>
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

            {!loading && !error && role && (
              <Stack gap="lg">
                {/* Role Information */}
                <Paper withBorder p="xl">
                  <Stack gap="lg">
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>
                          Role Name
                        </Text>
                        <RoleBadge role={role} size="lg" />
                      </div>

                      <StatusBadge status={role.isActive ? 'active' : 'inactive'} size="lg" />
                    </Group>

                    <div>
                      <Text size="sm" c="dimmed" mb={4}>
                        Role Key
                      </Text>
                      <Badge variant="light" size="lg">
                        {role.key}
                      </Badge>
                    </div>

                    <div>
                      <Text size="sm" c="dimmed" mb={4}>
                        Description
                      </Text>
                      <Text>{role.description}</Text>
                    </div>

                    <Grid>
                      <Grid.Col span={6}>
                        <Text size="sm" c="dimmed" mb={4}>
                          Created Date
                        </Text>
                        <Text>{formatDate(role.createdAt)}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text size="sm" c="dimmed" mb={4}>
                          Last Modified
                        </Text>
                        <Text>{formatDateTime(role.updatedAt)}</Text>
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Paper>

                {/* Permissions */}
                <Paper withBorder p="xl">
                  <Title order={3} mb="md">
                    Permissions ({role.permissions.length})
                  </Title>

                  <Accordion variant="separated" multiple>
                    {Object.entries(groupedPermissions).map(([moduleKey, modulePermissions]) => (
                      <Accordion.Item key={moduleKey} value={moduleKey}>
                        <Accordion.Control>
                          <Group justify="space-between">
                            <Text fw={600}>{getModuleName(moduleKey)}</Text>
                            <Badge size="sm" variant="light">
                              {modulePermissions.length} permissions
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
                </Paper>

                {/* Assigned Users */}
                <Paper withBorder p="xl">
                  <Title order={3} mb="md">
                    Assigned Users ({users.length})
                  </Title>

                  {users.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">
                      No users are currently assigned to this role
                    </Text>
                  ) : (
                    <Table.ScrollContainer minWidth={500}>
                      <Table striped highlightOnHover>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Full Name</Table.Th>
                            <Table.Th>Username</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Status</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {users.map((user) => (
                            <Table.Tr key={user.id}>
                              <Table.Td>{user.fullName}</Table.Td>
                              <Table.Td>{user.username}</Table.Td>
                              <Table.Td>{user.email}</Table.Td>
                              <Table.Td>
                                <StatusBadge status={user.status} />
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Table.ScrollContainer>
                  )}
                </Paper>

                {/* Actions */}
                <Group justify="flex-end">
                  <PermissionGuard permission="roles.create">
                    <Button
                      variant="light"
                      leftSection={<IconCopy size={18} />}
                      onClick={handleDuplicate}
                    >
                      Duplicate Role
                    </Button>
                  </PermissionGuard>

                  <PermissionGuard permission="roles.delete">
                    {!role.isSystem && (
                      <Button
                        color="red"
                        variant="light"
                        leftSection={<IconTrash size={18} />}
                        onClick={handleDeleteClick}
                      >
                        Delete Role
                      </Button>
                    )}
                  </PermissionGuard>
                </Group>
              </Stack>
            )}
          </div>
        </Stack>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            Are you sure you want to delete the role <strong>{role?.name}</strong>? This action
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
              Delete Role
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
