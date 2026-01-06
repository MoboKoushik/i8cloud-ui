/**
 * PermissionBadge Component
 *
 * Displays a permission with optional risk level indicator
 */

import { Group, Badge } from '@mantine/core';
import type { Permission } from '../../types';
import { RiskLevelIndicator } from './RiskLevelIndicator';

interface PermissionBadgeProps {
  permission: Permission;
  showRiskLevel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'light' | 'filled' | 'outline';
}

export const PermissionBadge: React.FC<PermissionBadgeProps> = ({
  permission,
  showRiskLevel = false,
  size = 'sm',
  variant = 'light',
}) => {
  return (
    <Group gap="xs">
      <Badge color="blue" size={size} variant={variant}>
        {permission.actionDisplayName}
      </Badge>
      {showRiskLevel && <RiskLevelIndicator level={permission.riskLevel} showLabel={false} size={size} />}
    </Group>
  );
};
