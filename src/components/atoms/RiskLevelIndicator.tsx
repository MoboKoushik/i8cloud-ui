/**
 * RiskLevelIndicator Component
 *
 * Displays a visual indicator for permission risk levels
 */

import { Badge, Tooltip } from '@mantine/core';
import { IconAlertTriangle, IconShield, IconInfoCircle } from '@tabler/icons-react';
import { RiskLevel } from '../../types';

interface RiskLevelIndicatorProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const riskLevelConfig: Record<
  RiskLevel,
  {
    color: string;
    icon: React.ReactNode;
    label: string;
    description: string;
  }
> = {
  low: {
    color: 'green',
    icon: <IconInfoCircle size={14} />,
    label: 'Low Risk',
    description: 'Standard permission with minimal security impact',
  },
  medium: {
    color: 'yellow',
    icon: <IconShield size={14} />,
    label: 'Medium Risk',
    description: 'Elevated permission requiring careful assignment',
  },
  high: {
    color: 'orange',
    icon: <IconAlertTriangle size={14} />,
    label: 'High Risk',
    description: 'Sensitive permission with significant security implications',
  },
  critical: {
    color: 'red',
    icon: <IconAlertTriangle size={14} />,
    label: 'Critical Risk',
    description: 'Highly privileged permission requiring strict controls',
  },
};

export const RiskLevelIndicator: React.FC<RiskLevelIndicatorProps> = ({
  level,
  showLabel = true,
  size = 'sm',
}) => {
  const config = riskLevelConfig[level];

  return (
    <Tooltip label={config.description} withArrow>
      <Badge
        color={config.color}
        size={size}
        leftSection={config.icon}
        variant="light"
        style={{ cursor: 'help' }}
      >
        {showLabel ? config.label : null}
      </Badge>
    </Tooltip>
  );
};
