/**
 * AuditLogPage
 *
 * System-wide audit log viewer with filtering and export capabilities
 */

import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Paper,
  LoadingOverlay,
  Alert,
  Select,
  Badge,
} from '@mantine/core';
import {
  IconClipboardList,
  IconDownload,
  IconAlertCircle,
  IconRefresh,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getAllAuditLogs, exportAuditLogs } from '../../../services/audit/auditService';
import { AuditLog } from '../../../types';
import { AuditTrail } from '../../../components/organisms/AuditTrail';
import { usePermissions } from '../../../hooks/usePermissions';
import { PermissionGuard } from '../../../components/providers/PermissionGuard';

export const AuditLogPage = () => {
  const { hasPermission } = usePermissions();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [timeRangeFilter, setTimeRangeFilter] = useState<string | null>('all');

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllAuditLogs();

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load audit logs');
      }

      setLogs(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
    notifications.show({
      title: 'Refreshed',
      message: 'Audit logs have been refreshed',
      color: 'blue',
    });
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      const response = await exportAuditLogs(filteredLogs, 'csv');

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to export audit logs');
      }

      // Simulate download (in real app, would trigger actual file download)
      notifications.show({
        title: 'Export Successful',
        message: `Exported ${filteredLogs.length} audit log entries to CSV`,
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Export Failed',
        message: err instanceof Error ? err.message : 'An error occurred',
        color: 'red',
      });
    } finally {
      setExporting(false);
    }
  };

  // Filter logs by time range
  const filteredLogs = logs.filter((log) => {
    if (timeRangeFilter === 'all') return true;

    const logDate = new Date(log.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);

    if (timeRangeFilter === '24h') return hoursDiff <= 24;
    if (timeRangeFilter === '7d') return hoursDiff <= 24 * 7;
    if (timeRangeFilter === '30d') return hoursDiff <= 24 * 30;

    return true;
  });

  // Statistics
  const stats = {
    total: logs.length,
    create: logs.filter((l) => l.action === 'create').length,
    update: logs.filter((l) => l.action === 'update').length,
    delete: logs.filter((l) => l.action === 'delete').length,
    login: logs.filter((l) => l.action === 'login').length,
    roleChange: logs.filter((l) => l.action === 'role_change').length,
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Page Header */}
        <Group justify="space-between">
          <div>
            <Group gap="sm" mb="xs">
              <IconClipboardList size={32} stroke={1.5} />
              <Title order={1}>Audit Logs</Title>
            </Group>
            <Text c="dimmed">
              View and monitor all system activities, user actions, and security events
            </Text>
          </div>

          <Group gap="sm">
            <Button
              variant="light"
              leftSection={<IconRefresh size={18} />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
            <PermissionGuard permission="audit.export">
              <Button
                variant="filled"
                leftSection={<IconDownload size={18} />}
                onClick={handleExport}
                loading={exporting}
                disabled={filteredLogs.length === 0}
              >
                Export Logs
              </Button>
            </PermissionGuard>
          </Group>
        </Group>

        {/* Statistics */}
        <Paper withBorder p="md">
          <Group gap="xl">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Total Events
              </Text>
              <Text size="xl" fw={700}>
                {stats.total}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Created
              </Text>
              <Text size="xl" fw={700} c="green">
                {stats.create}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Updated
              </Text>
              <Text size="xl" fw={700} c="blue">
                {stats.update}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Deleted
              </Text>
              <Text size="xl" fw={700} c="red">
                {stats.delete}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Logins
              </Text>
              <Text size="xl" fw={700} c="cyan">
                {stats.login}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Role Changes
              </Text>
              <Text size="xl" fw={700} c="orange">
                {stats.roleChange}
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Time Range Filter */}
        <Paper withBorder p="md">
          <Group justify="space-between">
            <Text size="sm" fw={600}>
              Filter by Time Range
            </Text>
            <Select
              placeholder="Select time range"
              data={[
                { value: 'all', label: 'All Time' },
                { value: '24h', label: 'Last 24 Hours' },
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
              ]}
              value={timeRangeFilter}
              onChange={setTimeRangeFilter}
              w={200}
            />
          </Group>
        </Paper>

        {/* Results Summary */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Showing {filteredLogs.length} of {logs.length} audit entries
          </Text>
          {timeRangeFilter !== 'all' && (
            <Badge variant="light" color="blue">
              Filtered by time range
            </Badge>
          )}
        </Group>

        {/* Error Alert */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        {/* Loading State */}
        <div style={{ position: 'relative', minHeight: '400px' }}>
          <LoadingOverlay visible={loading} />

          {/* Audit Trail */}
          {!loading && !error && (
            <AuditTrail logs={filteredLogs} showFilters={true} maxHeight="800px" />
          )}
        </div>

        {/* Export Information */}
        <PermissionGuard permission="audit.export">
          <Alert icon={<IconDownload size={16} />} color="blue" variant="light">
            <Text size="sm">
              <strong>Export Capability:</strong> You can export audit logs to CSV format for
              compliance reporting and external analysis. The export includes all visible filtered
              entries.
            </Text>
          </Alert>
        </PermissionGuard>
      </Stack>
    </Container>
  );
};
