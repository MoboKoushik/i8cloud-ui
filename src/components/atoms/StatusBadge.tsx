/**
 * StatusBadge Component
 *
 * Displays status with appropriate color coding
 */

import { Badge } from '@mantine/core';
import { IconCircleCheck, IconCircleX, IconAlertCircle } from '@tabler/icons-react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'suspended';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  withIcon?: boolean;
}

const statusConfig = {
  active: {
    color: 'green',
    label: 'Active',
    icon: <IconCircleCheck size={14} />,
  },
  inactive: {
    color: 'gray',
    label: 'Inactive',
    icon: <IconCircleX size={14} />,
  },
  suspended: {
    color: 'orange',
    label: 'Suspended',
    icon: <IconAlertCircle size={14} />,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', withIcon = true }) => {
  const config = statusConfig[status];

  return (
    <Badge
      color={config.color}
      size={size}
      variant="light"
      leftSection={withIcon ? config.icon : undefined}
    >
      {config.label}
    </Badge>
  );
};
