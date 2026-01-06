import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Textarea,
  Paper,
  Stack,
  Checkbox,
  Grid,
  Switch,
  Divider,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getRoleById,
  getPermissions,
  getPermissionsByRoleId,
  createRole,
  updateRole,
  updateRolePermissions
} from '@/services/dataManager';
import { notifications } from '@mantine/notifications';

interface Permission {
  uuid: string;
  subject: string;
  action: string;
}

// interface RolePermissionMap {
//   uuid: string;
//   role_id: string;
//   permission_id: string;
// }

// interface Role {
//   uuid: string;
//   name: string;
//   description: string;
//   is_admin: number;
//   is_active: number;
//   created_at: string;
//   updated_at: string;
// }

const RoleFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [permissionsByModule, setPermissionsByModule] = useState<Record<string, Permission[]>>({});

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      is_admin: 0,
      is_active: 1,
    },
    validate: {
      name: (value) => {
        if (!value) return 'Role name is required';
        if (value.length < 2) return 'Role name must be at least 2 characters';
        return null;
      },
      description: (value) => {
        if (!value) return 'Description is required';
        if (value.length < 10) return 'Description must be at least 10 characters';
        return null;
      },
    },
  });

  useEffect(() => {
    // Group permissions by module (subject)
    const permissions = getPermissions();
    const grouped = permissions.reduce((acc, perm) => {
      if (!acc[perm.subject]) {
        acc[perm.subject] = [];
      }
      acc[perm.subject].push(perm);
      return acc;
    }, {} as Record<string, Permission[]>);

    setPermissionsByModule(grouped);

    // Load role data in edit mode
    if (isEditMode && id) {
      const role = getRoleById(id);
      if (role) {
        form.setValues({
          name: role.name,
          description: role.description,
          is_admin: role.is_admin,
          is_active: role.is_active,
        });

        // Load existing permissions for this role
        const rolePermissions = getPermissionsByRoleId(id);
        const rolePermIds = rolePermissions.map((p: any) => p.uuid);
        setSelectedPermissions(new Set(rolePermIds));
      }
    }
  }, [id, isEditMode]);

  const handlePermissionToggle = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const handleModuleToggle = (moduleName: string, checked: boolean) => {
    const modulePermissions = permissionsByModule[moduleName];
    const newSelected = new Set(selectedPermissions);

    modulePermissions.forEach((perm) => {
      if (checked) {
        newSelected.add(perm.uuid);
      } else {
        newSelected.delete(perm.uuid);
      }
    });

    setSelectedPermissions(newSelected);
  };

  const isModuleFullySelected = (moduleName: string) => {
    const modulePermissions = permissionsByModule[moduleName];
    return modulePermissions.every((perm) => selectedPermissions.has(perm.uuid));
  };

  const isModulePartiallySelected = (moduleName: string) => {
    const modulePermissions = permissionsByModule[moduleName];
    const selectedCount = modulePermissions.filter((perm) => selectedPermissions.has(perm.uuid)).length;
    return selectedCount > 0 && selectedCount < modulePermissions.length;
  };

  const handleSubmit = (values: typeof form.values) => {
    try {
      let roleUuid: string;

      if (isEditMode && id) {
        // Update existing role
        updateRole(id, {
          name: values.name,
          description: values.description,
          is_admin: values.is_admin,
          is_active: values.is_active,
        });
        roleUuid = id;
        notifications.show({
          title: 'Success',
          message: 'Role updated successfully',
          color: 'green',
        });
      } else {
        // Create new role
        const newRole = createRole({
          name: values.name,
          description: values.description,
          is_admin: values.is_admin,
          is_active: values.is_active,
        });
        roleUuid = newRole.uuid;
        notifications.show({
          title: 'Success',
          message: 'Role created successfully',
          color: 'green',
        });
      }

      // Update role-permission mappings
      const permissionIds = Array.from(selectedPermissions);
      updateRolePermissions(roleUuid, permissionIds);

      // Navigate back to list
      navigate('/app/access/roles');
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to save role',
        color: 'red',
      });
    }
  };

  return (
    <Box p="lg">
      <Container fluid>
        <Group justify="space-between" mb="xl">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate('/app/access/roles')}
            >
              Back
            </Button>
            <Title order={2} style={{ color: '#212529' }}>
              {isEditMode ? 'Edit Role' : 'Create Role'}
            </Title>
          </Group>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl">
            {/* Basic Information */}
            <Paper p="xl" style={{ backgroundColor: '#ffffff', borderRadius: 8 }}>
              <Title order={4} mb="md" style={{ color: '#212529' }}>
                Basic Information
              </Title>
              <Stack gap="md">
                <TextInput
                  label="Role Name"
                  placeholder="Enter role name"
                  required
                  {...form.getInputProps('name')}
                />
                <Textarea
                  label="Description"
                  placeholder="Enter role description"
                  required
                  minRows={3}
                  {...form.getInputProps('description')}
                />
                <Group>
                  <Switch
                    label="Admin Role"
                    description="Grant full administrative access"
                    checked={form.values.is_admin === 1}
                    onChange={(event) =>
                      form.setFieldValue('is_admin', event.currentTarget.checked ? 1 : 0)
                    }
                    color="red"
                  />
                  <Switch
                    label="Active"
                    description="Enable this role"
                    checked={form.values.is_active === 1}
                    onChange={(event) =>
                      form.setFieldValue('is_active', event.currentTarget.checked ? 1 : 0)
                    }
                    color="green"
                  />
                </Group>
              </Stack>
            </Paper>

            {/* Permissions */}
            <Paper p="xl" style={{ backgroundColor: '#ffffff', borderRadius: 8 }}>
              <Title order={4} mb="md" style={{ color: '#212529' }}>
                Access Permissions
              </Title>
              <Text size="sm" c="#868e96" mb="lg">
                Select the permissions this role should have. You can select individual permissions or enable all permissions for a module.
              </Text>

              <Stack gap="lg">
                {Object.keys(permissionsByModule).map((moduleName) => {
                  const modulePerms = permissionsByModule[moduleName];
                  const fullySelected = isModuleFullySelected(moduleName);
                  const partiallySelected = isModulePartiallySelected(moduleName);

                  return (
                    <Box key={moduleName}>
                      <Checkbox
                        label={
                          <Text fw={600} size="md" style={{ color: '#212529' }}>
                            {moduleName}
                          </Text>
                        }
                        checked={fullySelected}
                        indeterminate={partiallySelected}
                        onChange={(event) =>
                          handleModuleToggle(moduleName, event.currentTarget.checked)
                        }
                        mb="sm"
                        color="blue"
                      />
                      <Grid pl="xl">
                        {modulePerms.map((perm) => (
                          <Grid.Col key={perm.uuid} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                            <Checkbox
                              label={
                                <Text size="sm" tt="capitalize">
                                  {perm.action}
                                </Text>
                              }
                              checked={selectedPermissions.has(perm.uuid)}
                              onChange={() => handlePermissionToggle(perm.uuid)}
                              color="blue"
                            />
                          </Grid.Col>
                        ))}
                      </Grid>
                      <Divider mt="md" />
                    </Box>
                  );
                })}
              </Stack>
            </Paper>

            {/* Actions */}
            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/app/access/roles')}>
                Cancel
              </Button>
              <Button type="submit" leftSection={<IconDeviceFloppy size={18} />}>
                {isEditMode ? 'Update Role' : 'Create Role'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Box>
  );
};

export default RoleFormPage;
