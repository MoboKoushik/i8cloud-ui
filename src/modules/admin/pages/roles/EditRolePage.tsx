/**
 * EditRolePage
 *
 * Edit an existing role and its permissions
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
  Textarea,
  Radio,
  Paper,
  Stepper,
  LoadingOverlay,
  Alert,
  Modal,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconShield, IconArrowLeft, IconDeviceFloppy, IconAlertCircle, IconUsers } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { getAllPermissions } from '../../../services/permissions/permissionService';
import { getAllModules } from '../../../services/modules/moduleService';
import { getRoleById, updateRole } from '../../../services/roles/roleService';
import { getUsersByRole } from '../../../services/users/userService';
import { Permission, Module, Role } from '../../../types';
import { PermissionSelector } from '../../../components/organisms/PermissionSelector';
import { ROUTES } from '@/routes';

export const EditRolePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [warningModalOpened, { open: openWarningModal, close: closeWarningModal }] = useDisclosure(false);
  const [pendingPermissions, setPendingPermissions] = useState<string[]>([]);

  const form = useForm({
    initialValues: {
      name: '',
      key: '',
      description: '',
      isActive: true,
      selectedPermissions: [],
    },
    validate: {
      name: (value) => (!value ? 'Role name is required' : null),
      key: (value) => {
        if (!value) return 'Role key is required';
        if (!/^[a-z0-9_]+$/.test(value)) {
          return 'Role key must contain only lowercase letters, numbers, and underscores';
        }
        return null;
      },
      selectedPermissions: (value) =>
        value.length === 0 ? 'At least one permission must be selected' : null,
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

      const [roleResponse, permissionsResponse, modulesResponse, usersResponse] = await Promise.all([
        getRoleById(id),
        getAllPermissions(),
        getAllModules(),
        getUsersByRole(id),
      ]);

      if (!roleResponse.success || !roleResponse.data) {
        throw new Error(roleResponse.error?.message || 'Failed to load role');
      }

      if (!permissionsResponse.success) {
        throw new Error(permissionsResponse.error?.message || 'Failed to load permissions');
      }

      if (!modulesResponse.success) {
        throw new Error(modulesResponse.error?.message || 'Failed to load modules');
      }

      const roleData = roleResponse.data;
      setRole(roleData);
      setPermissions(permissionsResponse.data || []);
      setModules(modulesResponse.data || []);
      setUserCount(usersResponse.data?.length || 0);

      // Populate form
      form.setValues({
        name: roleData.name,
        key: roleData.key,
        description: roleData.description,
        isActive: roleData.isActive,
        selectedPermissions: roleData.permissions,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (newPermissions: string[]) => {
    // If role has users and permissions are being removed, show warning
    if (userCount > 0 && role) {
      const removedPermissions = role.permissions.filter((p) => !newPermissions.includes(p));
      if (removedPermissions.length > 0) {
        setPendingPermissions(newPermissions);
        openWarningModal();
        return;
      }
    }

    form.setFieldValue('selectedPermissions', newPermissions);
  };

  const handleConfirmPermissionChange = () => {
    form.setFieldValue('selectedPermissions', pendingPermissions);
    closeWarningModal();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!id) return;

    try {
      setSaving(true);

      const response = await updateRole(id, {
        name: values.name,
        key: values.key,
        description: values.description,
        permissions: values.selectedPermissions,
        isActive: values.isActive,
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update role');
      }

      notifications.show({
        title: 'Role Updated',
        message: `Role "${values.name}" has been updated successfully`,
        color: 'green',
      });

      navigate(ROUTES.ADMIN_ROLES);
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

  const nextStep = () => {
    if (activeStep === 0) {
      const errors = form.validate();
      if (errors.hasErrors) {
        const basicInfoErrors = ['name', 'key', 'description'].some(
          (field) => errors.errors[field]
        );
        if (basicInfoErrors) return;
      }
    }
    setActiveStep((current) => (current < 1 ? current + 1 : current));
  };

  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Group gap="sm" mb="xs">
                <IconShield size={32} stroke={1.5} />
                <Title order={1}>Edit Role</Title>
                {role?.isSystem && (
                  <Badge color="gray" variant="outline">
                    System Role
                  </Badge>
                )}
              </Group>
              <Text c="dimmed">
                {role?.isSystem
                  ? 'Editing system role - cannot be deleted'
                  : 'Modify role details and permissions'}
              </Text>
            </div>

            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(ROUTES.ADMIN_ROLES)}
            >
              Back to Roles
            </Button>
          </Group>

          {/* User Count Warning */}
          {userCount > 0 && (
            <Alert icon={<IconUsers size={16} />} color="blue">
              This role is currently assigned to <strong>{userCount} user(s)</strong>. Changes will
              affect their access immediately.
            </Alert>
          )}

          {/* System Role Warning */}
          {role?.isSystem && role.key === 'super_admin' && (
            <Alert icon={<IconAlertCircle size={16} />} color="orange">
              <strong>Warning:</strong> This is the SUPER_ADMIN role. Be careful when modifying
              permissions as it controls full system access.
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

            {!loading && !error && role && (
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="xl">
                  {/* Stepper */}
                  <Stepper active={activeStep} onStepClick={setActiveStep}>
                    <Stepper.Step label="Basic Information" description="Role details">
                      <Paper withBorder p="xl" mt="xl">
                        <Stack gap="md">
                          <TextInput
                            label="Role Name"
                            placeholder="e.g., Regional Manager"
                            required
                            {...form.getInputProps('name')}
                          />

                          <TextInput
                            label="Role Key"
                            placeholder="e.g., regional_manager"
                            description="Unique identifier (lowercase, numbers, underscores only)"
                            required
                            disabled={role.isSystem}
                            {...form.getInputProps('key')}
                          />

                          <Textarea
                            label="Description"
                            placeholder="Describe the purpose of this role..."
                            minRows={3}
                            {...form.getInputProps('description')}
                          />

                          <Radio.Group
                            label="Status"
                            {...form.getInputProps('isActive')}
                            value={form.values.isActive ? 'active' : 'inactive'}
                            onChange={(value) => form.setFieldValue('isActive', value === 'active')}
                          >
                            <Group mt="xs">
                              <Radio value="active" label="Active" />
                              <Radio value="inactive" label="Inactive" />
                            </Group>
                          </Radio.Group>
                        </Stack>
                      </Paper>
                    </Stepper.Step>

                    <Stepper.Step label="Permissions" description="Manage permissions">
                      <Paper withBorder p="xl" mt="xl">
                        <PermissionSelector
                          permissions={permissions}
                          modules={modules}
                          selectedPermissionKeys={form.values.selectedPermissions}
                          onChange={handlePermissionChange}
                          error={form.errors.selectedPermissions as string}
                        />
                      </Paper>
                    </Stepper.Step>
                  </Stepper>

                  {/* Navigation Buttons */}
                  <Group justify="space-between" mt="xl">
                    <Button variant="default" onClick={prevStep} disabled={activeStep === 0}>
                      Previous
                    </Button>

                    {activeStep < 1 ? (
                      <Button onClick={nextStep}>Next Step</Button>
                    ) : (
                      <Button
                        type="submit"
                        leftSection={<IconDeviceFloppy size={18} />}
                        loading={saving}
                      >
                        Save Changes
                      </Button>
                    )}
                  </Group>
                </Stack>
              </form>
            )}
          </div>
        </Stack>
      </Container>

      {/* Permission Change Warning Modal */}
      <Modal
        opened={warningModalOpened}
        onClose={closeWarningModal}
        title="Confirm Permission Changes"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="orange">
            <strong>{userCount} user(s)</strong> currently have this role. Removing permissions will
            affect their access immediately.
          </Alert>

          <Text size="sm">
            Are you sure you want to continue with these permission changes?
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={closeWarningModal}>
              Cancel
            </Button>
            <Button color="orange" onClick={handleConfirmPermissionChange}>
              Confirm Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
