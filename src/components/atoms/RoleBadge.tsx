/**
 * RoleBadge Component
 *
 * Displays a role with system/custom indicator
 */

import { Badge, Group, Tooltip } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { Role } from '../../types';

interface RoleBadgeProps {
  role: Role;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showSystemIndicator?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'sm',
  showSystemIndicator = true,
}) => {
  return (
    <Group gap="xs">
      <Badge color="blue" size={size} variant="light">
        {role.name}
      </Badge>
      {showSystemIndicator && role.isSystem && (
        <Tooltip label="System role - Cannot be deleted">
          <Badge color="gray" size={size} variant="outline" leftSection={<IconLock size={12} />}>
            System
          </Badge>
        </Tooltip>
      )}
    </Group>
  );
};
