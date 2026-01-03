/**
 * Unauthorized Page (403)
 *
 * Displayed when user tries to access a page without required permissions
 */

import { Container, Title, Text, Button, Group, Paper } from '@mantine/core';
import { IconLock, IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <Container size={560} my={80}>
      <Paper withBorder shadow="md" p={60} radius="md" style={{ textAlign: 'center' }}>
        <IconLock size={80} stroke={1.5} color="#868e96" style={{ margin: '0 auto' }} />

        <Title order={1} mt={24} mb={12}>
          Access Denied
        </Title>

        <Text c="dimmed" size="lg" mb={24}>
          You don't have permission to access this page
        </Text>

        <Text c="dimmed" size="sm" mb={32}>
          If you believe this is an error, please contact your administrator to request access.
        </Text>

        <Group justify="center">
          <Button
            leftSection={<IconHome size={18} />}
            onClick={handleGoHome}
            size="md"
          >
            Go to Home
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};
