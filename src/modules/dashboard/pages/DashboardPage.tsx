/**
 * DashboardPage - Integration Dashboard
 *
 * Displays integration statistics, events, and monitoring data
 */

import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Title,
  Group,
  Container,
  Grid,
  Paper,
  Text,
  RingProgress,
  Tabs,
  Table,
  Select,
  Pagination,
  Badge,
  Stack,
  Anchor,
} from '@mantine/core';
import {
  IconSelector,
  IconChevronUp,
  IconChevronDown,
  IconBell,
  IconCircleCheck,
  IconX,
  IconBug,
  IconAlertCircle,
  IconClock,
} from '@tabler/icons-react';
import integrationData from '../../../data/integration-events.json';

type SortField = 'integrationSystem' | 'eventStatus' | 'systemUser' | 'workdayAction';
type SortDirection = 'asc' | 'desc' | null;

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const stats = integrationData.statistics;
  const allEvents = integrationData.events;

  // Filter by tab category
  const filteredByTab = useMemo(() => {
    if (activeTab === 'all') return allEvents;
    return allEvents.filter((event) => {
      if (activeTab === 'cloud-connect') return event.category === 'Cloud Connect';
      if (activeTab === 'benefits') return event.category === 'Benefits';
      if (activeTab === 'hcm') return event.category === 'HCM';
      if (activeTab === 'payroll') return event.category === 'Payroll';
      return true;
    });
  }, [activeTab, allEvents]);

  // Filter by status
  const filteredByStatus = useMemo(() => {
    if (statusFilter === 'all') return filteredByTab;
    return filteredByTab.filter((event) => event.eventStatus === statusFilter);
  }, [filteredByTab, statusFilter]);

  // Sort events
  const sortedEvents = useMemo(() => {
    if (!sortField || !sortDirection) return filteredByStatus;

    return [...filteredByStatus].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredByStatus, sortField, sortDirection]);

  // Pagination
  const itemsPerPage = parseInt(pageSize);
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = sortedEvents.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, statusFilter, sortField, sortDirection, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <IconSelector size={14} style={{ opacity: 0.5 }} />;
    if (sortDirection === 'asc') return <IconChevronUp size={14} />;
    return <IconChevronDown size={14} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'Completed with Errors':
        return 'yellow';
      case 'Completed with Warnings':
        return 'yellow';
      case 'Failed':
        return 'red';
      case 'Aborted':
        return 'orange';
      default:
        return 'gray';
    }
  };

  // const formatTime = (seconds: number) => {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const secs = seconds % 60;
  //   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  // };

  return (
    <Box p="lg">
      <Container fluid>
        {/* Header */}
        <Group justify="space-between" mb="md" wrap="nowrap">
          <Title
            order={2}
            size="h3"
            style={{
              color: '#212529',
              fontWeight: 600,
            }}
          >
            Integration Dashboard
          </Title>
          <Select
            placeholder="Select User"
            data={[
              { value: 'all', label: 'All' },
              { value: 'lmcneil', label: 'lmcneil@i8' },
              { value: 'admin', label: 'admin@i8cloud.com' },
            ]}
            defaultValue="all"
            style={{ width: 200 }}
          />
        </Group>

        {/* Blue Banner - To Improve Your Score */}
        <Paper
          p="lg"
          radius="md"
          mb="md"
          style={{
            background: 'linear-gradient(135deg, #1971c2 0%, #1864ab 100%)',
            border: 'none',
          }}
        >
          <Text size="sm" c="white" fw={500} mb="md" ta="center">
            To Improve Your Score - Review and Act
          </Text>
          <Grid gutter="md">
            <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap={4} align="center">
                <Group gap={6}>
                  <IconBell size={16} color="white" />
                  <Text size="xs" c="white" fw={500}>
                    Aborted
                  </Text>
                </Group>
                <Text size="2rem" fw={700} c="white">
                  {stats.aborted}
                </Text>
                <Badge
                  size="xs"
                  variant="filled"
                  style={{ backgroundColor: '#f76707', color: 'white' }}
                >
                  ABORTED EVENTS
                </Badge>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap={4} align="center">
                <Group gap={6}>
                  <IconCircleCheck size={16} color="white" />
                  <Text size="xs" c="white" fw={500}>
                    Completed
                  </Text>
                </Group>
                <Text size="2rem" fw={700} c="white">
                  {stats.completedCount}
                </Text>
                <Badge size="xs" variant="filled" color="green">
                  PASSED
                </Badge>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap={4} align="center">
                <Group gap={6}>
                  <IconX size={16} color="white" />
                  <Text size="xs" c="white" fw={500}>
                    Failed
                  </Text>
                </Group>
                <Text size="2rem" fw={700} c="white">
                  {stats.failed}
                </Text>
                <Badge size="xs" variant="filled" color="red">
                  FAILED EVENTS
                </Badge>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap={4} align="center">
                <Group gap={6}>
                  <IconBug size={16} color="white" />
                  <Text size="xs" c="white" fw={500}>
                    Number Of :
                  </Text>
                </Group>
                <Text size="2rem" fw={700} c="white">
                  {stats.numberOfErrors}
                </Text>
                <Badge size="xs" variant="filled" color="orange">
                  ERRORS
                </Badge>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap={4} align="center">
                <Group gap={6}>
                  <IconAlertCircle size={16} color="white" />
                  <Text size="xs" c="white" fw={500} ta="center">
                    Warnings
                  </Text>
                </Group>
                <Text size="2rem" fw={700} c="white">
                  {stats.warnings}
                </Text>
                <Badge size="xs" variant="filled" color="yellow">
                  WARNINGS
                </Badge>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap={4} align="center">
                <Group gap={6}>
                  <IconClock size={16} color="white" />
                  <Text size="xs" c="white" fw={500}>
                    Total Time
                  </Text>
                </Group>
                <Text size="2rem" fw={700} c="white">
                  {stats.totalTimeHours.toFixed(2)}K
                </Text>
                <Badge size="xs" variant="filled" color="blue">
                  SECONDS
                </Badge>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Success Score Section */}
        <Paper
          p="md"
          radius="md"
          mb="md"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Group gap="xl" wrap="nowrap" style={{ flex: 1 }}>
              {/* Success Score with Ring */}
              <Box>
                <Text size="sm" fw={600} c="#212529" mb="xs">
                  Success Score
                </Text>
                <Group gap="lg" align="center">
                  <RingProgress
                    size={100}
                    thickness={10}
                    sections={[
                      { value: stats.failedPercentage, color: '#fa5252' },
                      { value: stats.riskPercentage, color: '#ffd43b' },
                      { value: stats.passedPercentage, color: '#51cf66' },
                    ]}
                    label={
                      <Stack gap={0} align="center">
                        <Text ta="center" fw={700} size="lg" c="#212529">
                          {stats.completed}
                        </Text>
                      </Stack>
                    }
                  />
                  <Stack gap={4}>
                    <Text size="xs" c="#868e96">
                      26%
                    </Text>
                    <Text size="xs" c="#868e96">
                      11%
                    </Text>
                    <Text size="xs" c="#868e96">
                      64%
                    </Text>
                  </Stack>
                </Group>
              </Box>

              {/* Metrics */}
              <Group gap="xl" wrap="nowrap">
                <Stack gap={4} align="center">
                  <Text size="2xl" fw={700} c="#1971c2">
                    {stats.integrationCount}
                  </Text>
                  <Text size="xs" c="#868e96" fw={500}>
                    Integration
                  </Text>
                </Stack>

                <Stack gap={4} align="center">
                  <Text size="2xl" fw={700} c="#fa5252">
                    {stats.failed}
                  </Text>
                  <Text size="xs" c="#fa5252" fw={600}>
                    FAILED
                  </Text>
                </Stack>

                <Stack gap={4} align="center">
                  <Text size="2xl" fw={700} c="#51cf66">
                    {stats.passedCount}
                  </Text>
                  <Text size="xs" c="#51cf66" fw={600}>
                    PASSED
                  </Text>
                </Stack>

                <Stack gap={4} align="center">
                  <Text size="2xl" fw={700} c="#ffd43b">
                    {stats.acceptedRisk}
                  </Text>
                  <Text size="xs" c="#868e96" fw={500}>
                    ACCEPTED RISK
                  </Text>
                </Stack>

                <Stack gap={4} align="center">
                  <Text size="2xl" fw={700} c="#1971c2">
                    {(stats.totalTimeSeconds / 1000).toFixed(2)}K
                  </Text>
                  <Text size="xs" c="#868e96" fw={500}>
                    TOTAL IN SEC.
                  </Text>
                </Stack>

                <Stack gap={4} align="center">
                  <Text size="2xl" fw={700} c="#1971c2">
                    {stats.totalTimeHours.toFixed(2)}
                  </Text>
                  <Text size="xs" c="#868e96" fw={500}>
                    HOURS
                  </Text>
                </Stack>

                <Stack gap={4} align="center">
                  <Text size="2xl" fw={700} c="#1971c2">
                    {stats.totalTimeMinutes.toFixed(2)}
                  </Text>
                  <Text size="xs" c="#868e96" fw={500}>
                    MINUTES
                  </Text>
                </Stack>

                <Stack gap={4} align="center">
                  <Text size="2xl" fw={700} c="#1971c2">
                    {(stats.totalTimeSeconds / 1000).toFixed(2)}K
                  </Text>
                  <Text size="xs" c="#868e96" fw={500}>
                    SECONDS
                  </Text>
                </Stack>
              </Group>
            </Group>
          </Group>
        </Paper>

        {/* Tabs and Table */}
        <Paper
          radius="md"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          }}
        >
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'all')}>
            <Tabs.List style={{ borderBottom: '1px solid #dee2e6', padding: '0 1rem' }}>
              <Tabs.Tab value="all">Integration</Tabs.Tab>
              <Tabs.Tab value="cloud-connect">Cloud Connect for Benefits</Tabs.Tab>
              <Tabs.Tab value="benefits">Cloud Connect for HCM</Tabs.Tab>
              <Tabs.Tab value="hcm">Cloud Connect for Payroll</Tabs.Tab>
            </Tabs.List>

            <Box p="md">
              <Grid gutter="md">
                {/* Table Section - Left */}
                <Grid.Col span={{ base: 12, lg: 9 }}>
                  {/* Filters */}
                  <Group justify="space-between" mb="lg">
                    <Select
                      label="Event Status"
                      value={statusFilter}
                      onChange={(value) => setStatusFilter(value || 'all')}
                      data={[
                        { value: 'all', label: 'All' },
                        { value: 'Completed', label: 'Completed' },
                        { value: 'Completed with Errors', label: 'Completed with Errors' },
                        { value: 'Completed with Warnings', label: 'Completed with Warnings' },
                        { value: 'Failed', label: 'Failed' },
                        { value: 'Aborted', label: 'Aborted' },
                      ]}
                      style={{ width: 250 }}
                    />
                    <Select
                      label="Items per page"
                      value={pageSize}
                      onChange={(value) => setPageSize(value || '10')}
                      data={[
                        { value: '10', label: '10' },
                        { value: '25', label: '25' },
                        { value: '50', label: '50' },
                        { value: '100', label: '100' },
                      ]}
                      style={{ width: 120 }}
                    />
                  </Group>

                  {/* Table */}
              <Box
                style={{
                  border: '1px solid #dee2e6',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <Table
                  striped
                  highlightOnHover
                  verticalSpacing="sm"
                  styles={{
                    th: {
                      backgroundColor: '#1971c2',
                      color: '#ffffff',
                      fontWeight: 600,
                      padding: '16px',
                    },
                    td: {
                      padding: '12px 16px',
                    },
                  }}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('integrationSystem')}
                      >
                        <Group gap={4} wrap="nowrap">
                          <span>Integration System</span>
                          {getSortIcon('integrationSystem')}
                        </Group>
                      </Table.Th>
                      <Table.Th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('eventStatus')}
                      >
                        <Group gap={4} wrap="nowrap">
                          <span>Event Status</span>
                          {getSortIcon('eventStatus')}
                        </Group>
                      </Table.Th>
                      <Table.Th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('systemUser')}
                      >
                        <Group gap={4} wrap="nowrap">
                          <span>System User</span>
                          {getSortIcon('systemUser')}
                        </Group>
                      </Table.Th>
                      <Table.Th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('workdayAction')}
                      >
                        <Group gap={4} wrap="nowrap">
                          <span>Workday Action</span>
                          {getSortIcon('workdayAction')}
                        </Group>
                      </Table.Th>
                      <Table.Th style={{ textAlign: 'center' }}>Help Center</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedEvents.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                          <Text c="#868e96">
                            {sortedEvents.length === 0 ? 'No events found' : 'No items on this page'}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      paginatedEvents.map((event) => (
                        <Table.Tr key={event.uuid}>
                          <Table.Td>
                            <Text size="sm" fw={500} c="#212529">
                              {event.integrationSystem}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              variant="light"
                              color={getStatusColor(event.eventStatus)}
                              style={{
                                textTransform: 'none',
                              }}
                            >
                              {event.eventStatus}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" c="#495057">
                              {event.systemUser}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" c="#495057">
                              {event.workdayAction}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Group justify="center">
                              <Anchor
                                size="sm"
                                c="blue"
                                underline="always"
                                style={{ cursor: 'pointer' }}
                              >
                                View
                              </Anchor>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    )}
                  </Table.Tbody>
                  <Table.Tfoot>
                    <Table.Tr>
                      <Table.Td
                        colSpan={5}
                        style={{ padding: '16px', backgroundColor: '#f8f9fa' }}
                      >
                        <Group justify="space-between" align="center">
                          <Text size="sm" c="#495057" fw={500}>
                            Showing {paginatedEvents.length > 0 ? startIndex + 1 : 0}-
                            {Math.min(endIndex, sortedEvents.length)} of {sortedEvents.length}{' '}
                            events
                            {(statusFilter !== 'all' || activeTab !== 'all') && (
                              <Text component="span" c="#868e96" ml={4}>
                                (filtered from {allEvents.length} total)
                              </Text>
                            )}
                          </Text>

                          {totalPages > 1 && (
                            <Pagination
                              value={currentPage}
                              onChange={setCurrentPage}
                              total={totalPages}
                              size="sm"
                              withEdges
                            />
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tfoot>
                </Table>
              </Box>
                </Grid.Col>

                {/* Right Sidebar - USER Section */}
                <Grid.Col span={{ base: 12, lg: 3 }}>
                  <Paper
                    p="md"
                    withBorder
                    style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: 8,
                      minHeight: 200,
                    }}
                  >
                    <Stack gap="md">
                      <Box>
                        <Text size="sm" fw={600} c="#212529" mb="xs">
                          USER
                        </Text>
                        <Text size="sm" c="#868e96" ta="center" mt="xl">
                          No Selection
                        </Text>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Box>
          </Tabs>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardPage;
