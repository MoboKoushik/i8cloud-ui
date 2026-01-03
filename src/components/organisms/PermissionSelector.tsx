/**
 * PermissionSelector Component
 *
 * Complex accordion-based UI for selecting permissions grouped by module
 * Used in Create/Edit Role pages
 */

import { useState, useMemo } from 'react';
import {
  Accordion,
  Checkbox,
  Group,
  Text,
  Badge,
  Stack,
  TextInput,
  Button,
  Paper,
  Alert,
} from '@mantine/core';
import { IconSearch, IconAlertCircle } from '@tabler/icons-react';
import { Permission, Module } from '../../types';
import { RiskLevelIndicator } from '../atoms/RiskLevelIndicator';

interface PermissionSelectorProps {
  permissions: Permission[];
  modules: Module[];
  selectedPermissionKeys: string[];
  onChange: (selectedKeys: string[]) => void;
  error?: string;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  permissions,
  modules,
  selectedPermissionKeys,
  onChange,
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};

    permissions.forEach((permission) => {
      if (!groups[permission.module]) {
        groups[permission.module] = [];
      }
      groups[permission.module].push(permission);
    });

    // Sort permissions within each module by action
    Object.keys(groups).forEach((moduleKey) => {
      groups[moduleKey].sort((a, b) => a.actionDisplayName.localeCompare(b.actionDisplayName));
    });

    return groups;
  }, [permissions]);

  // Group modules by category
  const modulesByCategory = useMemo(() => {
    const categories: Record<string, Module[]> = {};

    modules.forEach((module) => {
      if (!categories[module.category]) {
        categories[module.category] = [];
      }
      categories[module.category].push(module);
    });

    // Sort modules within each category by order
    Object.keys(categories).forEach((category) => {
      categories[category].sort((a, b) => a.order - b.order);
    });

    return categories;
  }, [modules]);

  // Filter permissions by search query
  const filteredGroupedPermissions = useMemo(() => {
    if (!searchQuery) return groupedPermissions;

    const filtered: Record<string, Permission[]> = {};

    Object.entries(groupedPermissions).forEach(([moduleKey, modulePermissions]) => {
      const matchingPermissions = modulePermissions.filter(
        (permission) =>
          permission.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.actionDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingPermissions.length > 0) {
        filtered[moduleKey] = matchingPermissions;
      }
    });

    return filtered;
  }, [groupedPermissions, searchQuery]);

  // Handle permission toggle
  const handlePermissionToggle = (permissionKey: string) => {
    if (selectedPermissionKeys.includes(permissionKey)) {
      onChange(selectedPermissionKeys.filter((key) => key !== permissionKey));
    } else {
      onChange([...selectedPermissionKeys, permissionKey]);
    }
  };

  // Handle module toggle (select/deselect all permissions in module)
  const handleModuleToggle = (moduleKey: string, checked: boolean) => {
    const modulePermissions = groupedPermissions[moduleKey] || [];
    const modulePermissionKeys = modulePermissions.map((p) => p.key);

    if (checked) {
      // Add all module permissions
      const newSelected = [...selectedPermissionKeys];
      modulePermissionKeys.forEach((key) => {
        if (!newSelected.includes(key)) {
          newSelected.push(key);
        }
      });
      onChange(newSelected);
    } else {
      // Remove all module permissions
      onChange(selectedPermissionKeys.filter((key) => !modulePermissionKeys.includes(key)));
    }
  };

  // Check if all permissions in a module are selected
  const isModuleFullySelected = (moduleKey: string): boolean => {
    const modulePermissions = groupedPermissions[moduleKey] || [];
    return modulePermissions.every((p) => selectedPermissionKeys.includes(p.key));
  };

  // Check if some permissions in a module are selected
  const isModulePartiallySelected = (moduleKey: string): boolean => {
    const modulePermissions = groupedPermissions[moduleKey] || [];
    const selectedCount = modulePermissions.filter((p) =>
      selectedPermissionKeys.includes(p.key)
    ).length;
    return selectedCount > 0 && selectedCount < modulePermissions.length;
  };

  // Quick actions
  const handleSelectAll = () => {
    onChange(permissions.map((p) => p.key));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const handleSelectViewOnly = () => {
    const viewPermissions = permissions.filter((p) => p.action === 'view').map((p) => p.key);
    onChange(viewPermissions);
  };

  // Get module name
  const getModuleName = (moduleKey: string) => {
    const module = modules.find((m) => m.key === moduleKey);
    return module?.name || moduleKey;
  };

  return (
    <Stack gap="md">
      {/* Error Alert */}
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {error}
        </Alert>
      )}

      {/* Search and Quick Actions */}
      <Paper withBorder p="md">
        <Stack gap="md">
          <TextInput
            placeholder="Search permissions..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />

          <Group gap="xs">
            <Button size="xs" variant="light" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button size="xs" variant="light" onClick={handleDeselectAll}>
              Deselect All
            </Button>
            <Button size="xs" variant="light" onClick={handleSelectViewOnly}>
              View Only
            </Button>
            <Badge size="lg" variant="filled">
              {selectedPermissionKeys.length} selected
            </Badge>
          </Group>
        </Stack>
      </Paper>

      {/* Permission Accordion */}
      <Accordion variant="separated" multiple>
        {Object.entries(modulesByCategory).map(([category, categoryModules]) => {
          // Filter modules that have matching permissions
          const visibleModules = categoryModules.filter(
            (module) => filteredGroupedPermissions[module.key]
          );

          if (visibleModules.length === 0) return null;

          return (
            <div key={category}>
              <Text size="sm" fw={600} c="dimmed" tt="uppercase" mb="xs" mt="md">
                {category}
              </Text>

              {visibleModules.map((module) => {
                const modulePermissions = filteredGroupedPermissions[module.key] || [];
                const isFullySelected = isModuleFullySelected(module.key);
                const isPartiallySelected = isModulePartiallySelected(module.key);
                const selectedCount = modulePermissions.filter((p) =>
                  selectedPermissionKeys.includes(p.key)
                ).length;

                return (
                  <Accordion.Item key={module.key} value={module.key}>
                    <Accordion.Control>
                      <Group justify="space-between" wrap="nowrap">
                        <Group>
                          <Checkbox
                            checked={isFullySelected}
                            indeterminate={isPartiallySelected}
                            onChange={(e) =>
                              handleModuleToggle(module.key, e.currentTarget.checked)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <Text fw={600}>{module.name}</Text>
                            <Text size="xs" c="dimmed">
                              {module.description}
                            </Text>
                          </div>
                        </Group>
                        <Badge size="sm" variant="light">
                          {selectedCount}/{modulePermissions.length}
                        </Badge>
                      </Group>
                    </Accordion.Control>

                    <Accordion.Panel>
                      <Stack gap="xs">
                        {modulePermissions.map((permission) => (
                          <Paper key={permission.id} p="sm" withBorder>
                            <Group justify="space-between" wrap="nowrap">
                              <Checkbox
                                checked={selectedPermissionKeys.includes(permission.key)}
                                onChange={() => handlePermissionToggle(permission.key)}
                                label={
                                  <div>
                                    <Group gap="xs">
                                      <Text size="sm" fw={500}>
                                        {permission.actionDisplayName}
                                      </Text>
                                      <RiskLevelIndicator
                                        level={permission.riskLevel}
                                        showLabel={false}
                                        size="xs"
                                      />
                                    </Group>
                                    <Text size="xs" c="dimmed">
                                      {permission.description}
                                    </Text>
                                    <Text size="xs" c="dimmed" mt={4}>
                                      Key: {permission.key}
                                    </Text>
                                  </div>
                                }
                              />
                            </Group>
                          </Paper>
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </div>
          );
        })}
      </Accordion>

      {/* No Results */}
      {Object.keys(filteredGroupedPermissions).length === 0 && (
        <Paper withBorder p="xl" style={{ textAlign: 'center' }}>
          <Text c="dimmed">No permissions found matching your search</Text>
        </Paper>
      )}
    </Stack>
  );
};
