/**
 * PermissionListPage
 *
 * Displays all available permissions in the system
 * Allows searching, filtering, and viewing permission details
 */

import { useEffect, useState } from 'react';
import { Container, Title, Text, Stack, LoadingOverlay, Alert, Paper, Button, Group } from '@mantine/core';
import { IconShield, IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { getAllPermissions } from '../../../services/permissions/permissionService';
import { getAllModules } from '../../../services/modules/moduleService';
import type { Permission, Module } from '../../../types';
import { PermissionGrid } from '../../../components/organisms/PermissionGrid';
import { AddPermissionModuleModal } from '../../../components/organisms/AddPermissionModuleModal';

export const PermissionListPage = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load permissions and modules in parallel
      const [permissionsResponse, modulesResponse] = await Promise.all([
        getAllPermissions(),
        getAllModules(),
      ]);

      if (!permissionsResponse.success) {
        throw new Error(permissionsResponse.error?.message || 'Failed to load permissions');
      }

      if (!modulesResponse.success) {
        throw new Error(modulesResponse.error?.message || 'Failed to load modules');
      }

      setPermissions(permissionsResponse.data || []);
      setModules(modulesResponse.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePermissionsCreated = async () => {
    await loadData();
  };

  // Calculate statistics
  const stats = {
    total: permissions.length,
    critical: permissions.filter((p) => p.riskLevel === 'critical').length,
    high: permissions.filter((p) => p.riskLevel === 'high').length,
    requiresApproval: permissions.filter((p) => p.requiresApproval === true).length,
  };

  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Page Header */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Group gap="sm" mb="xs">
                <IconShield size={32} stroke={1.5} />
                <Title order={1}>Permissions</Title>
              </Group>
              <Text c="dimmed">
                View and explore all available permissions in the system. Permissions control access to
                features and data.
              </Text>
            </div>
            <Button leftSection={<IconPlus size={18} />} onClick={openModal}>
              Add Permission Module
            </Button>
          </Group>

          {/* Statistics */}
          <Paper withBorder p="md">
            <Group gap="xl">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Total Permissions
                </Text>
                <Text size="xl" fw={700}>
                  {stats.total}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Critical Risk
                </Text>
                <Text size="xl" fw={700} c="red">
                  {stats.critical}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  High Risk
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {stats.high}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Requires Approval
                </Text>
                <Text size="xl" fw={700} c="yellow">
                  {stats.requiresApproval}
                </Text>
              </div>
            </Group>
          </Paper>

          {/* Info Alert */}
          <Alert icon={<IconAlertCircle size={16} />} title="About Permissions" color="blue">
            Permissions are assigned to roles and determine what actions users can perform. Each
            permission has a risk level indicating its security impact. Critical and high-risk
            permissions should be assigned carefully.
          </Alert>

          {/* Error State */}
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              {error}
            </Alert>
          )}

          {/* Loading State */}
          <div style={{ position: 'relative', minHeight: '400px' }}>
            <LoadingOverlay visible={loading} />

            {/* Permission Grid */}
            {!loading && !error && (
              <PermissionGrid permissions={permissions} modules={modules} />
            )}
          </div>
        </Stack>
      </Container>

      {/* Add Permission Module Modal - Rendered outside Container */}
      <AddPermissionModuleModal
        opened={modalOpened}
        onClose={closeModal}
        onPermissionsCreated={handlePermissionsCreated}
        existingSubjects={permissions.map((p) => p.subject)}
      />
    </>
  );
};
