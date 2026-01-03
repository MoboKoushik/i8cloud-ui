import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Table,
  Paper,
  Badge,
  Tabs,
  Group,
  TextInput,
  Pagination,
  Stack,
  Text,
  Button,
} from '@mantine/core';
import { IconSearch, IconCalendar, IconArrowLeft } from '@tabler/icons-react';
import signonData from '@/data/signon-details.json';

interface Signon {
  id: number;
  systemAccount: string;
  signonTime: string;
  authenticationType: string;
  status: string;
  failureMessage: string;
  accountLocked: boolean;
  accountDisabled: boolean;
  accountExpired: boolean;
}

type SortField = keyof Signon | null;
type SortDirection = 'asc' | 'desc' | null;

const SignonDetailsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const signons: Signon[] = signonData.signons;

  const handleSort = (field: keyof Signon) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Signon) => {
    if (sortField !== field) return '↕';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕';
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...signons];

    // Filter by tab
    if (activeTab === 'failed') {
      filtered = filtered.filter((signon) => signon.status === 'Failed');
    } else if (activeTab === 'successful') {
      filtered = filtered.filter((signon) => signon.status === 'Successful');
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (signon) =>
          signon.systemAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
          signon.authenticationType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          signon.failureMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter((signon) => {
        const signonDate = new Date(signon.signonTime);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return signonDate >= start && signonDate <= end;
        } else if (start) {
          return signonDate >= start;
        } else if (end) {
          return signonDate <= end;
        }
        return true;
      });
    }

    // Sort
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return sortDirection === 'asc'
            ? (aValue === bValue ? 0 : aValue ? 1 : -1)
            : (aValue === bValue ? 0 : bValue ? 1 : -1);
        }

        return 0;
      });
    }

    return filtered;
  }, [signons, activeTab, searchQuery, startDate, endDate, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getAccountStatusText = (signon: Signon) => {
    const statuses = [];
    if (signon.accountLocked) statuses.push('Locked');
    if (signon.accountDisabled) statuses.push('Disabled');
    if (signon.accountExpired) statuses.push('Expired');
    return statuses.length > 0 ? statuses.join(', ') : '-';
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={2} c="#1971c2" style={{ textAlign: 'left' }}>
            Signon Details
          </Title>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="light"
            color="blue"
            onClick={() => navigate('/app/audit-log')}
          >
            Back to Access Audit
          </Button>
        </Group>

        <Paper p="md" radius="md" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <Group gap="md" mb="md">
            <TextInput
              placeholder="Search signons..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <TextInput
              type="date"
              placeholder="Start Date"
              leftSection={<IconCalendar size={16} />}
              value={startDate}
              onChange={(e) => setStartDate(e.currentTarget.value)}
            />
            <TextInput
              type="date"
              placeholder="End Date"
              leftSection={<IconCalendar size={16} />}
              value={endDate}
              onChange={(e) => setEndDate(e.currentTarget.value)}
            />
          </Group>

          <Tabs value={activeTab} onChange={setActiveTab} mb="md">
            <Tabs.List>
              <Tabs.Tab value="all">All Signons</Tabs.Tab>
              <Tabs.Tab value="failed">Failed</Tabs.Tab>
              <Tabs.Tab value="successful">Successful</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th
                  onClick={() => handleSort('systemAccount')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  System Account {getSortIcon('systemAccount')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('signonTime')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Sign-on Time {getSortIcon('signonTime')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('authenticationType')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Authentication Type {getSortIcon('authenticationType')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('status')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Failed/Successful {getSortIcon('status')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('failureMessage')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Failure Message {getSortIcon('failureMessage')}
                </Table.Th>
                <Table.Th>Account Locked, Disabled or Expired</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((signon) => (
                <Table.Tr key={signon.id}>
                  <Table.Td>{signon.systemAccount}</Table.Td>
                  <Table.Td>{signon.signonTime}</Table.Td>
                  <Table.Td>
                    <Badge size="sm" variant="light" color="blue">
                      {signon.authenticationType}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      variant="filled"
                      color={signon.status === 'Failed' ? 'red' : 'green'}
                    >
                      {signon.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {signon.failureMessage ? (
                      <Text size="sm" c="red">
                        {signon.failureMessage}
                      </Text>
                    ) : (
                      '-'
                    )}
                  </Table.Td>
                  <Table.Td>
                    {getAccountStatusText(signon) !== '-' ? (
                      <Badge size="sm" variant="filled" color="red">
                        {getAccountStatusText(signon)}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
              Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
              {filteredAndSortedData.length} entries
            </Text>
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
              size="sm"
            />
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SignonDetailsPage;
