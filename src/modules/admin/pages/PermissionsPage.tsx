/**
 * Permissions Management Page
 *
 * SuperAdmin interface for managing permissions (CRUD operations)
 * Actions: create, read, update, delete
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
  Select,
  Modal,
  Stack,
  ActionIcon,
  Badge,
  Text,
  Box,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconSearch } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Permission, Action, Subject } from '@/types/permissions';

// Mock data - replace with API calls
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

const actionOptions: Action[] = ['create', 'read', 'update', 'delete'];
const subjectOptions: Subject[] = [
  'dashboard',
  'raas',
  'integration',
  'access-audit',
  'security',
  'security-group',
  'business-process',
  'domain-process',
  'segregation-duties',
  'settings',
  'users',
  'roles',
  'permissions',
];

export const PermissionsPage = () => {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    action: '' as Action | '',
    subject: '' as Subject | '',
    description: '',
  });

  // Filter permissions based on search
  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (permission?: Permission) => {
    if (permission) {
      setEditingPermission(permission);
      setFormData({
        action: permission.action,
        subject: permission.subject,
        description: permission.description || '',
      });
    } else {
      setEditingPermission(null);
      setFormData({
        action: '',
        subject: '',
        description: '',
      });
    }
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setEditingPermission(null);
    setFormData({
      action: '',
      subject: '',
      description: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.action || !formData.subject) {
      notifications.show({
        title: 'Validation Error',
        message: 'Action and Subject are required',
        color: 'red',
      });
      return;
    }

    if (editingPermission) {
      // Update existing permission
      setPermissions(
        permissions.map((p) =>
          p.id === editingPermission.id
            ? {
                ...p,
                action: formData.action as Action,
                subject: formData.subject as Subject,
                description: formData.description,
              }
            : p
        )
      );
      notifications.show({
        title: 'Success',
        message: 'Permission updated successfully',
        color: 'green',
      });
    } else {
      // Create new permission
      const newPermission: Permission = {
        id: Math.max(...permissions.map((p) => p.id)) + 1,
        action: formData.action as Action,
        subject: formData.subject as Subject,
        description: formData.description,
      };
      setPermissions([...permissions, newPermission]);
      notifications.show({
        title: 'Success',
        message: 'Permission created successfully',
        color: 'green',
      });
    }

    handleCloseModal();
  };

  const handleDelete = (permission: Permission) => {
    if (window.confirm(`Are you sure you want to delete this permission?`)) {
      setPermissions(permissions.filter((p) => p.id !== permission.id));
      notifications.show({
        title: 'Success',
        message: 'Permission deleted successfully',
        color: 'green',
      });
    }
  };

  const getActionColor = (action: Action) => {
    switch (action) {
      case 'create':
        return 'green';
      case 'read':
        return 'blue';
      case 'update':
        return 'yellow';
      case 'delete':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Box>
            <Title order={2} c="#212529">
              Permissions Management
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              Manage system permissions (Create, Read, Update, Delete)
            </Text>
          </Box>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => handleOpenModal()}
            variant="filled"
            color="blue"
          >
            Create Permission
          </Button>
        </Group>

        {/* Search */}
        <Paper shadow="xs" p="md" withBorder>
          <TextInput
            placeholder="Search permissions by action, subject, or description..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            size="md"
          />
        </Paper>

        {/* Permissions Table */}
        <Paper shadow="xs" withBorder>
          <Table highlightOnHover striped>
            <Table.Thead>
              <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                <Table.Th style={{ fontWeight: 600, color: '#495057' }}>ID</Table.Th>
                <Table.Th style={{ fontWeight: 600, color: '#495057' }}>Action</Table.Th>
                <Table.Th style={{ fontWeight: 600, color: '#495057' }}>Subject</Table.Th>
                <Table.Th style={{ fontWeight: 600, color: '#495057' }}>Description</Table.Th>
                <Table.Th style={{ fontWeight: 600, color: '#495057', textAlign: 'right' }}>
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredPermissions.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">
                      No permissions found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredPermissions.map((permission) => (
                  <Table.Tr key={permission.id}>
                    <Table.Td style={{ color: '#495057' }}>{permission.id}</Table.Td>
                    <Table.Td>
                      <Badge color={getActionColor(permission.action)} variant="light">
                        {permission.action.toUpperCase()}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500} c="#212529">
                        {permission.subject}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {permission.description || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="flex-end">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleOpenModal(permission)}
                          aria-label="Edit permission"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(permission)}
                          aria-label="Delete permission"
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
              Total Permissions
            </Text>
            <Text size="xl" fw={700} c="#1971c2">
              {permissions.length}
            </Text>
          </Paper>
          <Paper shadow="xs" p="md" withBorder style={{ flex: 1 }}>
            <Text size="sm" c="dimmed">
              Filtered Results
            </Text>
            <Text size="xl" fw={700} c="#1971c2">
              {filteredPermissions.length}
            </Text>
          </Paper>
        </Group>
      </Stack>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={editingPermission ? 'Edit Permission' : 'Create Permission'}
        size="md"
        centered
      >
        <Stack gap="md">
          <Select
            label="Action"
            placeholder="Select action"
            data={actionOptions.map((action) => ({ value: action, label: action.toUpperCase() }))}
            value={formData.action}
            onChange={(value) => setFormData({ ...formData, action: value as Action })}
            required
            searchable
          />

          <Select
            label="Subject"
            placeholder="Select subject"
            data={subjectOptions.map((subject) => ({ value: subject, label: subject }))}
            value={formData.subject}
            onChange={(value) => setFormData({ ...formData, subject: value as Subject })}
            required
            searchable
          />

          <TextInput
            label="Description"
            placeholder="Enter permission description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="filled" color="blue">
              {editingPermission ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default PermissionsPage;
