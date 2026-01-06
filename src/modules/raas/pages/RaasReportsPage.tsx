import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Title,
  Group,
  Paper,
  Stack,
  Table,
  Badge,
  Select,
  Text,
  Card,
  Grid,
  Pagination,
  Center,
} from '@mantine/core';
import {
  IconReportAnalytics,
  IconUsers,
  IconShieldCheck,
  IconFileText,
  IconCalendar,
  IconCircleCheck,
  IconCircleX,
  IconChevronUp,
  IconChevronDown,
  IconSelector,
} from '@tabler/icons-react';
import raasReportsData from '@/data/raas-reports.json';

type SortField = 'customReport' | 'reportOwner' | 'exemptFromExpiration';
type SortDirection = 'asc' | 'desc' | null;

const RaasReportsPage = () => {
  const [selectedCustomReport, setSelectedCustomReport] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('TOTAL');
  const [reports] = useState(raasReportsData.reports);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const customReportOptions = useMemo(() => {
    const uniqueReports = [...new Set(reports.map(r => r.customReport))].sort();
    return uniqueReports.map(report => ({ value: report, label: report }));
  }, [reports]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const filteredReports = useMemo(() => {
    let filtered = reports;
    if (selectedFilter === 'ISU') {
      filtered = filtered.filter(r => r.type === 'ISU');
    } else if (selectedFilter === 'NON-ISU') {
      filtered = filtered.filter(r => r.type === 'NON-ISU');
    } else if (selectedFilter === 'TEMP') {
      filtered = filtered.filter(r => r.isTemporary);
    }
    return filtered;
  }, [reports, selectedFilter]);

  const sortedReports = useMemo(() => {
    if (!sortField || !sortDirection) return filteredReports;

    return [...filteredReports].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredReports, sortField, sortDirection]);

  // Pagination calculations
  const itemsPerPage = parseInt(pageSize);
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = sortedReports.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  const summary = useMemo(() => {
    return {
      totalReports: reports.length,
      reportsWithISU: reports.filter(r => r.type === 'ISU').length,
      nonISUReports: reports.filter(r => r.type === 'NON-ISU').length,
      temporaryReports: reports.filter(r => r.isTemporary).length,
    };
  }, [reports]);

  const selectedReportDetails = useMemo(() => {
    if (!selectedCustomReport) return null;
    return reports.find(r => r.customReport === selectedCustomReport);
  }, [selectedCustomReport, reports]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <IconSelector size={14} style={{ opacity: 0.5 }} />;
    }
    if (sortDirection === 'asc') {
      return <IconChevronUp size={14} />;
    }
    return <IconChevronDown size={14} />;
  };

  return (
    <Box p="md">
      <Container fluid>
        {/* Header & Dropdown */}
        <Group justify="space-between" align="flex-end" mb="sm">
          <Title order={2} style={{ color: '#212529', fontSize: '1.25rem' }}>
            Publicly Exposed Reports
          </Title>
          <Box style={{ width: '350px' }}>
            <Select
              label="Custom_Report"
              placeholder="Select a custom report"
              data={customReportOptions}
              value={selectedCustomReport}
              onChange={(value) => setSelectedCustomReport(value || '')}
              searchable
              clearable
              size="xs"
            />
          </Box>
        </Group>

        {/* Summary Cards + Authorized Cards in one row */}
        <Grid mb="sm" gutter="xs">
          <Grid.Col span={{ base: 6, xs: 3, sm: 2.4 }}>
            <Card
              padding="sm"
              radius="md"
              style={{
                backgroundColor: '#1971c2',
                cursor: 'pointer',
                height: '100%',
              }}
              onClick={() => setSelectedFilter('TOTAL')}
            >
              <Stack gap={2} align="center">
                <IconReportAnalytics size={20} color="#ffffff" />
                <Text size="10px" c="#ffffff" fw={600} tt="uppercase" ta="center" lh={1.2}>
                  Total Reports
                </Text>
                <Title order={2} c="#ffffff" style={{ fontSize: '1.75rem', margin: '2px 0' }}>
                  {summary.totalReports}
                </Title>
                <Badge color="gray" variant="filled" size="xs" style={{ fontSize: '9px' }}>
                  TOTAL
                </Badge>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 6, xs: 3, sm: 2.4 }}>
            <Card
              padding="sm"
              radius="md"
              style={{
                backgroundColor: '#1971c2',
                cursor: 'pointer',
                height: '100%',
              }}
              onClick={() => setSelectedFilter('ISU')}
            >
              <Stack gap={2} align="center">
                <IconUsers size={20} color="#ffffff" />
                <Text size="10px" c="#ffffff" fw={600} tt="uppercase" ta="center" lh={1.2}>
                  Reports with ISU
                </Text>
                <Title order={2} c="#ffffff" style={{ fontSize: '1.75rem', margin: '2px 0' }}>
                  {summary.reportsWithISU}
                </Title>
                <Badge color="cyan" variant="filled" size="xs" style={{ fontSize: '9px' }}>
                  ISU
                </Badge>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 6, xs: 3, sm: 2.4 }}>
            <Card
              padding="sm"
              radius="md"
              style={{
                backgroundColor: '#1971c2',
                cursor: 'pointer',
                height: '100%',
              }}
              onClick={() => setSelectedFilter('NON-ISU')}
            >
              <Stack gap={2} align="center">
                <IconFileText size={20} color="#ffffff" />
                <Text size="10px" c="#ffffff" fw={600} tt="uppercase" ta="center" lh={1.2}>
                  Non-ISU Reports
                </Text>
                <Title order={2} c="#ffffff" style={{ fontSize: '1.75rem', margin: '2px 0' }}>
                  {summary.nonISUReports}
                </Title>
                <Badge color="orange" variant="filled" size="xs" style={{ fontSize: '9px' }}>
                  NON-ISU
                </Badge>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 6, xs: 3, sm: 2.4 }}>
            <Card
              padding="sm"
              radius="md"
              style={{
                backgroundColor: '#1971c2',
                cursor: 'pointer',
                height: '100%',
              }}
              onClick={() => setSelectedFilter('TEMP')}
            >
              <Stack gap={2} align="center">
                <IconCalendar size={20} color="#ffffff" />
                <Text size="10px" c="#ffffff" fw={600} tt="uppercase" ta="center" lh={1.2}>
                  Temporary Reports
                </Text>
                <Title order={2} c="#ffffff" style={{ fontSize: '1.75rem', margin: '2px 0' }}>
                  {summary.temporaryReports}
                </Title>
                <Badge color="yellow" variant="filled" size="xs" style={{ fontSize: '9px' }}>
                  TEMP
                </Badge>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 6, xs: 6, sm: 2.4 }}>
            <Card padding="sm" radius="md" withBorder style={{ height: '100%' }}>
              <Stack gap={2} align="center">
                <Group gap={4}>
                  <IconUsers size={14} color="#1971c2" />
                  <Text fw={600} size="9px" tt="uppercase">
                    Authorized Users
                  </Text>
                </Group>
                <Title order={2} style={{ color: '#212529', fontSize: '1.75rem', margin: '2px 0' }}>
                  {raasReportsData.authorizedUsers.length}
                </Title>
                <Badge color="blue" variant="light" size="xs" style={{ fontSize: '9px' }}>
                  USER
                </Badge>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 6, xs: 6, sm: 2.4 }}>
            <Card padding="sm" radius="md" withBorder style={{ height: '100%' }}>
              <Stack gap={2} align="center">
                <Group gap={4}>
                  <IconShieldCheck size={14} color="#1971c2" />
                  <Text fw={600} size="9px" tt="uppercase">
                    Security Group
                  </Text>
                </Group>
                <Title order={2} style={{ color: '#212529', fontSize: '1.75rem', margin: '2px 0' }}>
                  {raasReportsData.authorizedSecurityGroups.length}
                </Title>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Filter Tabs and Page Size */}
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <Badge
              size="sm"
              variant={selectedFilter === 'ISU' ? 'filled' : 'outline'}
              color="blue"
              style={{ cursor: 'pointer', padding: '4px 10px' }}
              onClick={() => setSelectedFilter('ISU')}
            >
              ISU
            </Badge>
            <Badge
              size="sm"
              variant={selectedFilter === 'NON-ISU' ? 'filled' : 'outline'}
              color="blue"
              style={{ cursor: 'pointer', padding: '4px 10px' }}
              onClick={() => setSelectedFilter('NON-ISU')}
            >
              NON-ISU
            </Badge>
            <Badge
              size="sm"
              variant={selectedFilter === 'TEMP' ? 'filled' : 'outline'}
              color="blue"
              style={{ cursor: 'pointer', padding: '4px 10px' }}
              onClick={() => setSelectedFilter('TEMP')}
            >
              Temp
            </Badge>
          </Group>

          <Group gap="sm">
            <Select
              label="Items per page"
              value={pageSize}
              onChange={(value) => {
                setPageSize(value || '10');
                setCurrentPage(1);
              }}
              data={[
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]}
              size="xs"
              style={{ width: 100 }}
            />
          </Group>
        </Group>

        {/* Main Content */}
        <Grid gutter="xs">
          {/* Reports Table */}
          <Grid.Col span={{ base: 12, lg: 9 }}>
            <Paper style={{ backgroundColor: '#ffffff', borderRadius: 12, border: '1px solid #dee2e6', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
              <Table
                striped
                highlightOnHover
                verticalSpacing="sm"
                styles={{
                  th: {
                    backgroundColor: '#1971c2',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                  },
                  td: {
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                  },
                }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('customReport')}
                    >
                      <Group gap={4} wrap="nowrap">
                        <span>Custom Report</span>
                        {getSortIcon('customReport')}
                      </Group>
                    </Table.Th>
                    <Table.Th
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('reportOwner')}
                    >
                      <Group gap={4} wrap="nowrap">
                        <span>Report Owner</span>
                        {getSortIcon('reportOwner')}
                      </Group>
                    </Table.Th>
                    <Table.Th
                      style={{ textAlign: 'center', width: '180px', cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('exemptFromExpiration')}
                    >
                      <Center>
                        <Group gap={4} wrap="nowrap">
                          <span>Exempt from expiration</span>
                          {getSortIcon('exemptFromExpiration')}
                        </Group>
                      </Center>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedReports.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                        <Text c="#868e96">
                          {sortedReports.length === 0 ? 'No reports found' : 'No items on this page'}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    paginatedReports.map((report) => (
                      <Table.Tr
                        key={report.uuid}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedCustomReport(report.customReport)}
                      >
                        <Table.Td style={{ fontWeight: 500, color: '#212529' }}>
                          {report.customReport}
                        </Table.Td>
                        <Table.Td style={{ color: '#495057' }}>{report.reportOwner}</Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          {report.exemptFromExpiration ? (
                            <IconCircleCheck size={20} color="#40c057" />
                          ) : (
                            <IconCircleX size={20} color="#fa5252" />
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
                <Table.Tfoot>
                  <Table.Tr>
                    <Table.Td colSpan={3} style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
                      <Group justify="space-between" align="center">
                        <Text size="sm" c="#495057" fw={500}>
                          Showing {paginatedReports.length > 0 ? startIndex + 1 : 0}-
                          {Math.min(endIndex, sortedReports.length)} of{' '}
                          {sortedReports.length} reports
                          {selectedFilter !== 'TOTAL' && (
                            <Text component="span" c="#868e96" ml={4}>
                              (filtered from {reports.length} total)
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
            </Paper>
          </Grid.Col>

          {/* Report Details */}
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <Stack gap="xs">
              <Paper p="sm" withBorder style={{ backgroundColor: '#ffffff', borderRadius: 8 }}>
                <Text fw={600} size="xs" tt="uppercase" c="#1971c2" mb={4}>
                  Custom Report
                </Text>
                <Text size="xs" c="#212529" style={{ wordBreak: 'break-word' }}>
                  {selectedCustomReport || 'Not Selected'}
                </Text>
              </Paper>

              <Paper p="sm" withBorder style={{ backgroundColor: '#ffffff', borderRadius: 8 }}>
                <Text fw={600} size="xs" tt="uppercase" c="#1971c2" mb={4}>
                  Report Owner
                </Text>
                <Text size="xs" c="#212529" style={{ wordBreak: 'break-word' }}>
                  {selectedReportDetails?.reportOwner || 'Not Selected'}
                </Text>
              </Paper>

              <Paper p="sm" withBorder style={{ backgroundColor: '#ffffff', borderRadius: 8 }}>
                <Text fw={600} size="xs" tt="uppercase" c="#1971c2" mb={4}>
                  Security Group
                </Text>
                <Text size="xs" c="#212529">
                  Not Selected
                </Text>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default RaasReportsPage;
