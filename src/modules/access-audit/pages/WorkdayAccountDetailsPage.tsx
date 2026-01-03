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
} from '@mantine/core';
import { IconSearch, IconArrowLeft } from '@tabler/icons-react';
import accountData from '@/data/workday-account-details.json';

interface WorkdayAccount {
  id: number;
  account: string;
  accountLastUsed: string;
  recentFailedSignOn: string;
  invalidAttempts: number;
  daysSinceLastPasswordChange: number;
  expirationDate: string;
  consecutiveFailure: number;
  isLocked: boolean;
  isPasswordExpired: boolean;
  isImplementer: boolean;
  isIntegrationUser: boolean;
}

type SortField = keyof WorkdayAccount | null;
type SortDirection = 'asc' | 'desc' | null;

const WorkdayAccountDetailsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocked, setFilterLocked] = useState(false);
  const [filterPasswordExpired, setFilterPasswordExpired] = useState(false);
  const [filterImplementer, setFilterImplementer] = useState(false);
  const [filterIntegrationUser, setFilterIntegrationUser] = useState(false);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const accounts: WorkdayAccount[] = accountData.accounts;

  const handleSort = (field: keyof WorkdayAccount) => {
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

  const getSortIcon = (field: keyof WorkdayAccount) => {
    if (sortField !== field) return '↕';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕';
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...accounts];

    // Apply filters
    if (filterLocked) {
      filtered = filtered.filter((account) => account.isLocked);
    }
    if (filterPasswordExpired) {
      filtered = filtered.filter((account) => account.isPasswordExpired);
    }
    if (filterImplementer) {
      filtered = filtered.filter((account) => account.isImplementer);
    }
    if (filterIntegrationUser) {
      filtered = filtered.filter((account) => account.isIntegrationUser);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((account) =>
        account.account.toLowerCase().includes(searchQuery.toLowerCase())
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

        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return sortDirection === 'asc'
            ? (aValue === bValue ? 0 : aValue ? 1 : -1)
            : (aValue === bValue ? 0 : bValue ? 1 : -1);
        }

        return 0;
      });
    }

    return filtered;
  }, [
    accounts,
    searchQuery,
    filterLocked,
    filterPasswordExpired,
    filterImplementer,
    filterIntegrationUser,
    sortField,
    sortDirection,
  ]);

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
            Workday Account Details
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
              placeholder="Search accounts..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
          </Group>

          <Group gap="sm" mb="md">
            <Button
              size="xs"
              variant={filterLocked ? 'filled' : 'outline'}
              color={filterLocked ? 'red' : 'gray'}
              onClick={() => setFilterLocked(!filterLocked)}
            >
              Locked Account
            </Button>
            <Button
              size="xs"
              variant={filterPasswordExpired ? 'filled' : 'outline'}
              color={filterPasswordExpired ? 'orange' : 'gray'}
              onClick={() => setFilterPasswordExpired(!filterPasswordExpired)}
            >
              Password Expired
            </Button>
            <Button
              size="xs"
              variant={filterImplementer ? 'filled' : 'outline'}
              color={filterImplementer ? 'blue' : 'gray'}
              onClick={() => setFilterImplementer(!filterImplementer)}
            >
              Is Implementer
            </Button>
            <Button
              size="xs"
              variant={filterIntegrationUser ? 'filled' : 'outline'}
              color={filterIntegrationUser ? 'green' : 'gray'}
              onClick={() => setFilterIntegrationUser(!filterIntegrationUser)}
            >
              Is Integration User
            </Button>
          </Group>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th
                  onClick={() => handleSort('account')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Account {getSortIcon('account')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('accountLastUsed')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Account Last Used {getSortIcon('accountLastUsed')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('recentFailedSignOn')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Recent Failed Sign On {getSortIcon('recentFailedSignOn')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('invalidAttempts')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Invalid Attempts {getSortIcon('invalidAttempts')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('daysSinceLastPasswordChange')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Days Since Last Password Change {getSortIcon('daysSinceLastPasswordChange')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('expirationDate')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Expiration Date {getSortIcon('expirationDate')}
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('consecutiveFailure')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Consecutive Failure {getSortIcon('consecutiveFailure')}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((account) => (
                <Table.Tr key={account.id}>
                  <Table.Td>
                    <Group gap="xs">
                      {account.account}
                      {account.isLocked && (
                        <Badge size="xs" variant="filled" color="red">
                          Locked
                        </Badge>
                      )}
                      {account.isPasswordExpired && (
                        <Badge size="xs" variant="filled" color="orange">
                          Expired
                        </Badge>
                      )}
                      {account.isImplementer && (
                        <Badge size="xs" variant="filled" color="blue">
                          Impl
                        </Badge>
                      )}
                      {account.isIntegrationUser && (
                        <Badge size="xs" variant="filled" color="green">
                          Integ
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>{account.accountLastUsed}</Table.Td>
                  <Table.Td>
                    {account.recentFailedSignOn ? (
                      <Text size="sm" c="red">
                        {account.recentFailedSignOn}
                      </Text>
                    ) : (
                      <Text size="sm" c="dimmed">
                        -
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      variant="filled"
                      color={account.invalidAttempts > 0 ? 'red' : 'green'}
                    >
                      {account.invalidAttempts}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      variant="light"
                      color={
                        account.daysSinceLastPasswordChange > 90
                          ? 'red'
                          : account.daysSinceLastPasswordChange > 60
                          ? 'orange'
                          : 'green'
                      }
                    >
                      {account.daysSinceLastPasswordChange} days
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {(() => {
                      const expirationDate = new Date(account.expirationDate);
                      const today = new Date();
                      const isExpired = expirationDate < today;
                      const daysUntilExpiration = Math.ceil(
                        (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <Group gap="xs">
                          <Text size="sm">{account.expirationDate}</Text>
                          {isExpired && (
                            <Badge size="xs" variant="filled" color="red">
                              Expired
                            </Badge>
                          )}
                          {!isExpired && daysUntilExpiration <= 30 && (
                            <Badge size="xs" variant="filled" color="orange">
                              Expiring Soon
                            </Badge>
                          )}
                        </Group>
                      );
                    })()}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      variant="filled"
                      color={account.consecutiveFailure > 0 ? 'red' : 'green'}
                    >
                      {account.consecutiveFailure}
                    </Badge>
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

export default WorkdayAccountDetailsPage;
