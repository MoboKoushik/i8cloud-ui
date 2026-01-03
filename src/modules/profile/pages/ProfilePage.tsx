/**
 * Profile Page
 *
 * User profile information and settings
 */

import {
  Box,
  Container,
  Title,
  Paper,
  Avatar,
  Text,
  Group,
  Stack,
  Badge,
  Divider,
  SimpleGrid,
  Button,
} from '@mantine/core';
import {
  IconUser,
  IconMail,
  IconShield,
  IconCalendar,
  IconEdit,
} from '@tabler/icons-react';
import { useAuth } from '../../../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Box p="lg">
      <Container fluid>
        {/* Header */}
        <Group justify="space-between" mb="xl">
          <Title
            order={2}
            size="h3"
            style={{
              color: '#212529',
              fontWeight: 600,
            }}
          >
            My Profile
          </Title>
          <Button
            leftSection={<IconEdit size={18} />}
            variant="light"
          >
            Edit Profile
          </Button>
        </Group>

        {/* Profile Card */}
        <Paper
          p="xl"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            border: '1px solid #dee2e6',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Stack gap="xl">
            {/* Avatar and Basic Info */}
            <Group>
              <Avatar
                size={100}
                radius="xl"
                style={{
                  backgroundColor: '#228be6',
                  color: '#ffffff',
                  fontSize: 36,
                  fontWeight: 600,
                }}
              >
                {getUserInitials()}
              </Avatar>
              <Stack gap="xs">
                <Title order={3} style={{ color: '#212529' }}>
                  {user.name}
                </Title>
                <Text size="sm" c="#868e96">
                  {user.email}
                </Text>
                <Group gap="xs">
                  <Badge
                    variant="light"
                    color="blue"
                    leftSection={<IconShield size={14} />}
                    style={{
                      backgroundColor: '#e7f5ff',
                      color: '#1971c2',
                    }}
                  >
                    {user.role.name}
                  </Badge>
                  {user.role.is_admin === 1 && (
                    <Badge
                      variant="filled"
                      color="red"
                      style={{
                        backgroundColor: '#fa5252',
                      }}
                    >
                      Administrator
                    </Badge>
                  )}
                </Group>
              </Stack>
            </Group>

            <Divider />

            {/* User Details */}
            <Box>
              <Title order={4} mb="md" style={{ color: '#495057' }}>
                Account Information
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <Stack gap="xs">
                  <Group gap="xs">
                    <IconUser size={18} color="#495057" />
                    <Text size="sm" fw={500} c="#495057">
                      User ID
                    </Text>
                  </Group>
                  <Text size="sm" c="#868e96" pl={26}>
                    {user.uuid}
                  </Text>
                </Stack>

                <Stack gap="xs">
                  <Group gap="xs">
                    <IconMail size={18} color="#495057" />
                    <Text size="sm" fw={500} c="#495057">
                      Email Address
                    </Text>
                  </Group>
                  <Text size="sm" c="#868e96" pl={26}>
                    {user.email}
                  </Text>
                </Stack>

                <Stack gap="xs">
                  <Group gap="xs">
                    <IconShield size={18} color="#495057" />
                    <Text size="sm" fw={500} c="#495057">
                      Role
                    </Text>
                  </Group>
                  <Text size="sm" c="#868e96" pl={26}>
                    {user.role.name}
                  </Text>
                </Stack>

                <Stack gap="xs">
                  <Group gap="xs">
                    <IconCalendar size={18} color="#495057" />
                    <Text size="sm" fw={500} c="#495057">
                      Access Type
                    </Text>
                  </Group>
                  <Text size="sm" c="#868e96" pl={26}>
                    {user.type}
                  </Text>
                </Stack>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Permissions */}
            <Box>
              <Title order={4} mb="md" style={{ color: '#495057' }}>
                Permissions ({user.role.permissions.length})
              </Title>
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="xs">
                {user.role.permissions.map((perm, index) => (
                  <Badge
                    key={index}
                    variant="dot"
                    color="blue"
                    size="md"
                    style={{
                      backgroundColor: '#f1f3f5',
                      color: '#495057',
                    }}
                  >
                    {perm.subject}: {perm.action}
                  </Badge>
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;
