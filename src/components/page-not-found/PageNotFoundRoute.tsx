/**
 * Not Found Page (404)
 *
 * Displayed when user navigates to a non-existent route
 */

import { Container, Title, Text, Button, Group, Box, Stack } from '@mantine/core';
import { IconError404, IconHome, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
      }}
    >
      <Container size={600}>
        <Stack gap="xl" align="center" style={{ textAlign: 'center' }}>
          {/* Error Code */}
          <Title
            order={1}
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: '#228be6',
              lineHeight: 1,
              letterSpacing: '-0.05em',
            }}
          >
            404
          </Title>

          {/* Main Message */}
          <Stack gap="sm">
            <Title
              order={2}
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: '#212529',
              }}
            >
              Page Not Found
            </Title>

            <Text
              size="lg"
              style={{
                color: '#868e96',
                maxWidth: 450,
                margin: '0 auto',
              }}
            >
              The page you are looking for doesn't exist or has been moved.
            </Text>
          </Stack>

          {/* Action Buttons */}
          <Group justify="center" gap="md" mt="lg">
            <Button
              variant="default"
              leftSection={<IconArrowLeft size={18} />}
              onClick={handleGoBack}
              size="lg"
            >
              Go Back
            </Button>
            <Button
              leftSection={<IconHome size={18} />}
              onClick={handleGoHome}
              size="lg"
            >
              Go to Dashboard
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
};
