import { useEffect } from 'react';
import {
  Box,
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Paper,
  Stack,
  Switch,
  Select,
  PasswordInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoles, getUserById, createUser, updateUser } from '@/services/dataManager';
import { notifications } from '@mantine/notifications';

// interface User {
//   id: string;
//   username: string;
//   password: string;
//   email: string;
//   fullName: string;
//   roleId: string;
//   status: string;
//   createdAt: string;
//   lastLogin: string;
// }

const UserFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      roleId: '',
      status: 'active',
    },
    validate: {
      fullName: (value) => {
        if (!value) return 'Full name is required';
        if (value.length < 2) return 'Full name must be at least 2 characters';
        return null;
      },
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      username: (value) => {
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9._]+$/.test(value)) return 'Username can only contain letters, numbers, dots, and underscores';
        return null;
      },
      password: (value) => {
        if (!isEditMode && !value) return 'Password is required';
        if (value && value.length < 8) return 'Password must be at least 8 characters';
        return null;
      },
      confirmPassword: (value, values) => {
        if (!isEditMode && !value) return 'Please confirm password';
        if (value && value !== values.password) return 'Passwords do not match';
        return null;
      },
      roleId: (value) => {
        if (!value) return 'Role is required';
        return null;
      },
    },
  });

  useEffect(() => {
    // Load user data in edit mode
    if (isEditMode && id) {
      const user = getUserById(id);
      if (user) {
        form.setValues({
          fullName: user.fullName,
          email: user.email,
          username: user.username,
          password: '',
          confirmPassword: '',
          roleId: user.roleId,
          status: user.status,
        });
      }
    }
  }, [id, isEditMode]);

  const handleSubmit = (values: typeof form.values) => {
    try {
      if (isEditMode && id) {
        // Update existing user
        // const existingUser = getUserById(id);
        const updates: any = {
          fullName: values.fullName,
          email: values.email,
          roleId: values.roleId,
          status: values.status,
        };

        // Only update password if provided
        if (values.password) {
          updates.password = values.password;
        }

        updateUser(id, updates);
        notifications.show({
          title: 'Success',
          message: 'User updated successfully',
          color: 'green',
        });
      } else {
        // Create new user
        const newUserData = {
          username: values.username,
          password: values.password,
          email: values.email,
          fullName: values.fullName,
          roleId: values.roleId,
          status: values.status,
        };

        createUser(newUserData);
        notifications.show({
          title: 'Success',
          message: 'User created successfully',
          color: 'green',
        });
      }

      // Navigate back to list
      navigate('/app/access/users');
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to save user',
        color: 'red',
      });
    }
  };

  // Prepare role options for select
  const roles = getRoles();
  const roleOptions = roles.map((role) => ({
    value: role.uuid,
    label: role.name,
  }));

  // Map old role IDs to new ones for backward compatibility
  const getRoleValue = (roleId: string) => {
    const roleMapping: Record<string, string> = {
      'role_001': 'role-001',
      'role_002': 'role-002',
      'role_003': 'role-003',
      'role_004': 'role-004',
      'role_005': 'role-002',
      'role_006': 'role-002',
    };
    return roleMapping[roleId] || roleId;
  };

  return (
    <Box p="lg">
      <Container fluid>
        <Group justify="space-between" mb="xl">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate('/app/access/users')}
            >
              Back
            </Button>
            <Title order={2} style={{ color: '#212529' }}>
              {isEditMode ? 'Edit User' : 'Create User'}
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
                  label="Full Name"
                  placeholder="Enter full name"
                  required
                  {...form.getInputProps('fullName')}
                />
                <TextInput
                  label="Email"
                  placeholder="Enter email address"
                  required
                  type="email"
                  {...form.getInputProps('email')}
                />
                <TextInput
                  label="Username"
                  placeholder="Enter username"
                  required
                  disabled={isEditMode}
                  {...form.getInputProps('username')}
                />
              </Stack>
            </Paper>

            {/* Password Section */}
            <Paper p="xl" style={{ backgroundColor: '#ffffff', borderRadius: 8 }}>
              <Title order={4} mb="md" style={{ color: '#212529' }}>
                {isEditMode ? 'Change Password (Optional)' : 'Set Password'}
              </Title>
              <Stack gap="md">
                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  required={!isEditMode}
                  {...form.getInputProps('password')}
                />
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  required={!isEditMode}
                  {...form.getInputProps('confirmPassword')}
                />
              </Stack>
            </Paper>

            {/* Role & Status */}
            <Paper p="xl" style={{ backgroundColor: '#ffffff', borderRadius: 8 }}>
              <Title order={4} mb="md" style={{ color: '#212529' }}>
                Role & Status
              </Title>
              <Stack gap="md">
                <Select
                  label="Role"
                  placeholder="Select a role"
                  required
                  data={roleOptions}
                  value={getRoleValue(form.values.roleId)}
                  onChange={(value) => form.setFieldValue('roleId', value || '')}
                  error={form.errors.roleId}
                  searchable
                />
                <Switch
                  label="Active"
                  description="Enable or disable this user account"
                  checked={form.values.status === 'active'}
                  onChange={(event) =>
                    form.setFieldValue('status', event.currentTarget.checked ? 'active' : 'inactive')
                  }
                  color="green"
                />
              </Stack>
            </Paper>

            {/* Actions */}
            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/app/access/users')}>
                Cancel
              </Button>
              <Button type="submit" leftSection={<IconDeviceFloppy size={18} />}>
                {isEditMode ? 'Update User' : 'Create User'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Box>
  );
};

export default UserFormPage;
