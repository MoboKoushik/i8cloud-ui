/**
 * PermissionGrid Component
 *
 * Displays permissions in a grouped, filterable grid layout
 */

import { useState, useMemo } from 'react';
import {
  Card,
  Group,
  Text,
  Stack,
  Accordion,
  Badge,
  TextInput,
  Select,
  Grid,
  ActionIcon,
  Tooltip,
  Modal,
} from '@mantine/core';
import { IconSearch, IconFilter, IconInfoCircle } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Permission, Module, RiskLevel } from '../../types';
import { RiskLevelIndicator } from '../atoms/RiskLevelIndicator';
import { EmptyState } from '../atoms/EmptyState';

interface PermissionGridProps {
  permissions: Permission[];
  modules: Module[];
}

export const PermissionGrid: React.FC<PermissionGridProps> = ({ permissions, modules }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [detailModalOpened, { open: openDetailModal, close: closeDetailModal }] = useDisclosure(false);

  // Filter permissions
  const filteredPermissions = useMemo(() => {
    return permissions.filter((permission) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        permission.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.actionDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Module filter
      const matchesModule = !moduleFilter || permission.module === moduleFilter;

      // Risk filter
      const matchesRisk = !riskFilter || permission.riskLevel === riskFilter;

      return matchesSearch && matchesModule && matchesRisk;
    });
  }, [permissions, searchQuery, moduleFilter, riskFilter]);

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};

    filteredPermissions.forEach((permission) => {
      if (!groups[permission.module]) {
        groups[permission.module] = [];
      }
      groups[permission.module].push(permission);
    });

    return groups;
  }, [filteredPermissions]);

  // Get module display name
  const getModuleName = (moduleKey: string) => {
    const module = modules.find((m) => m.key === moduleKey);
    return module?.name || moduleKey;
  };

  // Get module category
  const getModuleCategory = (moduleKey: string) => {
    const module = modules.find((m) => m.key === moduleKey);
    return module?.category || 'Other';
  };

  const handlePermissionClick = (permission: Permission) => {
    setSelectedPermission(permission);
    openDetailModal();
  };

  const handleCloseDetailModal = () => {
    closeDetailModal();
    setSelectedPermission(null);
  };

  // Module filter options
  const moduleOptions = useMemo(() => {
    return modules.map((module) => ({
      value: module.key,
      label: module.name,
    }));
  }, [modules]);

  // Risk filter options
  const riskOptions: { value: RiskLevel; label: string }[] = [
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' },
    { value: 'critical', label: 'Critical Risk' },
  ];

  return (
    <>
      <Stack gap="md">
        {/* Filters */}
        <Card withBorder p="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder="Search permissions..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                placeholder="Filter by module"
                leftSection={<IconFilter size={16} />}
                data={moduleOptions}
                value={moduleFilter}
                onChange={setModuleFilter}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                placeholder="Filter by risk level"
                leftSection={<IconFilter size={16} />}
                data={riskOptions}
                value={riskFilter}
                onChange={setRiskFilter}
                clearable
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Summary */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Showing {filteredPermissions.length} of {permissions.length} permissions
          </Text>
          {(searchQuery || moduleFilter || riskFilter) && (
            <Text
              size="sm"
              c="blue"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSearchQuery('');
                setModuleFilter(null);
                setRiskFilter(null);
              }}
            >
              Clear filters
            </Text>
          )}
        </Group>

        {/* Permissions Grid */}
        {Object.keys(groupedPermissions).length === 0 ? (
          <EmptyState
            title="No permissions found"
            description="Try adjusting your search or filter criteria"
          />
        ) : (
          <Accordion variant="separated" multiple>
            {Object.entries(groupedPermissions).map(([moduleKey, modulePermissions]) => (
              <Accordion.Item key={moduleKey} value={moduleKey}>
                <Accordion.Control>
                  <Group justify="space-between" wrap="nowrap">
                    <div>
                      <Text fw={600}>{getModuleName(moduleKey)}</Text>
                      <Text size="xs" c="dimmed">
                        {getModuleCategory(moduleKey)}
                      </Text>
                    </div>
                    <Badge size="sm" variant="light">
                      {modulePermissions.length} permissions
                    </Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Grid gutter="md">
                    {modulePermissions.map((permission) => (
                      <Grid.Col key={permission.id} span={{ base: 12, sm: 6, md: 4 }}>
                        <Card
                          withBorder
                          p="md"
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#228be6';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#dee2e6';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          onClick={() => handlePermissionClick(permission)}
                        >
                          <Stack gap="xs">
                            <Group justify="space-between" wrap="nowrap">
                              <Text fw={600} size="sm">
                                {permission.actionDisplayName}
                              </Text>
                              <Tooltip label="View details">
                                <ActionIcon variant="subtle" size="sm" color="blue">
                                  <IconInfoCircle size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>

                            <Text size="xs" c="dimmed" lineClamp={2}>
                              {permission.description}
                            </Text>

                            <Group justify="space-between" mt="xs">
                              <Badge size="xs" variant="light" color="gray">
                                {permission.key}
                              </Badge>
                              <RiskLevelIndicator level={permission.riskLevel} showLabel={false} size="xs" />
                            </Group>
                          </Stack>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Stack>

      {/* Permission Detail Modal */}
      <Modal
        opened={detailModalOpened}
        onClose={handleCloseDetailModal}
        title="Permission Details"
        size="lg"
      >
        {selectedPermission && (
          <Stack gap="md">
            <div>
              <Text size="sm" c="dimmed" mb={4}>
                Permission Key
              </Text>
              <Badge variant="light" size="lg">
                {selectedPermission.key}
              </Badge>
            </div>

            <div>
              <Text size="sm" c="dimmed" mb={4}>
                Display Name
              </Text>
              <Text fw={600}>{selectedPermission.actionDisplayName}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed" mb={4}>
                Description
              </Text>
              <Text size="sm">{selectedPermission.description}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed" mb={4}>
                Module
              </Text>
              <Text size="sm">{getModuleName(selectedPermission.module)}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed" mb={4}>
                Risk Level
              </Text>
              <RiskLevelIndicator level={selectedPermission.riskLevel} />
            </div>

            {selectedPermission.requiresApproval && (
              <div>
                <Badge color="orange" variant="light">
                  Requires Approval
                </Badge>
              </div>
            )}
          </Stack>
        )}
      </Modal>
    </>
  );
};
