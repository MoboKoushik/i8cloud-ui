/**
 * Login Page
 *
 * Handles user authentication with form validation
 */

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  Stack,
  Alert,
  Anchor,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLogin, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../../../hooks/useAuth';

export const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false,
    },

    validate: {
      username: (value) => (!value ? 'Username is required' : null),
      password: (value) => (!value ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoginError(null);

    const result = await login({
      username: values.username,
      password: values.password,
      rememberMe: values.rememberMe,
    });

    if (!result.success) {
      setLoginError(result.error || 'Login failed. Please try again.');
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <Container size={420} my={80}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Stack gap="lg">
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title order={2}>Welcome to i8cloud</Title>
            <Text c="dimmed" size="sm" mt={5}>
              Sign in to access your account
            </Text>
          </div>

          {/* Error Alert */}
          {loginError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Login Failed"
              color="red"
              variant="light"
            >
              {loginError}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                required
                {...form.getInputProps('username')}
                disabled={loading}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                {...form.getInputProps('password')}
                disabled={loading}
              />

              <Group justify="space-between">
                <Checkbox
                  label="Remember me"
                  {...form.getInputProps('rememberMe', { type: 'checkbox' })}
                  disabled={loading}
                />
                <Anchor component="button" type="button" c="dimmed" size="sm">
                  Forgot password?
                </Anchor>
              </Group>

              <Button
                type="submit"
                fullWidth
                leftSection={<IconLogin size={18} />}
                loading={loading}
              >
                Sign In
              </Button>
            </Stack>
          </form>

          {/* Test Credentials Info */}
          <Paper withBorder p="md" radius="sm" style={{ backgroundColor: '#f8f9fa' }}>
            <Text size="xs" c="dimmed" fw={600} mb={8}>
              Test Credentials:
            </Text>
            <Stack gap={4}>
              <Text size="xs" c="dimmed">
                <strong>Super Admin:</strong> super.admin / Admin@123
              </Text>
              <Text size="xs" c="dimmed">
                <strong>Security Admin:</strong> security.admin / Sec@123
              </Text>
              <Text size="xs" c="dimmed">
                <strong>Auditor:</strong> auditor / Audit@123
              </Text>
              <Text size="xs" c="dimmed">
                <strong>Integration Eng:</strong> integration.eng / Int@123
              </Text>
              <Text size="xs" c="dimmed">
                <strong>Business User:</strong> business.user / User@123
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </Container>
  );
};
