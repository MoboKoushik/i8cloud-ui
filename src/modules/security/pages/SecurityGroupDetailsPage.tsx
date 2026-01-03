import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Table,
  Paper,
  Badge,
  Group,
  TextInput,
  Pagination,
  Stack,
  Text,
  Button,
  Select,
} from '@mantine/core';
import { IconSearch, IconArrowLeft } from '@tabler/icons-react';
import securityGroupData from '@/data/security-group-details.json';

interface SecurityGroup {
  id: number;
  securityGroup: string;
  securityGroupType: string;
  sumOfMembershipCount: number;
  members: string;
  lastFunctionallyUpdated: string;
}

type SortField = keyof SecurityGroup | null;
type SortDirection = 'asc' | 'desc' | null;

const SecurityGroupDetailsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const securityGroups: SecurityGroup[] = securityGroupData.securityGroups;

  const handleSort = (field: keyof SecurityGroup) => {
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

  const getSortIcon = (field: keyof SecurityGroup) => {
    if (sortField !== field) return '↕';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕';
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...securityGroups];

    // Filter by type
    if (selectedType && selectedType !== 'All') {
      filtered = filtered.filter((group) => group.securityGroupType === selectedType);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (group) =>
          group.securityGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.securityGroupType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.members.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [securityGroups, searchQuery, selectedType, sortField, sortDirection]);

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
            Security Group Details
          </Title>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="light"
            color="blue"
            onClick={() => navigate('/app/security')}
          >
            Back to Security
          </Button>
        </Group>

        <Paper p="md" radius="md" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <Group gap="md" mb="md" align="flex-end">
            <TextInput
              placeholder="Search security groups..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              label="Security Group Type"
              placeholder="Select type"
              data={[
                { value: 'All', label: 'All' },
                { value: 'Aggregation Security Group', label: 'Aggregation Security Group' },
                { value: 'Role Based Security Group', label: 'Role Based Security Group' },
                { value: 'User Based Security Group', label: 'User Based Security Group' },
              ]}
              value={selectedType}
              onChange={(value) => setSelectedType(value || 'All')}
              style={{ minWidth: 250 }}
            />
            <Button variant="outline" color="blue" onClick={() => {
              setSearchQuery('');
              setSelectedType('All');
            }}>
              Clear all Filters
            </Button>
          </Group>

          <Group justify="flex-end" mb="sm">
            <Badge size="lg" variant="filled" color="blue">
              Security Groups: {filteredAndSortedData.length}
            </Badge>
          </Group>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead style={{ backgroundColor: '#1971c2' }}>
              <Table.Tr>
                <Table.Th
                  onClick={() => handleSort('securityGroup')}
                  style={{ cursor: 'pointer', userSelect: 'none', color: 'white' }}
                >
                  Security Group {getSortIcon('securityGroup')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('securityGroupType')}
                  style={{ cursor: 'pointer', userSelect: 'none', color: 'white' }}
                >
                  Security Group Type {getSortIcon('securityGroupType')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('sumOfMembershipCount')}
                  style={{ cursor: 'pointer', userSelect: 'none', color: 'white', textAlign: 'center' }}
                >
                  Sum of Membership Count {getSortIcon('sumOfMembershipCount')}
                </Table.Th>
                <Table.Th style={{ color: 'white' }}>
                  Members
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('lastFunctionallyUpdated')}
                  style={{ cursor: 'pointer', userSelect: 'none', color: 'white' }}
                >
                  Last Functionally Updated {getSortIcon('lastFunctionallyUpdated')}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((group) => (
                <Table.Tr key={group.id}>
                  <Table.Td>{group.securityGroup}</Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      variant="light"
                      color={
                        group.securityGroupType === 'Aggregation Security Group'
                          ? 'blue'
                          : group.securityGroupType === 'Role Based Security Group'
                          ? 'green'
                          : 'orange'
                      }
                    >
                      {group.securityGroupType}
                    </Badge>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Badge size="sm" variant="filled" color="blue">
                      {group.sumOfMembershipCount}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={2}>
                      {group.members}
                    </Text>
                  </Table.Td>
                  <Table.Td>{group.lastFunctionallyUpdated}</Table.Td>
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

export default SecurityGroupDetailsPage;
