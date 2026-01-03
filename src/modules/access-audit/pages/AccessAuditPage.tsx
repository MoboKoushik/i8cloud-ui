/**
 * AccessAuditPage - Signon and Account Monitoring
 *
 * Displays signon details, workday accounts, and user authentication data
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Title,
  Container,
  Grid,
  Paper,
  Text,
  Group,
  Stack,
  RingProgress,
  Badge,
  Select,
  Button,
} from '@mantine/core';
import {
  IconUsers,
  IconShieldCheck,
  IconAlertCircle,
  IconClock,
  IconLock,
  IconUserCheck,
  IconChartPie,
} from '@tabler/icons-react';
import accessAuditData from '../../../data/access-audit.json';

const AccessAuditPage = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string>('subham sankar lenka');
  const [selectedAuthType, setSelectedAuthType] = useState<string>('Trusted');
  const [selectedProxyFilter, setSelectedProxyFilter] = useState<string>('All');

  const {
    signonDetails,
    workdayAccounts,
    unidentifiedUsers,
    authenticationTypes,
    proxyHistory,
  } = accessAuditData;

  const totalPie = workdayAccounts.pieChart.value1 + workdayAccounts.pieChart.value2 + workdayAccounts.pieChart.value3;
  const pieValue1Percent = (workdayAccounts.pieChart.value1 / totalPie) * 100;
  const pieValue2Percent = (workdayAccounts.pieChart.value2 / totalPie) * 100;
  const pieValue3Percent = (workdayAccounts.pieChart.value3 / totalPie) * 100;

  return (
    <Box p="lg">
      <Container fluid>
        {/* Page Title */}
        <Title
          order={2}
          size="h3"
          mb="xl"
          style={{
            color: '#212529',
            fontWeight: 600,
            textAlign: 'left',
          }}
        >
          Signon Details
        </Title>

        {/* Signon Details Section */}
        <Grid mb="xl" gutter="md">
          {/* Total System Accounts - Circle */}
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #1971c2',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                height: '100%',
              }}
            >
              <Stack gap="xs" align="center">
                <IconUsers size={32} color="#1971c2" />
                <Text size="3rem" fw={700} c="#1971c2" ta="center">
                  {signonDetails.totalSystemAccounts}
                </Text>
                <Text size="xs" c="#868e96" fw={500} tt="uppercase" ta="center">
                  Total System
                </Text>
                <Text size="xs" c="#868e96" fw={500} tt="uppercase" ta="center">
                  Accounts
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Signon Metrics - White Box */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              p="lg"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dee2e6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                height: '100%',
              }}
            >
              <Grid gutter="md">
                <Grid.Col span={4}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      Total Signons
                    </Text>
                    <Text size="2.5rem" fw={700} c="#1971c2">
                      {signonDetails.totalSignons}
                    </Text>
                    <Badge size="sm" variant="filled" color="yellow">
                      SIGNONS
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={4}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      Failed Signons
                    </Text>
                    <Text size="2.5rem" fw={700} c="#fa5252">
                      {signonDetails.failedSignons}
                    </Text>
                    <Badge size="sm" variant="filled" color="red">
                      FAILED
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={4}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      Successful Signons
                    </Text>
                    <Text size="2.5rem" fw={700} c="#51cf66">
                      {signonDetails.successfulSignons}
                    </Text>
                    <Badge size="sm" variant="filled" color="green">
                      SUCCESSFUL
                    </Badge>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>
          </Grid.Col>

          {/* By Authentication Type - Blue Box */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              p="lg"
              radius="md"
              style={{
                background: 'linear-gradient(135deg, #1971c2 0%, #1864ab 100%)',
                border: 'none',
                height: '100%',
              }}
            >
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="white" fw={600} tt="uppercase">
                  By Authentication Type
                </Text>
                <Button
                  size="xs"
                  variant="filled"
                  color="dark"
                  onClick={() => navigate('/app/signon-details')}
                >
                  Explor
                </Button>
              </Group>
              <Grid gutter="xs">
                <Grid.Col span={4}>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="white" fw={500}>
                      SSO Login
                    </Text>
                    <Text size="xl" fw={700} c="white">
                      {signonDetails.byAuthenticationType.ssoLogin}
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="white" fw={500}>
                      Basic Auth
                    </Text>
                    <Text size="xl" fw={700} c="white">
                      {signonDetails.byAuthenticationType.basicAuth}
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="white" fw={500}>
                      OAuth 2.0
                    </Text>
                    <Text size="xl" fw={700} c="white">
                      {signonDetails.byAuthenticationType.oauth2}
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="white" fw={500}>
                      Trusted
                    </Text>
                    <Text size="xl" fw={700} c="white">
                      {signonDetails.byAuthenticationType.trusted}
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="white" fw={500}>
                      MFA
                    </Text>
                    <Text size="xl" fw={700} c="white">
                      {signonDetails.byAuthenticationType.mfa}
                    </Text>
                    <Badge size="xs" variant="filled" color="dark">
                      0
                    </Badge>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="white" fw={500}>
                      Device Trusted
                    </Text>
                    <Text size="xl" fw={700} c="white">
                      {signonDetails.byAuthenticationType.deviceTrusted}
                    </Text>
                    <Badge size="xs" variant="filled" color="dark">
                      0
                    </Badge>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Workday Accounts Section */}
        <Title
          order={3}
          size="h4"
          mb="md"
          style={{
            color: '#212529',
            fontWeight: 600,
            textAlign: 'left',
          }}
        >
          Workday Accounts
        </Title>

        <Paper
          p="lg"
          radius="md"
          mb="xl"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Grid gutter="xl">
            {/* Total Accounts with Pie Chart */}
            <Grid.Col span={{ base: 12, md: 2 }}>
              <Stack gap="xs" align="center">
                <Group gap="xs">
                  <IconUserCheck size={18} />
                  <Text size="xs" fw={600}>
                    Total Accounts
                  </Text>
                </Group>
                <RingProgress
                  size={100}
                  thickness={10}
                  sections={[
                    { value: pieValue1Percent, color: '#ffd43b' },
                    { value: pieValue2Percent, color: '#228be6' },
                    { value: pieValue3Percent, color: '#fa5252' },
                  ]}
                  label={
                    <Stack gap={0} align="center">
                      <Text ta="center" fw={700} size="xl" c="#212529">
                        {workdayAccounts.totalAccounts}
                      </Text>
                    </Stack>
                  }
                />
                <Group gap={4}>
                  <Text size="xs" c="#ffd43b">{workdayAccounts.pieChart.value1}</Text>
                  <Text size="xs" c="#228be6">{workdayAccounts.pieChart.value2}</Text>
                  <Text size="xs" c="#fa5252">{workdayAccounts.pieChart.value3}</Text>
                </Group>
              </Stack>
            </Grid.Col>

            {/* Account Metrics */}
            <Grid.Col span={{ base: 12, md: 10 }}>
              <Grid gutter="md">
                <Grid.Col span={{ base: 6, md: 2 }}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      Accounts Locked
                    </Text>
                    <Text size="2.5rem" fw={700} c="#ffd43b">
                      {workdayAccounts.accountsLocked}
                    </Text>
                    <Badge size="sm" variant="filled" color="yellow">
                      WARNING
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 2 }}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      Password Expired
                    </Text>
                    <Text size="2.5rem" fw={700} c="#228be6">
                      {workdayAccounts.passwordExpired}
                    </Text>
                    <Badge size="sm" variant="filled" color="blue">
                      Alert
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 2 }}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase" ta="center">
                      Accounts Expiring Soon
                    </Text>
                    <Text size="2.5rem" fw={700} c="#fa5252">
                      {workdayAccounts.accountsExpiringSoon}
                    </Text>
                    <Badge size="sm" variant="filled" color="red">
                      Action To Be Taken
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 2 }}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase" ta="center">
                      Inactive For 30+ Days
                    </Text>
                    <Text size="2.5rem" fw={700} c="#51cf66">
                      {workdayAccounts.inactiveFor30Days}
                    </Text>
                    <Badge size="sm" variant="filled" color="green">
                      ACCOUNTS
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 2 }}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      Implementers
                    </Text>
                    <Text size="2.5rem" fw={700} c="#1971c2">
                      {workdayAccounts.implementers}
                    </Text>
                    <Badge size="sm" variant="filled" color="blue">
                      ACCOUNTS
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 2 }}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      Integration
                    </Text>
                    <Text size="2.5rem" fw={700} c="#1971c2">
                      {workdayAccounts.integration}
                    </Text>
                    <Badge size="sm" variant="filled" color="green">
                      ACCOUNTS
                    </Badge>
                    <Button
                      size="xs"
                      variant="filled"
                      color="dark"
                      onClick={() => navigate('/app/workday-account-details')}
                    >
                      Explor
                    </Button>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Bottom Section - Three Columns */}
        <Grid gutter="md">
          {/* Unidentified Users */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #1971c2',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                minHeight: 400,
              }}
            >
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <Box
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      border: '3px solid #1971c2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text size="xl" fw={700} c="#1971c2">
                      {unidentifiedUsers.length}
                    </Text>
                  </Box>
                  <Text size="sm" fw={600} c="#212529" tt="uppercase">
                    Unidentified Users
                  </Text>
                </Group>
              </Group>

              <Select
                placeholder="Select user"
                data={unidentifiedUsers.map((u) => ({ value: u.name, label: u.name }))}
                value={selectedUser}
                onChange={(value) => setSelectedUser(value || '')}
                mb="md"
                styles={{
                  input: {
                    backgroundColor: '#1971c2',
                    color: 'white',
                    borderColor: '#1971c2',
                  },
                }}
              />

              <Paper p="md" withBorder>
                <Stack gap="sm">
                  <Box>
                    <Text size="xs" c="#868e96" fw={600} mb={4}>
                      AUTHENTICATION TYPE
                    </Text>
                    <Text size="sm" c="#212529" ta="center">
                      (Blank)
                    </Text>
                  </Box>

                  <Box mt="md">
                    <Text size="xs" c="#868e96" fw={600} mb={4}>
                      TIME OF LOGIN
                    </Text>
                    <Text size="sm" c="#212529" ta="center">
                      No Selection
                    </Text>
                  </Box>
                </Stack>
              </Paper>
            </Paper>
          </Grid.Col>

          {/* Authentication Types */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #51cf66',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                minHeight: 400,
              }}
            >
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <Box
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      border: '3px solid #51cf66',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text size="xl" fw={700} c="#51cf66">
                      143
                    </Text>
                  </Box>
                  <Text size="sm" fw={600} c="#212529" tt="uppercase">
                    Authentication Types
                  </Text>
                </Group>
              </Group>

              <Select
                placeholder="Select auth type"
                data={authenticationTypes.map((t) => ({ value: t, label: t }))}
                value={selectedAuthType}
                onChange={(value) => setSelectedAuthType(value || '')}
                mb="md"
                styles={{
                  input: {
                    backgroundColor: '#1971c2',
                    color: 'white',
                    borderColor: '#1971c2',
                  },
                }}
              />

              <Paper p="md" withBorder style={{ maxHeight: 250, overflowY: 'auto' }}>
                <Stack gap="xs">
                  <Text size="xs" c="#868e96" fw={600} mb={4}>
                    USERS
                  </Text>
                  {unidentifiedUsers.map((user) => (
                    <Text key={user.uuid} size="sm" c="#212529">
                      {user.name}
                    </Text>
                  ))}
                </Stack>
              </Paper>
            </Paper>
          </Grid.Col>

          {/* Proxy History */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #228be6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                minHeight: 400,
              }}
            >
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <Box
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      border: '3px solid #228be6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text size="xl" fw={700} c="#228be6">
                      {proxyHistory.count}
                    </Text>
                  </Box>
                  <Text size="sm" fw={600} c="#212529" tt="uppercase">
                    Proxy History
                  </Text>
                </Group>
              </Group>

              <Select
                placeholder="Select filter"
                data={[
                  { value: 'All', label: 'All' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
                value={selectedProxyFilter}
                onChange={(value) => setSelectedProxyFilter(value || '')}
                mb="md"
                styles={{
                  input: {
                    backgroundColor: '#1971c2',
                    color: 'white',
                    borderColor: '#1971c2',
                  },
                }}
              />

              <Paper p="md" withBorder>
                <Stack gap="sm">
                  <Box>
                    <Text size="sm" c="#868e96" ta="center">
                      On The Behalf Of
                    </Text>
                    <Text size="sm" c="#212529" ta="center" mt="md">
                      Not Selected
                    </Text>
                  </Box>

                  <Box mt="xl">
                    <Text size="sm" c="#212529" ta="center">
                      Not Selected
                    </Text>
                  </Box>

                  <Box mt="xl">
                    <Text size="xs" c="#868e96" fw={600} mb={4}>
                      SIGN-ON
                    </Text>
                    <Text size="sm" c="#212529" ta="center">
                      No Selection
                    </Text>
                  </Box>
                </Stack>
              </Paper>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default AccessAuditPage;
