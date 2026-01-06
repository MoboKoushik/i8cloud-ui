/**
 * SecurityPage - Security Group Summary Dashboard
 *
 * Displays security group statistics, policy changes, and assignment changes
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
  Badge,
  Select,
  Button,
} from '@mantine/core';
import {
  IconUsers,
  IconShield,
  IconLink,
  IconTableColumn,
  IconRefresh,
  IconFileText,
  IconShieldCheck,
} from '@tabler/icons-react';
import securityData from '../../../data/security-group-summary.json';

const SecurityPage = () => {
  const navigate = useNavigate();
  const [selectedSecurityGroupType, setSelectedSecurityGroupType] = useState<string>('All');
  const [selectedCompletedBy, setSelectedCompletedBy] = useState<string>('All');

  const { summary, securityPoliciesChanged, segregationOfDuties } = securityData;

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
          Security Group Summary
        </Title>

        {/* Top Summary Cards */}
        <Grid mb="xl" gutter="md">
          {/* Total Security Group */}
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dee2e6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                height: '100%',
              }}
            >
              <Stack gap="xs" align="center">
                <IconUsers size={24} color="#212529" />
                <Text size="3rem" fw={700} c="#212529" ta="center">
                  {summary.totalSecurityGroup}
                </Text>
                <Text size="xs" c="#1971c2" fw={600} tt="uppercase" ta="center">
                  TOTAL SECURITY GROUP
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* User Based */}
          <Grid.Col span={{ base: 6, md: 2 }}>
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
                <IconUsers size={24} color="#1971c2" />
                <Text size="xs" c="#1971c2" fw={600} tt="uppercase" ta="center">
                  USER BASED
                </Text>
                <Text size="2.5rem" fw={700} c="#212529" ta="center">
                  {summary.userBased}
                </Text>
                <Badge size="sm" variant="filled" color="yellow">
                  GROUP
                </Badge>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Role Based */}
          <Grid.Col span={{ base: 6, md: 2 }}>
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
                <IconShield size={24} color="#1971c2" />
                <Text size="xs" c="#1971c2" fw={600} tt="uppercase" ta="center">
                  ROLE BASED
                </Text>
                <Text size="2.5rem" fw={700} c="#212529" ta="center">
                  {summary.roleBased}
                </Text>
                <Badge size="sm" variant="filled" color="yellow">
                  GROUP
                </Badge>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Aggregation */}
          <Grid.Col span={{ base: 6, md: 2 }}>
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
                <IconLink size={24} color="#1971c2" />
                <Text size="xs" c="#1971c2" fw={600} tt="uppercase" ta="center">
                  AGGREGATION
                </Text>
                <Text size="2.5rem" fw={700} c="#212529" ta="center">
                  {summary.aggregation}
                </Text>
                <Badge size="sm" variant="filled" color="yellow">
                  GROUP
                </Badge>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Intersection */}
          <Grid.Col span={{ base: 6, md: 2 }}>
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
                <IconTableColumn size={24} color="#1971c2" />
                <Text size="xs" c="#1971c2" fw={600} tt="uppercase" ta="center">
                  INTERSECTION
                </Text>
                <Text size="2.5rem" fw={700} c="#212529" ta="center">
                  {summary.intersection}
                </Text>
                <Badge size="sm" variant="filled" color="yellow">
                  GROUP
                </Badge>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Integration System */}
          <Grid.Col span={{ base: 6, md: 2 }}>
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
                <IconRefresh size={24} color="#1971c2" />
                <Text size="xs" c="#1971c2" fw={600} tt="uppercase" ta="center">
                  INTEGRATION SYSTEM
                </Text>
                <Text size="2.5rem" fw={700} c="#212529" ta="center">
                  {summary.integrationSystem}
                </Text>
                <Badge size="sm" variant="filled" color="yellow">
                  GROUP
                </Badge>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Explor Button */}
        <Group justify="center" mb="xl">
          <Button
            size="sm"
            variant="filled"
            color="dark"
            onClick={() => navigate('/app/security-group-details')}
          >
            Explor
          </Button>
        </Group>

        {/* Middle Section - 3 Cards */}
        <Grid mb="xl" gutter="md">
          {/* Security Policies Changed */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              p="lg"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #1971c2',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                minHeight: 200,
              }}
            >
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <IconFileText size={24} color="#1971c2" />
                  <Text size="sm" fw={600} c="#212529" tt="uppercase">
                    SECURITY POLICIES CHANGED
                  </Text>
                </Group>
              </Group>

              <Grid gutter="md">
                <Grid.Col span={4}>
                  <Stack gap={4} align="center">
                    <IconUsers size={20} />
                    <Text size="2.5rem" fw={700} c="#212529">
                      {securityPoliciesChanged.total}
                    </Text>
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      TOTAL
                    </Text>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={4}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      BUSINESS SECURITY
                    </Text>
                    <Text size="2rem" fw={700} c="#212529">
                      {securityPoliciesChanged.businessSecurity}
                    </Text>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={4}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase">
                      DOMAIN SECURITY
                    </Text>
                    <Text size="2rem" fw={700} c="#212529">
                      {securityPoliciesChanged.domainSecurity}
                    </Text>
                  </Stack>
                </Grid.Col>
              </Grid>

              <Group justify="center" mt="md">
                <Button
                  size="xs"
                  variant="filled"
                  color="dark"
                  onClick={() => navigate('/app/business-process-security-policies')}
                >
                  Explor
                </Button>
              </Group>
            </Paper>
          </Grid.Col>

          {/* Segregation of Duties */}
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Paper
              p="lg"
              radius="md"
              style={{
                background: 'linear-gradient(135deg, #1971c2 0%, #1864ab 100%)',
                border: 'none',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Stack gap="xs" align="center">
                <IconShieldCheck size={32} color="white" />
                <Text size="xs" c="white" fw={600} tt="uppercase" ta="center">
                  SEGREGATION OF DUTIES
                </Text>
                <Text size="xs" c="white" fw={600} tt="uppercase" ta="center">
                  TOTAL EXCEPTIONS
                </Text>
                <Text size="3rem" fw={700} c="white" ta="center">
                  {segregationOfDuties.totalExceptions}
                </Text>
                <Button
                  size="xs"
                  variant="filled"
                  color="dark"
                  onClick={() => navigate('/app/segregation-of-duties')}
                >
                  Explor
                </Button>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Security Group Assignment Changes */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              p="lg"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #1971c2',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                minHeight: 200,
              }}
            >
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <IconShield size={24} color="#1971c2" />
                  <Text size="sm" fw={600} c="#212529" tt="uppercase">
                    SECURITY GROUP ASSIGNMENT CHANGES
                  </Text>
                </Group>
              </Group>

              <Grid gutter="md">
                <Grid.Col span={6}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase" ta="center">
                      ROLE BASED GROUPS
                    </Text>
                    <Text size="2.5rem" fw={700} c="#212529">
                      {/* {securityGroupAssignmentChanges?.roleBasedGroups} */}
                    </Text>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Stack gap={4} align="center">
                    <Text size="xs" c="#868e96" fw={600} tt="uppercase" ta="center">
                      USER BASED GROUPS
                    </Text>
                    <Text size="2.5rem" fw={700} c="#212529">
                      {/* {securityGroupAssignmentChanges.userBasedGroups} */}
                    </Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Bottom Section - Two Columns */}
        <Grid gutter="md">
          {/* Security Group Created */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dee2e6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                minHeight: 300,
              }}
            >
              <Text size="sm" fw={600} c="#212529" mb="md">
                Security Group Created
              </Text>

              <Select
                placeholder="All"
                data={['All', 'User Based', 'Role Based', 'Aggregation']}
                value={selectedSecurityGroupType}
                onChange={(value) => setSelectedSecurityGroupType(value || 'All')}
                mb="md"
              />

              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="xs" fw={600} c="#868e96">
                    SECURITY GROUP TYPE
                  </Text>
                </Group>
                <Text size="sm" c="#212529">
                  No Selection
                </Text>

                <Group justify="space-between" mt="md">
                  <Text size="xs" fw={600} c="#868e96">
                    MEMBERS
                  </Text>
                </Group>
                <Text size="sm" c="#212529">
                  No Selection
                </Text>

                <Group justify="space-between" mt="md">
                  <Text size="xs" fw={600} c="#868e96">
                    CREATED MOMENT
                  </Text>
                </Group>
                <Text size="sm" c="#212529">
                  No Selection
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Security Group Assignment Changes (User Based) */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dee2e6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                minHeight: 300,
              }}
            >
              <Text size="sm" fw={600} c="#212529" mb="md">
                Security Group Assignment Changes (User Based)
              </Text>

              <Select
                placeholder="All"
                data={['All', 'Admin', 'HR Manager', 'Finance Lead']}
                value={selectedCompletedBy}
                onChange={(value) => setSelectedCompletedBy(value || 'All')}
                mb="md"
              />

              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="xs" fw={600} c="#868e96">
                    COMPLETED BY
                  </Text>
                </Group>
                <Text size="sm" c="#212529">
                  No Selection
                </Text>

                <Group justify="space-between" mt="md">
                  <Text size="xs" fw={600} c="#868e96">
                    SECURITY HISTORY
                  </Text>
                </Group>
                <Text size="sm" c="#212529">
                  No Selection
                </Text>

                <Group justify="space-between" mt="md">
                  <Text size="xs" fw={600} c="#868e96">
                    FOR WHOM
                  </Text>
                </Group>
                <Text size="sm" c="#212529">
                  No Selection
                </Text>

                <Group justify="space-between" mt="md">
                  <Text size="xs" fw={600} c="#868e96">
                    EFFECTIVE DATE
                  </Text>
                </Group>
                <Text size="sm" c="#212529">
                  No Selection
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default SecurityPage;
