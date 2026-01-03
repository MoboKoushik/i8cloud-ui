/**
 * CreateUserPage
 *
 * Create a new user with role assignment
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  PasswordInput,
  Checkbox,
  Radio,
  Paper,
  LoadingOverlay,
  Alert,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUsers, IconArrowLeft, IconDeviceFloppy, IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getAllRoles } from '../../../services/roles/roleService';
import { getAllPermissions } from '../../../services/permissions/permissionService';
import { createUser } from '../../../services/users/userService';
import { Role, Permission } from '../../../types';
import { RoleSelector } from '../../../components/molecules/RoleSelector';
import { ROUTES } from '@/routes';
import { validateEmail, validateUsername, validatePassword, generateSecurePassword } from '../../../utils/validators';

export const CreateUserPage = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      requirePasswordChange: true,
      roleId: null as string | null,
      status: 'active' as 'active' | 'inactive' | 'suspended',
    },
    validate: {
      fullName: (value) => (!value ? 'Full name is required' : null),
      username: (value) => {
        const result = validateUsername(value);
        return result.valid ? null : result.error;
      },
      email: (value) => {
        const result = validateEmail(value);
        return result.valid ? null : result.error;
      },
      password: (value) => {
        const result = validatePassword(value);
        return result.valid ? null : result.error;
      },
      roleId: (value) => (!value ? 'Role selection is required' : null),
    },
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [rolesResponse, permissionsResponse] = await Promise.all([
        getAllRoles(),
        getAllPermissions(),
      ]);

      if (!rolesResponse.success) {
        throw new Error(rolesResponse.error?.message || 'Failed to load roles');
      }

      if (!permissionsResponse.success) {
        throw new Error(permissionsResponse.error?.message || 'Failed to load permissions');
      }

      setRoles(rolesResponse.data || []);
      setPermissions(permissionsResponse.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    form.setFieldValue('password', newPassword);
    notifications.show({
      title: 'Password Generated',
      message: 'A secure password has been generated',
      color: 'green',
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!values.roleId) return;

    try {
      setSaving(true);

      const response = await createUser({
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        password: values.password,
        roleId: values.roleId,
        status: values.status,
        requirePasswordChange: values.requirePasswordChange,
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create user');
      }

      notifications.show({
        title: 'User Created',
        message: `User "${values.fullName}" has been created successfully`,
        color: 'green',
      });

      navigate(ROUTES.ADMIN_USERS);
    } catch (err) {
      notifications.show({
        title: 'Create Failed',
        message: err instanceof Error ? err.message : 'An error occurred',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Group gap="sm" mb="xs">
              <IconUsers size={32} stroke={1.5} />
              <Title order={1}>Create New User</Title>
            </Group>
            <Text c="dimmed">Create a new user account and assign a role</Text>
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

          {!loading && !error && (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Paper withBorder p="xl">
                <Stack gap="md">
                  <Title order={3}>User Information</Title>

                  <TextInput
                    label="Full Name"
                    placeholder="John Doe"
                    required
                    {...form.getInputProps('fullName')}
                  />

                  <TextInput
                    label="Username"
                    placeholder="john.doe"
                    description="Alphanumeric with dots, underscores, hyphens"
                    required
                    {...form.getInputProps('username')}
                  />

                  <TextInput
                    label="Email Address"
                    placeholder="john.doe@example.com"
                    type="email"
                    required
                    {...form.getInputProps('email')}
                  />

                  <PasswordInput
                    label="Temporary Password"
                    placeholder="Enter password"
                    description="8+ chars, uppercase, lowercase, number, special char"
                    required
                    rightSection={
                      <Tooltip label="Generate secure password">
                        <ActionIcon variant="subtle" onClick={handleGeneratePassword}>
                          <IconRefresh size={18} />
                        </ActionIcon>
                      </Tooltip>
                    }
                    {...form.getInputProps('password')}
                  />

                  <Checkbox
                    label="Require password change on first login"
                    {...form.getInputProps('requirePasswordChange', { type: 'checkbox' })}
                  />

                  <RoleSelector
                    roles={roles}
                    allPermissions={permissions}
                    selectedRoleId={form.values.roleId}
                    onChange={(roleId) => form.setFieldValue('roleId', roleId)}
                    label="Assign Role"
                    placeholder="Select a role for this user"
                    required
                    error={form.errors.roleId}
                  />

                  <Radio.Group
                    label="Account Status"
                    {...form.getInputProps('status')}
                  >
                    <Group mt="xs">
                      <Radio value="active" label="Active" />
                      <Radio value="inactive" label="Inactive" />
                      <Radio value="suspended" label="Suspended" />
                    </Group>
                  </Radio.Group>
                </Stack>
              </Paper>

              <Group justify="flex-end" mt="xl">
                <Button variant="default" onClick={() => navigate(ROUTES.ADMIN_USERS)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  leftSection={<IconDeviceFloppy size={18} />}
                  loading={saving}
                >
                  Create User
                </Button>
              </Group>
            </form>
          )}
        </div>
      </Stack>
    </Container>
  );
};
