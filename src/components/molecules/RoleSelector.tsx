/**
 * RoleSelector Component
 *
 * Dropdown for selecting a role with permission preview
 */

import {
  Select,
  Text,
  Badge,
  Group,
  Modal,
  Stack,
  Accordion,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { Role, Permission } from '../../types';
import { PermissionBadge } from '../atoms/PermissionBadge';

interface RoleSelectorProps {
  roles: Role[];
  allPermissions: Permission[];
  selectedRoleId: string | null;
  onChange: (roleId: string | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  roles,
  allPermissions,
  selectedRoleId,
  onChange,
  label = 'Role',
  placeholder = 'Select a role',
  required = false,
  error,
  disabled = false,
}) => {
  const [viewPermissionsOpened, { open: openViewPermissions, close: closeViewPermissions }] =
    useDisclosure(false);

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const rolePermissions = allPermissions.filter((p: any) =>
    selectedRole?.permissions.includes(p.key)
  );

  // Group permissions by module
  const groupedPermissions = rolePermissions.reduce((acc, permission) => {
    if (!acc[permission.module as string]) {
      acc[permission.module as string] = [];
    }
    acc[permission.module as string].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const roleOptions = roles
    .filter((role) => role.isActive)
    .map((role) => ({
      value: role.id,
      label: role.name,
    }));

  return (
    <>
      <Stack gap="xs">
        <Select
          label={label}
          placeholder={placeholder}
          data={roleOptions}
          value={selectedRoleId}
          onChange={onChange}
          required={required}
          error={error}
          disabled={disabled}
        />

        {selectedRole && (
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Selected role: <strong>{selectedRole.name}</strong> |{' '}
              <Badge size="sm" variant="light">
                {selectedRole.permissions.length} permissions
              </Badge>
            </Text>
            <Text
              size="sm"
              c="blue"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={openViewPermissions}
            >
              View permissions
            </Text>
          </Group>
        )}
      </Stack>

      {/* View Permissions Modal */}
      <Modal
        opened={viewPermissionsOpened}
        onClose={closeViewPermissions}
        title={`Permissions for ${selectedRole?.name}`}
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            This role has {rolePermissions.length} permissions across{' '}
            {Object.keys(groupedPermissions).length} modules.
          </Text>

          <Accordion variant="separated" multiple>
            {Object.entries(groupedPermissions).map(([moduleKey, modulePermissions]) => (
              <Accordion.Item key={moduleKey} value={moduleKey}>
                <Accordion.Control>
                  <Group justify="space-between">
                    <Text fw={600}>{moduleKey}</Text>
                    <Badge size="sm" variant="light">
                      {modulePermissions.length}
                    </Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs">
                    {modulePermissions.map((permission: any) => (
                      <PermissionBadge
                        key={permission.id}
                        permission={permission}
                        showRiskLevel
                      />
                    ))}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Stack>
      </Modal>
    </>
  );
};
