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
import { IconSearch, IconArrowLeft } from '@tabler/icons-react';
import segregationData from '@/data/segregation-of-duties.json';

interface SegregationOfDuty {
  id: number;
  worker: string;
  position: string;
  securityGroupsExpensesException: string;
  securityGroupsPayrollException: string;
  securityGroupsCustomerException: string;
  securityGroupsSupplierException: string;
}

type SortField = keyof SegregationOfDuty | null;
type SortDirection = 'asc' | 'desc' | null;

const SegregationOfDutiesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const duties: SegregationOfDuty[] = segregationData.segregationOfDuties;

  const handleSort = (field: keyof SegregationOfDuty) => {
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

  const getSortIcon = (field: keyof SegregationOfDuty) => {
    if (sortField !== field) return '↕';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕';
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...duties];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (duty) =>
          duty.worker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          duty.position.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [duties, searchQuery, sortField, sortDirection]);

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
            Segregation Of Duties Exception Details
          </Title>
          <Group>
            <Button variant="outline" color="blue" onClick={() => setSearchQuery('')}>
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
          <Group gap="md" mb="md">
            <TextInput
              placeholder="Search workers or positions..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
          </Group>

          <div style={{ overflowX: 'auto' }}>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead style={{ backgroundColor: '#1971c2' }}>
                <Table.Tr>
                  <Table.Th
                    onClick={() => handleSort('worker')}
                    style={{ cursor: 'pointer', userSelect: 'none', color: 'white' }}
                  >
                    Worker {getSortIcon('worker')}
                  </Table.Th>
                  <Table.Th
                    onClick={() => handleSort('position')}
                    style={{ cursor: 'pointer', userSelect: 'none', color: 'white' }}
                  >
                    Position {getSortIcon('position')}
                  </Table.Th>
                  <Table.Th style={{ color: 'white' }}>
                    Security Groups Expenses Exception
                  </Table.Th>
                  <Table.Th style={{ color: 'white' }}>
                    Security Groups Payroll Exception
                  </Table.Th>
                  <Table.Th style={{ color: 'white' }}>
                    Security Groups Customer Exception
                  </Table.Th>
                  <Table.Th style={{ color: 'white' }}>
                    Security Groups Supplier Exception
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedData.map((duty) => (
                  <Table.Tr key={duty.id}>
                    <Table.Td>{duty.worker}</Table.Td>
                    <Table.Td>{duty.position}</Table.Td>
                    <Table.Td>
                      {duty.securityGroupsExpensesException || '-'}
                    </Table.Td>
                    <Table.Td>
                      {duty.securityGroupsPayrollException || '-'}
                    </Table.Td>
                    <Table.Td>
                      {duty.securityGroupsCustomerException || '-'}
                    </Table.Td>
                    <Table.Td>
                      {duty.securityGroupsSupplierException || '-'}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>

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

export default SegregationOfDutiesPage;
