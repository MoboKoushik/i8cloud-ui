/**
 * CreateRolePage
 *
 * Create a new role with permission selection
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconShield, IconArrowLeft, IconDeviceFloppy, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getAllPermissions } from '../../../services/permissions/permissionService';
import { getAllModules } from '../../../services/modules/moduleService';
import { createRole } from '../../../services/roles/roleService';
import { Permission, Module, Role } from '../../../types';
import { PermissionSelector } from '../../../components/organisms/PermissionSelector';
import { ROUTES } from '@/routes';
import { generateRoleKey } from '../../../utils/formatters';

interface LocationState {
  duplicateFrom?: Role;
}

export const CreateRolePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const form = useForm({
    initialValues: {
      name: state?.duplicateFrom ? `${state.duplicateFrom.name} (Copy)` : '',
      key: '',
      description: state?.duplicateFrom?.description || '',
      isActive: true,
      selectedPermissions: state?.duplicateFrom?.permissions || [],
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
    loadData();
  }, []);

  // Auto-generate key from name
  useEffect(() => {
    if (form.values.name && !form.isTouched('key')) {
      form.setFieldValue('key', generateRoleKey(form.values.name));
    }
  }, [form.values.name]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [permissionsResponse, modulesResponse] = await Promise.all([
        getAllPermissions(),
        getAllModules(),
      ]);

      if (!permissionsResponse.success) {
        throw new Error(permissionsResponse.error?.message || 'Failed to load permissions');
      }

      if (!modulesResponse.success) {
        throw new Error(modulesResponse.error?.message || 'Failed to load modules');
      }

      setPermissions(permissionsResponse.data || []);
      setModules(modulesResponse.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSaving(true);

      const response = await createRole({
        name: values.name,
        key: values.key,
        description: values.description,
        permissions: values.selectedPermissions,
        isActive: values.isActive,
        isSystem: false,
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create role');
      }

      notifications.show({
        title: 'Role Created',
        message: `Role "${values.name}" has been created successfully`,
        color: 'green',
      });

      navigate(ROUTES.ADMIN_ROLES);
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

  const nextStep = () => {
    if (activeStep === 0) {
      // Validate basic information
      const errors = form.validate();
      if (errors.hasErrors) {
        // Only check basic info fields
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
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Group gap="sm" mb="xs">
              <IconShield size={32} stroke={1.5} />
              <Title order={1}>
                {state?.duplicateFrom ? 'Duplicate Role' : 'Create New Role'}
              </Title>
            </Group>
            <Text c="dimmed">
              {state?.duplicateFrom
                ? `Creating a copy of "${state.duplicateFrom.name}"`
                : 'Create a new role and assign permissions'}
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

                  <Stepper.Step label="Permissions" description="Assign permissions">
                    <Paper withBorder p="xl" mt="xl">
                      <PermissionSelector
                        permissions={permissions}
                        modules={modules}
                        selectedPermissionKeys={form.values.selectedPermissions}
                        onChange={(keys) => form.setFieldValue('selectedPermissions', keys)}
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
                      Create Role
                    </Button>
                  )}
                </Group>
              </Stack>
            </form>
          )}
        </div>
      </Stack>
    </Container>
  );
};
