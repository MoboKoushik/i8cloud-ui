/**
 * Permission List Page
 *
 * Displays list of all permissions with search and CRUD actions
 */

import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Table,
  ActionIcon,
  Badge,
  Text,
  Modal,
  Stack,
  Pagination,
  Select,
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { getPermissions, createModulePermissions } from '@/services/dataManager';
import { notifications } from '@mantine/notifications';

const PermissionListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [permissions, setPermissions] = useState<any[]>([]);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPermissions(getPermissions());
  };

  const form = useForm({
    initialValues: {
      moduleName: '',
    },
    validate: {
      moduleName: (value) => {
        if (!value) return 'Module name is required';
        if (value.length < 2) return 'Module name must be at least 2 characters';
        return null;
      },
    },
  });

  // Filter permissions based on search
  const filteredPermissions = useMemo(() => {
    return permissions.filter(
      (permission) =>
        permission.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.uuid.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [permissions, searchQuery]);

  // Pagination calculations
  const itemsPerPage = parseInt(pageSize);
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPermissions = filteredPermissions.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreate = () => {
    setAddModalOpened(true);
  };

  const handleAddModule = (values: typeof form.values) => {
    const moduleName = values.moduleName;

    // Generate UUID base
    // eslint-disable-next-line react-hooks/purity
    // const timestamp = Date.now();
    // const baseUuid = `perm-${timestamp}`;

    // Create 4 permission objects (create, read, update, delete)
    // const newPermissions = [
    //   {
    //     uuid: `${baseUuid}-1`,
    //     subject: moduleName,
    //     action: 'create',
    //   },
    //   {
    //     uuid: `${baseUuid}-2`,
    //     subject: moduleName,
    //     action: 'read',
    //   },
    //   {
    //     uuid: `${baseUuid}-3`,
    //     subject: moduleName,
    //     action: 'update',
    //   },
    //   {
    //     uuid: `${baseUuid}-4`,
    //     subject: moduleName,
    //     action: 'delete',
    //   },
    // ];

    // Create permissions using dataManager
    createModulePermissions(moduleName);

    // Reload data
    loadData();

    notifications.show({
      title: 'Success',
      message: `Created 4 permissions for module "${moduleName}"`,
      color: 'green',
    });

    // Close modal and reset form
    setAddModalOpened(false);
    form.reset();
  };

  const handleView = (uuid: string) => {
    navigate(`/app/access/permissions/${uuid}`);
  };

  const handleEdit = (uuid: string) => {
    navigate(`/app/access/permissions/${uuid}/edit`);
  };

  const handleDelete = (uuid: string) => {
    // TODO: Implement delete with confirmation modal
    console.log('Delete permission:', uuid);
  };

  return (
    <>
      <Box p="lg">
        <Container fluid>
          {/* Header */}
          <Group justify="space-between" mb="xl">
            <Title
              order={2}
              size="h3"
              style={{
                color: '#212529',
                fontWeight: 600,
              }}
            >
              Permissions
            </Title>
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={handleCreate}
            >
              Add Module Permissions
            </Button>
          </Group>

          {/* Search and Page Size */}
          <Group justify="space-between" mb="lg">
            <TextInput
              placeholder="Search by subject, action, or UUID..."
              leftSection={<IconSearch size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, maxWidth: 400 }}
              styles={{
                input: {
                  borderRadius: 8,
                },
              }}
            />
            <Select
              label="Items per page"
              value={pageSize}
              onChange={(value) => {
                setPageSize(value || '10');
                setCurrentPage(1);
              }}
              data={[
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]}
              style={{ width: 120 }}
            />
          </Group>

          {/* Table */}
          <Box
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              border: '1px solid #dee2e6',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Table
              striped
              highlightOnHover
              verticalSpacing="sm"
              styles={{
                th: {
                  backgroundColor: '#1971c2',
                  color: '#ffffff',
                  fontWeight: 600,
                  padding: '16px',
                },
                td: {
                  padding: '12px 16px',
                },
              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>UUID</Table.Th>
                  <Table.Th>Subject</Table.Th>
                  <Table.Th>Action</Table.Th>
                  <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedPermissions.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                      <Text c="#868e96">
                        {filteredPermissions.length === 0 ? 'No permissions found' : 'No items on this page'}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  paginatedPermissions.map((permission) => (
                    <Table.Tr key={permission.uuid}>
                      <Table.Td>
                        <Text size="sm" c="#495057" ff="monospace">
                          {permission.uuid}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color="blue"
                          style={{
                            backgroundColor: '#e7f5ff',
                            color: '#1971c2',
                          }}
                        >
                          {permission.subject}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="outline"
                          color="gray"
                          style={{
                            color: '#495057',
                          }}
                        >
                          {permission.action}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group justify="center" gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleView(permission.uuid)}
                            title="View"
                          >
                            <IconEye size={18} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="yellow"
                            onClick={() => handleEdit(permission.uuid)}
                            title="Edit"
                          >
                            <IconEdit size={18} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDelete(permission.uuid)}
                            title="Delete"
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
              <Table.Tfoot>
                <Table.Tr>
                  <Table.Td colSpan={4} style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
                    <Group justify="space-between" align="center">
                      <Text size="sm" c="#495057" fw={500}>
                        Showing {paginatedPermissions.length > 0 ? startIndex + 1 : 0}-
                        {Math.min(endIndex, filteredPermissions.length)} of{' '}
                        {filteredPermissions.length} permissions
                        {searchQuery && (
                          <Text component="span" c="#868e96" ml={4}>
                            (filtered from {permissions.length} total)
                          </Text>
                        )}
                      </Text>

                      {totalPages > 1 && (
                        <Pagination
                          value={currentPage}
                          onChange={setCurrentPage}
                          total={totalPages}
                          size="sm"
                          withEdges
                        />
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              </Table.Tfoot>
            </Table>
          </Box>
        </Container>
      </Box>

      {/* Add Module Modal */}
      {addModalOpened && (
        <Modal
          opened={addModalOpened}
          onClose={() => {
            setAddModalOpened(false);
            form.reset();
          }}
          title="Add Module Permissions"
          centered
          size="md"
          withinPortal={true}
          portalProps={{ target: document.body }}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 1,
          }}
          styles={{
            inner: {
              top: 0,
              left: 0,
            },
          }}
        >
          <form onSubmit={form.onSubmit(handleAddModule)}>
            <Stack gap="md">
              <Text size="sm" c="#868e96">
                Enter a module name to automatically create 4 permissions: create, read, update, and delete.
              </Text>

              <TextInput
                label="Module Name"
                placeholder="e.g., Product, Customer, Invoice"
                required
                {...form.getInputProps('moduleName')}
                styles={{
                  label: { color: '#495057', fontWeight: 500 },
                }}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="default"
                  onClick={() => {
                    setAddModalOpened(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create 4 Permissions
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      )}
    </>
  );
};

export default PermissionListPage;
