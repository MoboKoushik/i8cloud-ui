/**
 * RoleTable Component
 *
 * Displays roles in a table with actions
 */

import { useState } from 'react';
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  Menu,
  rem,
  Badge,
} from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconCopy,
  IconTrash,
  IconDotsVertical,
  IconPower,
  IconCircleX,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../types';
import { StatusBadge } from '../atoms/StatusBadge';
import { RoleBadge } from '../atoms/RoleBadge';
import { formatDate } from '../../utils/formatters';
import { EmptyState } from '../atoms/EmptyState';

interface RoleTableProps {
  roles: Role[];
  onEdit?: (role: Role) => void;
  onView?: (role: Role) => void;
  onDuplicate?: (role: Role) => void;
  onDelete?: (role: Role) => void;
  onToggleStatus?: (role: Role) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
  onToggleStatus,
  canEdit = false,
  canDelete = false,
  canCreate = false,
}) => {
  const navigate = useNavigate();

  if (roles.length === 0) {
    return (
      <EmptyState
        title="No roles found"
        description="Try adjusting your search or filter criteria"
      />
    );
  }

  const rows = roles.map((role) => (
    <Table.Tr key={role.id}>
      {/* Role Name */}
      <Table.Td>
        <RoleBadge role={role} />
      </Table.Td>

      {/* Description */}
      <Table.Td>
        <Text size="sm" lineClamp={2} c="dimmed">
          {role.description}
        </Text>
      </Table.Td>

      {/* Permissions Count */}
      <Table.Td>
        <Badge variant="light" color="blue">
          {role.permissions.length} permissions
        </Badge>
      </Table.Td>

      {/* Status */}
      <Table.Td>
        <StatusBadge status={role.isActive ? 'active' : 'inactive'} />
      </Table.Td>

      {/* Created Date */}
      <Table.Td>
        <Text size="sm" c="dimmed">
          {formatDate(role.createdAt)}
        </Text>
      </Table.Td>

      {/* Actions */}
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          {/* View Button */}
          <Tooltip label="View Details">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => onView?.(role)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>

          {/* Edit Button */}
          {canEdit && (
            <Tooltip label="Edit Role">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => onEdit?.(role)}
              >
                <IconEdit size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          {/* More Actions Menu */}
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Actions</Menu.Label>

              <Menu.Item
                leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => onView?.(role)}
              >
                View Details
              </Menu.Item>

              {canEdit && (
                <Menu.Item
                  leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                  onClick={() => onEdit?.(role)}
                >
                  Edit Role
                </Menu.Item>
              )}

              {canCreate && (
                <Menu.Item
                  leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}
                  onClick={() => onDuplicate?.(role)}
                >
                  Duplicate Role
                </Menu.Item>
              )}

              {canEdit && (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={
                      role.isActive ? (
                        <IconCircleX style={{ width: rem(14), height: rem(14) }} />
                      ) : (
                        <IconPower style={{ width: rem(14), height: rem(14) }} />
                      )
                    }
                    onClick={() => onToggleStatus?.(role)}
                  >
                    {role.isActive ? 'Deactivate' : 'Activate'}
                  </Menu.Item>
                </>
              )}

              {canDelete && !role.isSystem && (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => onDelete?.(role)}
                  >
                    Delete Role
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table striped highlightOnHover verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Role Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Permissions</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
