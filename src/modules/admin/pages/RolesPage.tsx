/**
 * Roles Management Page
 *
 * SuperAdmin interface for managing roles and assigning permissions
 * SuperAdmin role is excluded from the list
 */

import { useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Table,
  Button,
  Group,
  TextInput,
  Modal,
  Stack,
  ActionIcon,
  Badge,
  Text,
  Box,
  Textarea,
  MultiSelect,
  Checkbox,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconShieldCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Role, Permission } from '@/types/permissions';

// Mock permissions data
const mockPermissions: Permission[] = [
  { id: 1, action: 'read', subject: 'dashboard', description: 'View dashboard' },
  { id: 2, action: 'create', subject: 'dashboard', description: 'Create dashboard widgets' },
  { id: 3, action: 'update', subject: 'dashboard', description: 'Update dashboard widgets' },
  { id: 4, action: 'delete', subject: 'dashboard', description: 'Delete dashboard widgets' },
  { id: 5, action: 'read', subject: 'users', description: 'View users' },
  { id: 6, action: 'create', subject: 'users', description: 'Create new users' },
  { id: 7, action: 'update', subject: 'users', description: 'Update user details' },
  { id: 8, action: 'delete', subject: 'users', description: 'Delete users' },
  { id: 9, action: 'read', subject: 'roles', description: 'View roles' },
  { id: 10, action: 'create', subject: 'roles', description: 'Create new roles' },
  { id: 11, action: 'update', subject: 'roles', description: 'Update role details' },
  { id: 12, action: 'delete', subject: 'roles', description: 'Delete roles' },
  { id: 13, action: 'read', subject: 'permissions', description: 'View permissions' },
  { id: 14, action: 'create', subject: 'permissions', description: 'Create permissions' },
  { id: 15, action: 'update', subject: 'permissions', description: 'Update permissions' },
  { id: 16, action: 'delete', subject: 'permissions', description: 'Delete permissions' },
  { id: 17, action: 'read', subject: 'security', description: 'View security modules' },
  { id: 18, action: 'create', subject: 'security', description: 'Create security groups' },
  { id: 19, action: 'update', subject: 'security', description: 'Update security groups' },
  { id: 20, action: 'delete', subject: 'security', description: 'Delete security groups' },
  { id: 21, action: 'read', subject: 'access-audit', description: 'View access audit logs' },
  { id: 22, action: 'read', subject: 'raas', description: 'View RaaS reports' },
  { id: 23, action: 'create', subject: 'raas', description: 'Create RaaS reports' },
  { id: 24, action: 'read', subject: 'settings', description: 'View settings' },
  { id: 25, action: 'update', subject: 'settings', description: 'Update settings' },
];

// Mock roles data - SuperAdmin role excluded
const mockRoles: Role[] = [
  { id: 2, name: 'Admin', description: 'Administrator with most privileges', is_admin: 1 },
  { id: 3, name: 'HR Manager', description: 'Manages HR-related tasks', is_admin: 0 },
  { id: 4, name: 'Security Analyst', description: 'Analyzes security and audit logs', is_admin: 0 },
  { id: 5, name: 'Report Viewer', description: 'Can only view reports', is_admin: 0 },
  { id: 6, name: 'User Manager', description: 'Manages users and their access', is_admin: 0 },
];

