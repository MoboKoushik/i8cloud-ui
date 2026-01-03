/**
 * EmptyState Component
 *
 * Generic empty state placeholder for lists/tables with no data
 */

import { Stack, Text, Title } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <IconInbox size={64} stroke={1.5} />,
  title,
  description,
  action,
}) => {
  return (
    <Stack
      align="center"
      justify="center"
      gap="md"
      style={{
        padding: '4rem 2rem',
        minHeight: '300px',
        textAlign: 'center',
      }}
    >
      <div style={{ color: '#868e96', opacity: 0.5 }}>{icon}</div>

      <div>
        <Title order={3} c="dimmed" mb="xs">
          {title}
        </Title>
        {description && (
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        )}
      </div>

      {action && <div>{action}</div>}
    </Stack>
  );
};
