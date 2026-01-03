/**
 * UserListPage
 *
 * Displays all users with search, filter, and management capabilities
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
  Badge,
} from '@mantine/core';
import {
  IconUsers,
  IconPlus,
  IconSearch,
  IconFilter,
  IconAlertCircle,
  IconTrash,
  IconKey,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { getAllUsers, deleteUser, canModifyUser } from '../../../services/users/userService';
import { getAllRoles } from '../../../services/roles/roleService';
import { getAllPermissions } from '../../../services/permissions/permissionService';
import { User, Role, Permission } from '../../../types';
import { UserTable } from '../../../components/organisms/UserTable';
import { ChangeRoleModal } from '../../../components/organisms/ChangeRoleModal';
import { usePermissions } from '../../../hooks/usePermissions';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES, buildRoute } from '@/routes';
import { PermissionGuard } from '../../../components/providers/PermissionGuard';

export const UserListPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [changeRoleModalOpened, { open: openChangeRoleModal, close: closeChangeRoleModal }] =
    useDisclosure(false);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
        getAllUsers(),
        getAllRoles(),
        getAllPermissions(),
      ]);

      if (!usersResponse.success) {
        throw new Error(usersResponse.error?.message || 'Failed to load users');
      }

      if (!rolesResponse.success) {
        throw new Error(rolesResponse.error?.message || 'Failed to load roles');
      }

      setUsers(usersResponse.data || []);
      setRoles(rolesResponse.data || []);
      setPermissions(permissionsResponse.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      const matchesRole = !roleFilter || user.roleId === roleFilter;

      // Status filter
      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Handle navigation
  const handleView = (user: User) => {
    navigate(buildRoute(ROUTES.ADMIN_USERS_DETAIL, { id: user.id }));
  };

  const handleEdit = (user: User) => {
    navigate(buildRoute(ROUTES.ADMIN_USERS_EDIT, { id: user.id }));
  };

  const handleChangeRole = (user: User) => {
    setUserToChangeRole(user);
    openChangeRoleModal();
  };

  const handleRoleChanged = async () => {
    // Refresh the users list after role change
    await loadData();
    closeChangeRoleModal();
    setUserToChangeRole(null);
  };

  const handleDeleteClick = async (user: User) => {
    if (!currentUser) return;

    // Check if user can be deleted
    const canModifyResponse = await canModifyUser(user.id, currentUser.id, 'delete');

    if (!canModifyResponse.success || !canModifyResponse.data?.canModify) {
      notifications.show({
        title: 'Cannot Delete User',
        message: canModifyResponse.data?.reason || 'This user cannot be deleted',
        color: 'red',
      });
      return;
    }

    setUserToDelete(user);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);

      const response = await deleteUser(userToDelete.id);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete user');
      }

      notifications.show({
        title: 'User Deleted',
        message: `User "${userToDelete.fullName}" has been deleted successfully`,
        color: 'green',
      });

      // Refresh users list
      await loadData();

      closeDeleteModal();
      setUserToDelete(null);
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
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
  };

  // Role filter options
  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Page Header */}
          <Group justify="space-between">
            <div>
              <Group gap="sm" mb="xs">
                <IconUsers size={32} stroke={1.5} />
                <Title order={1}>User Management</Title>
              </Group>
              <Text c="dimmed">
                Manage users, assign roles, and control access to the system.
              </Text>
            </div>

            <PermissionGuard permission="users.create">
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={() => navigate(ROUTES.ADMIN_USERS_CREATE)}
              >
                Create User
              </Button>
            </PermissionGuard>
          </Group>

          {/* Statistics */}
          <Paper withBorder p="md">
            <Group gap="xl">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Total Users
                </Text>
                <Text size="xl" fw={700}>
                  {stats.total}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Active
                </Text>
                <Text size="xl" fw={700} c="green">
                  {stats.active}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Inactive
                </Text>
                <Text size="xl" fw={700} c="gray">
                  {stats.inactive}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Suspended
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {stats.suspended}
                </Text>
              </div>
            </Group>
          </Paper>

          {/* Search and Filters */}
          <Card withBorder p="md">
            <Group grow>
              <TextInput
                placeholder="Search users..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
              <Select
                placeholder="Filter by role"
                leftSection={<IconFilter size={16} />}
                data={roleOptions}
                value={roleFilter}
                onChange={setRoleFilter}
                clearable
              />
              <Select
                placeholder="Filter by status"
                leftSection={<IconFilter size={16} />}
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
              />
            </Group>
          </Card>

          {/* Bulk Actions */}
          {selectedUserIds.length > 0 && (
            <Alert color="blue">
              <Group justify="space-between">
                <Text size="sm">
                  <strong>{selectedUserIds.length}</strong> user(s) selected
                </Text>
                <Group gap="xs">
                  <Button size="xs" variant="light" leftSection={<IconKey size={14} />}>
                    Change Role
                  </Button>
                  <Button size="xs" variant="light" color="gray" onClick={() => setSelectedUserIds([])}>
                    Clear Selection
                  </Button>
                </Group>
              </Group>
            </Alert>
          )}

          {/* Results Summary */}
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Showing {filteredUsers.length} of {users.length} users
            </Text>
            {(searchQuery || roleFilter || statusFilter) && (
              <Text
                size="sm"
                c="blue"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter(null);
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

            {/* User Table */}
            {!loading && !error && (
              <UserTable
                users={filteredUsers}
                roles={roles}
                selectedUserIds={selectedUserIds}
                onSelectionChange={setSelectedUserIds}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onChangeRole={handleChangeRole}
                canEdit={hasPermission('users.edit')}
                canDelete={hasPermission('users.delete')}
                canChangeRole={hasPermission('users.change_role')}
                currentUserId={currentUser?.id}
              />
            )}
          </div>
        </Stack>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Confirm Delete" centered>
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            Are you sure you want to delete the user <strong>{userToDelete?.fullName}</strong>? This
            action cannot be undone.
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
      {userToChangeRole && (
        <ChangeRoleModal
          opened={changeRoleModalOpened}
          onClose={closeChangeRoleModal}
          user={userToChangeRole}
          currentRole={roles.find((r) => r.id === userToChangeRole.roleId) || null}
          availableRoles={roles}
          allPermissions={permissions}
          onRoleChanged={handleRoleChanged}
          currentUserId={currentUser?.id || ''}
        />
      )}
    </>
  );
};