export const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_admin: 0,
    selectedPermissions: [] as number[],
  });

  // Filter roles based on search - exclude superadmin
  const filteredRoles = roles.filter(
    (role) =>
      role.is_superadmin !== 1 &&
      (role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || '',
        is_admin: role.is_admin,
        selectedPermissions: role.permissions?.map((rp) => rp.permissionId) || [],
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        description: '',
        is_admin: 0,
        selectedPermissions: [],
      });
    }
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      is_admin: 0,
      selectedPermissions: [],
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Role name is required',
        color: 'red',
      });
      return;
    }

    if (editingRole) {
      // Update existing role
      setRoles(
        roles.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                name: formData.name,
                description: formData.description,
                is_admin: formData.is_admin,
              }
            : r
        )
      );
      notifications.show({
        title: 'Success',
        message: 'Role updated successfully',
        color: 'green',
      });
    } else {
      // Create new role
      const newRole: Role = {
        id: Math.max(...roles.map((r) => r.id)) + 1,
        name: formData.name,
        description: formData.description,
        is_admin: formData.is_admin,
      };
      setRoles([...roles, newRole]);
      notifications.show({
        title: 'Success',
        message: 'Role created successfully',
        color: 'green',
      });
    }

    handleCloseModal();
  };

  const handleDelete = (role: Role) => {
    if (role.is_superadmin === 1) {
      notifications.show({
        title: 'Error',
        message: 'Cannot delete SuperAdmin role',
        color: 'red',
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      setRoles(roles.filter((r) => r.id !== role.id));
      notifications.show({
        title: 'Success',
        message: 'Role deleted successfully',
        color: 'green',
      });
    }
  };

  // Group permissions by subject for easier selection
  const permissionOptions = mockPermissions.map((p) => ({
    value: String(p.id),
    label: `${p.subject} - ${p.action.toUpperCase()}`,
    group: p.subject,
  }));

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Box>
            <Title order={2} c="#212529">
              Roles Management
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              Manage roles and assign permissions (SuperAdmin role is hidden)
            </Text>
          </Box>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => handleOpenModal()}
            variant="filled"
            color="blue"
          >
            Create Role
          </Button>
        </Group>

        {/* Search */}
        <Paper shadow="xs" p="md" withBorder>
          <TextInput
            placeholder="Search roles by name or description..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            size="md"
          />
        </Paper>

        {/* Roles Table */}
        <Paper shadow="xs" withBorder>
          <Table highlightOnHover striped>
            <Table.Thead>
              <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                <Table.Th style={{ fontWeight: 600, color: '#495057' }}>ID</Table.Th>
                <Table.Th style={{ fontWeight: 600, color: '#495057' }}>Role Name</Table.Th>
                <Table.Th style={{ fontWeight: 600, color: '#495057' }}>Description</Table.Th>
                <Table.Th style={{ fontWeight: 600, color: '#495057' }}>Type</Table.Th>
                <Table.Th style={{ fontWeight: 600, color: '#495057', textAlign: 'right' }}>
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredRoles.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">
                      No roles found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredRoles.map((role) => (
                  <Table.Tr key={role.id}>
                    <Table.Td style={{ color: '#495057' }}>{role.id}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Text fw={600} c="#212529">
                          {role.name}
                        </Text>
                        {role.is_admin === 1 && (
                          <IconShieldCheck size={16} color="#228be6" />
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {role.description || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {role.is_admin === 1 ? (
                        <Badge color="blue" variant="light">
                          ADMIN
                        </Badge>
                      ) : (
                        <Badge color="gray" variant="light">
                          USER
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="flex-end">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleOpenModal(role)}
                          aria-label="Edit role"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(role)}
                          aria-label="Delete role"
                          disabled={role.is_superadmin === 1}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Paper>

        {/* Stats */}
        <Group>
          <Paper shadow="xs" p="md" withBorder style={{ flex: 1 }}>
            <Text size="sm" c="dimmed">
              Total Roles
            </Text>
            <Text size="xl" fw={700} c="#1971c2">
              {filteredRoles.length}
            </Text>
          </Paper>
          <Paper shadow="xs" p="md" withBorder style={{ flex: 1 }}>
            <Text size="sm" c="dimmed">
              Admin Roles
            </Text>
            <Text size="xl" fw={700} c="#1971c2">
              {filteredRoles.filter((r) => r.is_admin === 1).length}
            </Text>
          </Paper>
          <Paper shadow="xs" p="md" withBorder style={{ flex: 1 }}>
            <Text size="sm" c="dimmed">
              User Roles
            </Text>
            <Text size="xl" fw={700} c="#1971c2">
              {filteredRoles.filter((r) => r.is_admin === 0).length}
            </Text>
          </Paper>
        </Group>
      </Stack>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={editingRole ? 'Edit Role' : 'Create Role'}
        size="lg"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Role Name"
            placeholder="Enter role name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter role description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
            rows={3}
          />

          <Checkbox
            label="Admin Role (grants admin-level privileges)"
            checked={formData.is_admin === 1}
            onChange={(e) =>
              setFormData({ ...formData, is_admin: e.currentTarget.checked ? 1 : 0 })
            }
          />

          <MultiSelect
            label="Permissions"
            placeholder="Select permissions for this role"
            data={permissionOptions}
            value={formData.selectedPermissions.map(String)}
            onChange={(values) =>
              setFormData({ ...formData, selectedPermissions: values.map(Number) })
            }
            searchable
            clearable
            maxDropdownHeight={300}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="filled" color="blue">
              {editingRole ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default RolesPage;
