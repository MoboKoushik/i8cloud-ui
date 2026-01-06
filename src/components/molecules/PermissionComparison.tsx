/**
 * PermissionComparison Component
 *
 * Shows side-by-side comparison of permissions between two roles
 * Used when changing user roles to visualize permission changes
 */

import { Stack, Group, Text, Badge, Paper, SimpleGrid, Alert } from '@mantine/core';
import { IconPlus, IconMinus, IconEqual, IconAlertCircle } from '@tabler/icons-react';
import type { Permission } from '../../types';
import { PermissionBadge } from '../atoms/PermissionBadge';

interface PermissionComparisonProps {
  currentPermissions: Permission[];
  newPermissions: Permission[];
  showEmptyState?: boolean;
}

export const PermissionComparison: React.FC<PermissionComparisonProps> = ({
  currentPermissions,
  newPermissions,
  showEmptyState = true,
}) => {
  // Calculate permission changes
  const currentPermissionKeys = new Set(currentPermissions.map((p) => p.key));
  const newPermissionKeys = new Set(newPermissions.map((p) => p.key));

  // Added permissions (in new but not in current)
  const addedPermissions = newPermissions.filter((p) => !currentPermissionKeys.has(p.key));

  // Removed permissions (in current but not in new)
  const removedPermissions = currentPermissions.filter((p) => !newPermissionKeys.has(p.key));

  // Unchanged permissions (in both)
  const unchangedPermissions = currentPermissions.filter((p) => newPermissionKeys.has(p.key));

  const hasChanges = addedPermissions.length > 0 || removedPermissions.length > 0;

  // Group permissions by module for better organization
  const groupByModule = (permissions: Permission[]) => {
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.module as string]) {
        acc[permission.module as string] = [];
      }
      acc[permission.module as string].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  };

  const addedByModule = groupByModule(addedPermissions);
  const removedByModule = groupByModule(removedPermissions);
  const unchangedByModule = groupByModule(unchangedPermissions);

  return (
    <Stack gap="md">
      {/* Summary Statistics */}
      <Paper withBorder p="md" bg="gray.0">
        <Group justify="space-between">
          <Group gap="xl">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Current
              </Text>
              <Text size="lg" fw={700}>
                {currentPermissions.length}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                New
              </Text>
              <Text size="lg" fw={700}>
                {newPermissions.length}
              </Text>
            </div>
          </Group>

          <Group gap="xl">
            {addedPermissions.length > 0 && (
              <div>
                <Text size="xs" c="green" tt="uppercase" fw={600}>
                  Added
                </Text>
                <Text size="lg" fw={700} c="green">
                  +{addedPermissions.length}
                </Text>
              </div>
            )}
            {removedPermissions.length > 0 && (
              <div>
                <Text size="xs" c="red" tt="uppercase" fw={600}>
                  Removed
                </Text>
                <Text size="lg" fw={700} c="red">
                  -{removedPermissions.length}
                </Text>
              </div>
            )}
            {unchangedPermissions.length > 0 && (
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Unchanged
                </Text>
                <Text size="lg" fw={700} c="dimmed">
                  {unchangedPermissions.length}
                </Text>
              </div>
            )}
          </Group>
        </Group>
      </Paper>

      {/* No Changes Message */}
      {!hasChanges && showEmptyState && (
        <Alert icon={<IconEqual size={16} />} color="blue" variant="light">
          No permission changes. The new role has the same permissions as the current role.
        </Alert>
      )}

      {/* Added Permissions */}
      {addedPermissions.length > 0 && (
        <Paper withBorder p="md">
          <Stack gap="sm">
            <Group gap="xs">
              <IconPlus size={18} color="green" />
              <Text fw={600} c="green">
                Added Permissions ({addedPermissions.length})
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              These permissions will be granted to the user
            </Text>

            <Stack gap="md" mt="xs">
              {Object.entries(addedByModule).map(([moduleKey, modulePermissions]) => (
                <div key={moduleKey}>
                  <Badge size="sm" variant="light" color="green" mb="xs">
                    {moduleKey} ({modulePermissions.length})
                  </Badge>
                  <SimpleGrid cols={2} spacing="xs">
                    {modulePermissions.map((permission: any) => (
                      <PermissionBadge
                        key={permission.id as string}
                        permission={permission}
                        showRiskLevel
                      />
                    ))}
                  </SimpleGrid>
                </div>
              ))}
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* Removed Permissions */}
      {removedPermissions.length > 0 && (
        <Paper withBorder p="md">
          <Stack gap="sm">
            <Group gap="xs">
              <IconMinus size={18} color="red" />
              <Text fw={600} c="red">
                Removed Permissions ({removedPermissions.length})
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              These permissions will be revoked from the user
            </Text>

            {/* Warning for critical permissions being removed */}
            {removedPermissions.some((p) => p.riskLevel === 'critical' || p.riskLevel === 'high') && (
              <Alert icon={<IconAlertCircle size={16} />} color="orange" variant="light">
                Warning: Critical or high-risk permissions are being removed. This may significantly
                restrict user access.
              </Alert>
            )}

            <Stack gap="md" mt="xs">
              {Object.entries(removedByModule).map(([moduleKey, modulePermissions]) => (
                <div key={moduleKey}>
                  <Badge size="sm" variant="light" color="red" mb="xs">
                    {moduleKey} ({modulePermissions.length})
                  </Badge>
                  <SimpleGrid cols={2} spacing="xs">
                    {modulePermissions.map((permission: any) => (
                      <PermissionBadge
                        key={permission.id}
                        permission={permission}
                        showRiskLevel
                      />
                    ))}
                  </SimpleGrid>
                </div>
              ))}
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* Unchanged Permissions (Collapsed by default) */}
      {unchangedPermissions.length > 0 && (
        <Paper withBorder p="md" bg="gray.0">
          <Stack gap="sm">
            <Group gap="xs">
              <IconEqual size={18} />
              <Text fw={600} c="dimmed">
                Unchanged Permissions ({unchangedPermissions.length})
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              These permissions will remain the same
            </Text>

            <Stack gap="md" mt="xs">
              {Object.entries(unchangedByModule).map(([moduleKey, modulePermissions]) => (
                <div key={moduleKey}>
                  <Badge size="sm" variant="light" color="gray" mb="xs">
                    {moduleKey} ({modulePermissions.length})
                  </Badge>
                  <SimpleGrid cols={2} spacing="xs">
                    {modulePermissions.map((permission: any) => (
                      <PermissionBadge
                        key={permission.id}
                        permission={permission}
                        showRiskLevel={false}
                      />
                    ))}
                  </SimpleGrid>
                </div>
              ))}
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};
