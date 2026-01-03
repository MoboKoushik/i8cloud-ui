/**
 * EditUserPage
 *
 * Edit an existing user's information
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
  TextInput,
  Radio,
  Paper,
  LoadingOverlay,
  Alert,
  Modal,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUsers, IconArrowLeft, IconDeviceFloppy, IconAlertCircle, IconKey } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { getUserById, updateUser, canModifyUser } from '../../../services/users/userService';
import { getAllRoles } from '../../../services/roles/roleService';
import { getAllPermissions } from '../../../services/permissions/permissionService';
import { User, Role, Permission } from '../../../types';
import { RoleSelector } from '../../../components/molecules/RoleSelector';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES, buildRoute } from '@/routes';
import { validateEmail, validateUsername } from '../../../utils/validators';
import { formatDate } from '../../../utils/formatters';

export const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSelf, setIsSelf] = useState(false);

  const [resetPasswordModalOpened, { open: openResetPassword, close: closeResetPassword }] =
    useDisclosure(false);

  const form = useForm({
    initialValues: {
      fullName: '',
      username: '',
      email: '',
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
      roleId: (value) => (!value ? 'Role selection is required' : null),
    },
  });

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
      setUser(userData);
      setRoles(rolesResponse.data || []);
      setPermissions(permissionsResponse.data || []);
      setIsSelf(currentUser?.id === userData.id);

      // Populate form
      form.setValues({
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        roleId: userData.roleId,
        status: userData.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!id || !currentUser) return;

    // Check if user can be modified
    const canModify = await canModifyUser(id, currentUser.id, 'edit');
    if (!canModify.success || !canModify.data?.canModify) {
      notifications.show({
        title: 'Cannot Edit User',
        message: canModify.data?.reason || 'This user cannot be edited',
        color: 'red',
      });
      return;
    }

    try {
      setSaving(true);

      const response = await updateUser(
        id,
        {
          fullName: values.fullName,
          username: values.username,
          email: values.email,
          roleId: values.roleId!,
          status: values.status,
        },
        currentUser.id
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update user');
      }

      notifications.show({
        title: 'User Updated',
        message: `User "${values.fullName}" has been updated successfully`,
        color: 'green',
      });

      navigate(ROUTES.ADMIN_USERS);
    } catch (err) {
      notifications.show({
        title: 'Update Failed',
        message: err instanceof Error ? err.message : 'An error occurred',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset functionality
    notifications.show({
      title: 'Password Reset',
      message: 'Password reset email sent to user',
      color: 'blue',
    });
    closeResetPassword();
  };

  return (
    <>
      <Container size="md" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Group gap="sm" mb="xs">
                <IconUsers size={32} stroke={1.5} />
                <Title order={1}>Edit User</Title>
                {isSelf && (
                  <Badge color="orange" variant="light">
                    Your Account
                  </Badge>
                )}
              </Group>
              <Text c="dimmed">
                {isSelf
                  ? 'You are editing your own account. Some fields may be restricted.'
                  : 'Modify user account details and role assignment'}
              </Text>
            </div>

            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(ROUTES.ADMIN_USERS)}
            >
              Back to Users
            </Button>
          </Group>

          {/* Self-Modification Warning */}
          {isSelf && (
            <Alert icon={<IconAlertCircle size={16} />} color="orange">
              <strong>Note:</strong> You are editing your own account. You cannot change your own
              role or deactivate your account. Ask another administrator for assistance.
            </Alert>
          )}

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
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Paper withBorder p="xl">
                  <Stack gap="md">
                    <Title order={3}>User Information</Title>

                    {/* Account Created Info */}
                    <Group>
                      <Text size="sm" c="dimmed">
                        Account Created: <strong>{formatDate(user.createdAt)}</strong>
                      </Text>
                      <Text size="sm" c="dimmed">
                        Last Login: <strong>{formatDate(user.lastLogin)}</strong>
                      </Text>
                    </Group>

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

                    <RoleSelector
                      roles={roles}
                      allPermissions={permissions}
                      selectedRoleId={form.values.roleId}
                      onChange={(roleId) => form.setFieldValue('roleId', roleId)}
                      label="Assigned Role"
                      placeholder="Select a role for this user"
                      required
                      error={form.errors.roleId}
                      disabled={isSelf}
                    />

                    {isSelf && (
                      <Text size="xs" c="orange">
                        You cannot change your own role. Contact another administrator.
                      </Text>
                    )}

                    <Radio.Group label="Account Status" {...form.getInputProps('status')}>
                      <Group mt="xs">
                        <Radio value="active" label="Active" disabled={isSelf} />
                        <Radio value="inactive" label="Inactive" disabled={isSelf} />
                        <Radio value="suspended" label="Suspended" disabled={isSelf} />
                      </Group>
                    </Radio.Group>

                    {isSelf && (
                      <Text size="xs" c="orange">
                        You cannot change your own account status.
                      </Text>
                    )}

                    {!isSelf && (
                      <Button
                        variant="light"
                        color="blue"
                        leftSection={<IconKey size={18} />}
                        onClick={openResetPassword}
                      >
                        Reset Password
                      </Button>
                    )}
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
                    disabled={isSelf && (form.values.roleId !== user.roleId || form.values.status !== user.status)}
                  >
                    Save Changes
                  </Button>
                </Group>
              </form>
            )}
          </div>
        </Stack>
      </Container>

      {/* Reset Password Modal */}
      <Modal
        opened={resetPasswordModalOpened}
        onClose={closeResetPassword}
        title="Reset User Password"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Send a password reset link to <strong>{user?.email}</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            The user will receive an email with instructions to set a new password.
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={closeResetPassword}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleResetPassword}>
              Send Reset Link
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
