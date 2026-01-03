/**
 * ChangeRoleModal Component
 *
 * Modal for changing a user's role with permission comparison
 * Shows before/after permissions and requires confirmation
 */

import { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  Group,
  Button,
  Select,
  Textarea,
  Checkbox,
  Alert,
  Paper,
  Text,
  Divider,
} from '@mantine/core';
import { IconAlertCircle, IconKey, IconInfoCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { User, Role, Permission } from '../../types';
import { RoleBadge } from '../atoms/RoleBadge';
import { PermissionComparison } from '../molecules/PermissionComparison';
import { changeUserRole } from '../../services/users/userService';

interface ChangeRoleModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
  currentRole: Role | null;
  availableRoles: Role[];
  allPermissions: Permission[];
  onRoleChanged?: (userId: string, newRoleId: string) => void;
  currentUserId: string;
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  opened,
  onClose,
  user,
  currentRole,
  availableRoles,
  allPermissions,
  onRoleChanged,
  currentUserId,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [notifyUser, setNotifyUser] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (opened) {
      setSelectedRoleId(null);
      setReason('');
      setNotifyUser(false);
    }
  }, [opened]);

  const selectedRole = availableRoles.find((r) => r.id === selectedRoleId);

  // Get permissions for current and new roles
  const currentPermissions = allPermissions.filter((p) =>
    currentRole?.permissions.includes(p.key)
  );
  const newPermissions = selectedRole
    ? allPermissions.filter((p) => selectedRole.permissions.includes(p.key))
    : [];

  const isSelfModification = user?.id === currentUserId;

  const handleConfirmChange = async () => {
    if (!user || !selectedRoleId || isSelfModification) return;

    try {
      setLoading(true);

      const response = await changeUserRole(user.id, selectedRoleId, currentUserId, reason || undefined);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to change user role');
      }

      notifications.show({
        title: 'Role Changed',
        message: `${user.fullName}'s role has been updated to ${selectedRole?.name}`,
        color: 'green',
      });

      onRoleChanged?.(user.id, selectedRoleId);
      onClose();
    } catch (err) {
      notifications.show({
        title: 'Role Change Failed',
        message: err instanceof Error ? err.message : 'An error occurred',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = availableRoles
    .filter((role) => role.isActive && role.id !== currentRole?.id)
    .map((role) => ({
      value: role.id,
      label: role.name,
    }));

  const canSubmit = selectedRoleId && !isSelfModification;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Change User Role"
      size="xl"
      centered
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <Stack gap="md">
        {/* User Info */}
        {user && (
          <Paper withBorder p="md" bg="gray.0">
            <Group justify="space-between">
              <div>
                <Text fw={600}>{user.fullName}</Text>
                <Text size="sm" c="dimmed">
                  @{user.username} • {user.email}
                </Text>
              </div>
              {currentRole && <RoleBadge role={currentRole} />}
            </Group>
          </Paper>
        )}

        {/* Self-Modification Warning */}
        {isSelfModification && (
          <Alert icon={<IconAlertCircle size={16} />} color="orange">
            <strong>Cannot change your own role.</strong> Ask another administrator to change your
            role for you.
          </Alert>
        )}

        {/* Current Role Display */}
        <div>
          <Text size="sm" fw={600} mb="xs">
            Current Role
          </Text>
          <Paper withBorder p="sm">
            <Group justify="space-between">
              {currentRole ? (
                <>
                  <div>
                    <Text fw={500}>{currentRole.name}</Text>
                    {currentRole.description && (
                      <Text size="sm" c="dimmed">
                        {currentRole.description}
                      </Text>
                    )}
                  </div>
                  <Text size="sm" c="dimmed">
                    {currentPermissions.length} permissions
                  </Text>
                </>
              ) : (
                <Text c="dimmed">No role assigned</Text>
              )}
            </Group>
          </Paper>
        </div>

        {/* New Role Selector */}
        <Select
          label="New Role"
          placeholder="Select a new role for this user"
          data={roleOptions}
          value={selectedRoleId}
          onChange={setSelectedRoleId}
          required
          disabled={isSelfModification}
          searchable
        />

        {/* New Role Info */}
        {selectedRole && (
          <Paper withBorder p="sm">
            <Group justify="space-between">
              <div>
                <Text fw={500}>{selectedRole.name}</Text>
                {selectedRole.description && (
                  <Text size="sm" c="dimmed">
                    {selectedRole.description}
                  </Text>
                )}
              </div>
              <Text size="sm" c="dimmed">
                {newPermissions.length} permissions
              </Text>
            </Group>
          </Paper>
        )}

        <Divider />

        {/* Permission Comparison */}
        {selectedRoleId && currentRole && (
          <div>
            <Text size="sm" fw={600} mb="md">
              Permission Changes
            </Text>
            <PermissionComparison
              currentPermissions={currentPermissions}
              newPermissions={newPermissions}
              showEmptyState={true}
            />
          </div>
        )}

        <Divider />

        {/* Warning Alert */}
        {selectedRoleId && (
          <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
            <strong>Important:</strong> Changing roles will immediately affect the user's access to
            the system. If the user is currently logged in, they may need to log out and log back in
            for changes to take full effect.
          </Alert>
        )}

        {/* Reason for Change */}
        <Textarea
          label="Reason for Change (Optional)"
          placeholder="Enter the reason for this role change for audit purposes..."
          description="This will be recorded in the audit log"
          value={reason}
          onChange={(e) => setReason(e.currentTarget.value)}
          minRows={3}
          maxRows={5}
          disabled={isSelfModification}
        />

        {/* Notify User Checkbox */}
        <Checkbox
          label="Notify user via email about this role change"
          description="User will receive an email notification (feature disabled in demo mode)"
          checked={notifyUser}
          onChange={(e) => setNotifyUser(e.currentTarget.checked)}
          disabled
        />

        {/* Actions */}
        <Group justify="flex-end" gap="sm" mt="md">
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            leftSection={<IconKey size={18} />}
            onClick={handleConfirmChange}
            loading={loading}
            disabled={!canSubmit}
          >
            Confirm Role Change
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
