/**
 * AddPermissionModuleModal Component
 *
 * Modal for creating permissions for a new module
 * Generates 4 permissions: create, read, update, delete
 */

import { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  Group,
  Button,
  TextInput,
  Alert,
  Text,
  List,
  Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconShield, IconInfoCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { createPermissionsForModule } from '../../services/permissions/permissionService';
import { generatePermissionSubject } from '../../utils/formatters';
import type { Permission } from '../../types';

interface AddPermissionModuleModalProps {
  opened: boolean;
  onClose: () => void;
  onPermissionsCreated?: (permissions: Permission[]) => void;
  existingSubjects: string[];
}

export const AddPermissionModuleModal: React.FC<AddPermissionModuleModalProps> = ({
  opened,
  onClose,
  onPermissionsCreated,
  existingSubjects,
}) => {
  const [loading, setLoading] = useState(false);
  const [previewSubject, setPreviewSubject] = useState<string>('');

  const form = useForm({
    initialValues: {
      moduleName: '',
    },
    validate: {
      moduleName: (value) => {
        if (!value) return 'Module name is required';
        if (value.length < 3) return 'Module name must be at least 3 characters';
        if (value.length > 50) return 'Module name must be less than 50 characters';
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
          return 'Module name can only contain letters, numbers, spaces, hyphens, and underscores';
        }

        // Check for duplicate
        const subject = generatePermissionSubject(value);
        if (existingSubjects.some((s) => s.toLowerCase() === subject.toLowerCase())) {
          return `Module "${subject}" already exists`;
        }

        return null;
      },
    },
  });

  // Update preview when module name changes
  useEffect(() => {
    if (form.values.moduleName) {
      setPreviewSubject(generatePermissionSubject(form.values.moduleName));
    } else {
      setPreviewSubject('');
    }
  }, [form.values.moduleName]);

  // Reset form when modal closes
  useEffect(() => {
    if (!opened) {
      form.reset();
      setPreviewSubject('');
    }
  }, [opened]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);

      const response = await createPermissionsForModule(values.moduleName);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create permissions');
      }

      notifications.show({
        title: 'Permissions Created',
        message: `Successfully created 4 permissions for "${previewSubject}" module`,
        color: 'green',
      });

      onPermissionsCreated?.(response.data || []);
      onClose();
    } catch (err) {
      notifications.show({
        title: 'Creation Failed',
        message: err instanceof Error ? err.message : 'An error occurred',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const actions = ['create', 'read', 'update', 'delete'];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Permission Module"
      size="md"
      centered
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      zIndex={1000}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Info Alert */}
          <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
            Enter a module name to automatically generate 4 standard permissions (create, read,
            update, delete).
          </Alert>

          {/* Module Name Input */}
          <TextInput
            label="Module Name"
            placeholder="e.g., Product, Category, Inventory"
            description="A descriptive name for the new module"
            required
            autoFocus
            {...form.getInputProps('moduleName')}
          />

          {/* Preview Section */}
          {previewSubject && !form.errors.moduleName && (
            <Paper withBorder p="md" bg="gray.0">
              <Text size="sm" fw={600} mb="xs">
                Permissions to be created:
              </Text>
              <List size="sm" spacing="xs">
                {actions.map((action) => (
                  <List.Item key={action}>
                    <Text size="sm" c="dimmed">
                      {previewSubject}.{action}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </Paper>
          )}

          {/* Actions */}
          <Group justify="flex-end" gap="sm" mt="md">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" leftSection={<IconShield size={18} />} loading={loading}>
              Create Permissions
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
