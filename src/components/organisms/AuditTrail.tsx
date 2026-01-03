/**
 * AuditTrail Component
 *
 * Displays audit log entries in a timeline format
 * Shows who did what, when, and why
 */

import { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Paper,
  Badge,
  Timeline,
  Avatar,
  Accordion,
  Table,
  Alert,
  Select,
  TextInput,
} from '@mantine/core';
import {
  IconUser,
  IconKey,
  IconEdit,
  IconTrash,
  IconPlus,
  IconLogin,
  IconLogout,
  IconAlertCircle,
  IconSearch,
  IconFilter,
} from '@tabler/icons-react';
import { AuditLog } from '../../types';
import { formatDate, getInitials, getAuditActionColor } from '../../utils/formatters';

interface AuditTrailProps {
  logs: AuditLog[];
  showFilters?: boolean;
  maxHeight?: string | number;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({
  logs,
  showFilters = true,
  maxHeight = '600px',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [entityTypeFilter, setEntityTypeFilter] = useState<string | null>(null);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchQuery ||
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = !actionFilter || log.action === actionFilter;
    const matchesEntityType = !entityTypeFilter || log.entityType === entityTypeFilter;

    return matchesSearch && matchesAction && matchesEntityType;
  });

  // Get action icon
  const getActionIcon = (action: AuditLog['action']) => {
    const iconMap = {
      create: <IconPlus size={16} />,
      update: <IconEdit size={16} />,
      delete: <IconTrash size={16} />,
      login: <IconLogin size={16} />,
      logout: <IconLogout size={16} />,
      role_change: <IconKey size={16} />,
    };
    return iconMap[action] || <IconAlertCircle size={16} />;
  };

  // Get action label
  const getActionLabel = (action: AuditLog['action']) => {
    const labelMap = {
      create: 'Created',
      update: 'Updated',
      delete: 'Deleted',
      login: 'Logged In',
      logout: 'Logged Out',
      role_change: 'Role Changed',
    };
    return labelMap[action] || action;
  };

  // Get entity type label
  const getEntityTypeLabel = (entityType: AuditLog['entityType']) => {
    const labelMap = {
      user: 'User',
      role: 'Role',
      permission: 'Permission',
      session: 'Session',
    };
    return labelMap[entityType] || entityType;
  };

  if (logs.length === 0) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
        No audit logs available
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      {/* Filters */}
      {showFilters && (
        <Paper withBorder p="md">
          <Group grow>
            <TextInput
              placeholder="Search by username or entity..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
            <Select
              placeholder="Filter by action"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: 'create', label: 'Create' },
                { value: 'update', label: 'Update' },
                { value: 'delete', label: 'Delete' },
                { value: 'login', label: 'Login' },
                { value: 'logout', label: 'Logout' },
                { value: 'role_change', label: 'Role Change' },
              ]}
              value={actionFilter}
              onChange={setActionFilter}
              clearable
            />
            <Select
              placeholder="Filter by entity type"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: 'user', label: 'User' },
                { value: 'role', label: 'Role' },
                { value: 'permission', label: 'Permission' },
                { value: 'session', label: 'Session' },
              ]}
              value={entityTypeFilter}
              onChange={setEntityTypeFilter}
              clearable
            />
          </Group>
        </Paper>
      )}

      {/* Results Count */}
      <Text size="sm" c="dimmed">
        Showing {filteredLogs.length} of {logs.length} audit entries
      </Text>

      {/* Timeline */}
      <div style={{ maxHeight, overflowY: 'auto' }}>
        <Timeline active={filteredLogs.length} bulletSize={32} lineWidth={2}>
          {filteredLogs.map((log) => (
            <Timeline.Item
              key={log.id}
              bullet={
                <Avatar size={24} radius="xl" color={getAuditActionColor(log.action)}>
                  {getActionIcon(log.action)}
                </Avatar>
              }
              title={
                <Group gap="xs">
                  <Text fw={600} size="sm">
                    {getActionLabel(log.action)}
                  </Text>
                  <Badge size="sm" variant="light" color={getAuditActionColor(log.action)}>
                    {getEntityTypeLabel(log.entityType)}
                  </Badge>
                </Group>
              }
            >
              <Paper withBorder p="md" mt="xs">
                <Stack gap="sm">
                  {/* Header */}
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Avatar size={24} radius="xl" color="blue">
                        {getInitials(log.username)}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>
                          {log.username}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatDate(log.timestamp)}
                        </Text>
                      </div>
                    </Group>
                  </Group>

                  {/* Entity Info */}
                  <div>
                    <Text size="sm">
                      <strong>{getActionLabel(log.action)}</strong>{' '}
                      {getEntityTypeLabel(log.entityType).toLowerCase()}:{' '}
                      <strong>{log.entityName}</strong>
                    </Text>
                  </div>

                  {/* Reason */}
                  {log.reason && (
                    <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
                      <Text size="sm">
                        <strong>Reason:</strong> {log.reason}
                      </Text>
                    </Alert>
                  )}

                  {/* Changes */}
                  {log.changes && log.changes.length > 0 && (
                    <Accordion variant="contained">
                      <Accordion.Item value="changes">
                        <Accordion.Control>
                          <Text size="sm" fw={500}>
                            View Changes ({log.changes.length})
                          </Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Table striped>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th>Field</Table.Th>
                                <Table.Th>Old Value</Table.Th>
                                <Table.Th>New Value</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {log.changes.map((change, index) => (
                                <Table.Tr key={index}>
                                  <Table.Td>
                                    <Text size="sm" fw={500}>
                                      {change.field}
                                    </Text>
                                  </Table.Td>
                                  <Table.Td>
                                    <Badge variant="light" color="red">
                                      {typeof change.oldValue === 'object'
                                        ? JSON.stringify(change.oldValue)
                                        : String(change.oldValue || 'N/A')}
                                    </Badge>
                                  </Table.Td>
                                  <Table.Td>
                                    <Badge variant="light" color="green">
                                      {typeof change.newValue === 'object'
                                        ? JSON.stringify(change.newValue)
                                        : String(change.newValue || 'N/A')}
                                    </Badge>
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                          </Table>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  )}

                  {/* IP Address & User Agent */}
                  {(log.ipAddress || log.userAgent) && (
                    <Group gap="xs">
                      {log.ipAddress && (
                        <Text size="xs" c="dimmed">
                          IP: {log.ipAddress}
                        </Text>
                      )}
                      {log.userAgent && (
                        <Text size="xs" c="dimmed">
                          • {log.userAgent}
                        </Text>
                      )}
                    </Group>
                  )}
                </Stack>
              </Paper>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      {filteredLogs.length === 0 && logs.length > 0 && (
        <Alert icon={<IconAlertCircle size={16} />} color="orange" variant="light">
          No audit logs match the current filters
        </Alert>
      )}
    </Stack>
  );
};
