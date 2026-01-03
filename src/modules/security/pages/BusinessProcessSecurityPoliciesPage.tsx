import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Table,
  Paper,
  Group,
  TextInput,
  Pagination,
  Stack,
  Text,
  Button,
} from '@mantine/core';
import { IconSearch, IconArrowLeft, IconCalendar } from '@tabler/icons-react';
import businessPoliciesData from '@/data/business-process-security-policies.json';

interface BusinessProcessPolicy {
  id: number;
  businessProcessType: string;
  byUser: string;
  lastChanged: string;
}

type SortField = keyof BusinessProcessPolicy | null;
type SortDirection = 'asc' | 'desc' | null;

const BusinessProcessSecurityPoliciesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('11/5/2025');
  const [toDate, setToDate] = useState('12/8/2025');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const policies: BusinessProcessPolicy[] = businessPoliciesData.businessProcessPolicies;

  const handleSort = (field: keyof BusinessProcessPolicy) => {
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

  const getSortIcon = (field: keyof BusinessProcessPolicy) => {
    if (sortField !== field) return '↕';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕';
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...policies];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (policy) =>
          policy.businessProcessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          policy.byUser.toLowerCase().includes(searchQuery.toLowerCase())
      );
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

        return 0;
      });
    }

    return filtered;
  }, [policies, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={2} c="#1971c2" style={{ textAlign: 'left' }}>
            Business Process Security Policies Changed
          </Title>
          <Group>
            <Button variant="outline" color="blue" onClick={() => {
              setSearchQuery('');
              setFromDate('');
              setToDate('');
            }}>
              Clear all Filters
            </Button>
            <Button
              leftSection={<IconArrowLeft size={16} />}
              variant="light"
              color="blue"
              onClick={() => navigate('/app/security')}
            >
              Back to Security
            </Button>
          </Group>
        </Group>

        <Paper p="md" radius="md" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <Group gap="md" mb="md" justify="space-between">
            <Group gap="md" style={{ flex: 1 }}>
              <TextInput
                placeholder="Search policies..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                style={{ flex: 1 }}
              />
            </Group>
            <Group gap="sm">
              <Text size="sm" fw={600}>From</Text>
              <TextInput
                type="date"
                leftSection={<IconCalendar size={16} />}
                value={fromDate}
                onChange={(e) => setFromDate(e.currentTarget.value)}
                style={{ width: 180 }}
              />
              <Text size="sm" fw={600}>To</Text>
              <TextInput
                type="date"
                leftSection={<IconCalendar size={16} />}
                value={toDate}
                onChange={(e) => setToDate(e.currentTarget.value)}
                style={{ width: 180 }}
              />
            </Group>
          </Group>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead style={{ backgroundColor: '#1971c2' }}>
              <Table.Tr>
                <Table.Th
                  onClick={() => handleSort('businessProcessType')}
                  style={{ cursor: 'pointer', userSelect: 'none', color: 'white' }}
                >
                  Business_Process_Type {getSortIcon('businessProcessType')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('byUser')}
                  style={{ cursor: 'pointer', userSelect: 'none', color: 'white' }}
                >
                  By_User {getSortIcon('byUser')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('lastChanged')}
                  style={{ cursor: 'pointer', userSelect: 'none', color: 'white' }}
                >
                  Last_Changed {getSortIcon('lastChanged')}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((policy) => (
                <Table.Tr key={policy.id}>
                  <Table.Td>{policy.businessProcessType}</Table.Td>
                  <Table.Td>{policy.byUser}</Table.Td>
                  <Table.Td>{policy.lastChanged}</Table.Td>
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

export default BusinessProcessSecurityPoliciesPage;
