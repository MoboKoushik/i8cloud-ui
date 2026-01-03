/**
 * RoleListPage
 *
 * Displays all roles with search, filter, and management capabilities
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  TextInput,
  Select,
  LoadingOverlay,
  Alert,
  Modal,
  Paper,
} from '@mantine/core';
import {
  IconShield,
  IconPlus,
  IconSearch,
  IconFilter,
  IconAlertCircle,
  IconTrash,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { getAllRoles, deleteRole, canDeleteRole } from '../../../services/roles/roleService';
import { Role } from '../../../types';
import { RoleTable } from '../../../components/organisms/RoleTable';
import { usePermissions } from '../../../hooks/usePermissions';
import { ROUTES, buildRoute } from '@/routes';
import { PermissionGuard } from '../../../components/providers/PermissionGuard';

export const RoleListPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load roles
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllRoles();

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load roles');
      }

      setRoles(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading roles');
    } finally {
      setLoading(false);
    }
  };

  // Filter roles
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter (system/custom)
      const matchesType =
        !typeFilter ||
        (typeFilter === 'system' && role.isSystem) ||
        (typeFilter === 'custom' && !role.isSystem);

      // Status filter
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'active' && role.isActive) ||
        (statusFilter === 'inactive' && !role.isActive);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [roles, searchQuery, typeFilter, statusFilter]);

  // Handle navigation
  const handleView = (role: Role) => {
    navigate(buildRoute(ROUTES.ADMIN_ROLES_DETAIL, { id: role.id }));
  };

  const handleEdit = (role: Role) => {
    navigate(buildRoute(ROUTES.ADMIN_ROLES_EDIT, { id: role.id }));
  };

  const handleDuplicate = (role: Role) => {
    navigate(ROUTES.ADMIN_ROLES_CREATE, { state: { duplicateFrom: role } });
  };

  const handleDeleteClick = async (role: Role) => {
    // Check if role can be deleted
    const canDeleteResponse = await canDeleteRole(role.id);

    if (!canDeleteResponse.success || !canDeleteResponse.data?.canDelete) {
      notifications.show({
        title: 'Cannot Delete Role',
        message: canDeleteResponse.data?.reason || 'This role cannot be deleted',
        color: 'red',
      });
      return;
    }

    setRoleToDelete(role);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      setDeleteLoading(true);

      const response = await deleteRole(roleToDelete.id);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete role');
      }

      notifications.show({
        title: 'Role Deleted',
        message: `Role "${roleToDelete.name}" has been deleted successfully`,
        color: 'green',
      });

      // Refresh roles list
      await loadRoles();

      closeDeleteModal();
      setRoleToDelete(null);
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

  // Statistics
  const stats = {
    total: roles.length,
    system: roles.filter((r) => r.isSystem).length,
    custom: roles.filter((r) => !r.isSystem).length,
    active: roles.filter((r) => r.isActive).length,
  };

  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Page Header */}
          <Group justify="space-between">
            <div>
              <Group gap="sm" mb="xs">
                <IconShield size={32} stroke={1.5} />
                <Title order={1}>Role Management</Title>
              </Group>
              <Text c="dimmed">
                Manage roles and their associated permissions. Roles determine what users can access.
              </Text>
            </div>

            <PermissionGuard permission="roles.create">
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={() => navigate(ROUTES.ADMIN_ROLES_CREATE)}
              >
                Create Role
              </Button>
            </PermissionGuard>
          </Group>

          {/* Statistics */}
          <Paper withBorder p="md">
            <Group gap="xl">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Total Roles
                </Text>
                <Text size="xl" fw={700}>
                  {stats.total}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  System Roles
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {stats.system}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Custom Roles
                </Text>
                <Text size="xl" fw={700} c="green">
                  {stats.custom}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Active Roles
                </Text>
                <Text size="xl" fw={700} c="teal">
                  {stats.active}
                </Text>
              </div>
            </Group>
          </Paper>

          {/* Search and Filters */}
          <Card withBorder p="md">
            <Group grow>
              <TextInput
                placeholder="Search roles..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
              <Select
                placeholder="Filter by type"
                leftSection={<IconFilter size={16} />}
                data={[
                  { value: 'system', label: 'System Roles' },
                  { value: 'custom', label: 'Custom Roles' },
                ]}
                value={typeFilter}
                onChange={setTypeFilter}
                clearable
              />
              <Select
                placeholder="Filter by status"
                leftSection={<IconFilter size={16} />}
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
              />
            </Group>
          </Card>

          {/* Results Summary */}
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Showing {filteredRoles.length} of {roles.length} roles
            </Text>
            {(searchQuery || typeFilter || statusFilter) && (
              <Text
                size="sm"
                c="blue"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter(null);
                  setStatusFilter(null);
                }}
              >
                Clear filters
              </Text>
            )}
          </Group>

          {/* Error State */}
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              {error}
            </Alert>
          )}

          {/* Loading State */}
          <div style={{ position: 'relative', minHeight: '400px' }}>
            <LoadingOverlay visible={loading} />

            {/* Role Table */}
            {!loading && !error && (
              <RoleTable
                roles={filteredRoles}
                onView={handleView}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDeleteClick}
                canEdit={hasPermission('roles.edit')}
                canDelete={hasPermission('roles.delete')}
                canCreate={hasPermission('roles.create')}
              />
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
            Are you sure you want to delete the role <strong>{roleToDelete?.name}</strong>? This action
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
