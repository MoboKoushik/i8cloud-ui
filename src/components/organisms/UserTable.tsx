/**
 * UserTable Component
 *
 * Displays users in a table with actions
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
  Avatar,
  Badge,
  Checkbox,
} from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconKey,
  IconCircleX,
  IconPower,
} from '@tabler/icons-react';
import { User, Role } from '../../types';
import { StatusBadge } from '../atoms/StatusBadge';
import { EmptyState } from '../atoms/EmptyState';
import { formatDate, getInitials } from '../../utils/formatters';

interface UserTableProps {
  users: User[];
  roles: Role[];
  selectedUserIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onChangeRole?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canChangeRole?: boolean;
  currentUserId?: string; // Prevent self-modification
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  roles,
  selectedUserIds = [],
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  onChangeRole,
  onToggleStatus,
  canEdit = false,
  canDelete = false,
  canChangeRole = false,
  currentUserId,
}) => {
  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(users.map((u) => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      onSelectionChange?.(selectedUserIds.filter((id) => id !== userId));
    } else {
      onSelectionChange?.([...selectedUserIds, userId]);
    }
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.name || 'Unknown';
  };

  const isSelfModification = (userId: string) => {
    return currentUserId === userId;
  };

  if (users.length === 0) {
    return (
      <EmptyState
        title="No users found"
        description="Try adjusting your search or filter criteria"
      />
    );
  }

  const allSelected = users.length > 0 && selectedUserIds.length === users.length;
  const someSelected = selectedUserIds.length > 0 && selectedUserIds.length < users.length;

  const rows = users.map((user) => {
    const isSelf = isSelfModification(user.id);

    return (
      <Table.Tr
        key={user.id}
        style={{
          opacity: isSelf ? 0.6 : 1,
          backgroundColor: isSelf ? '#f8f9fa' : undefined,
        }}
      >
        {/* Checkbox */}
        {onSelectionChange && (
          <Table.Td>
            <Checkbox
              checked={selectedUserIds.includes(user.id)}
              onChange={() => handleSelectUser(user.id)}
            />
          </Table.Td>
        )}

        {/* Avatar & Name */}
        <Table.Td>
          <Group gap="sm">
            <Avatar color="blue" radius="xl">
              {getInitials(user.fullName)}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {user.fullName}
              </Text>
              <Text size="xs" c="dimmed">
                {user.username}
              </Text>
            </div>
          </Group>
        </Table.Td>

        {/* Email */}
        <Table.Td>
          <Text size="sm">{user.email}</Text>
        </Table.Td>

        {/* Role */}
        <Table.Td>
          <Badge variant="light" color="blue">
            {getRoleName(user.roleId)}
          </Badge>
        </Table.Td>

        {/* Status */}
        <Table.Td>
          <StatusBadge status={user.status} />
        </Table.Td>

        {/* Last Login */}
        <Table.Td>
          <Text size="sm" c="dimmed">
            {formatDate(user.lastLogin)}
          </Text>
        </Table.Td>

        {/* Actions */}
        <Table.Td>
          <Group gap="xs" wrap="nowrap">
            {/* View Button */}
            <Tooltip label="View Details">
              <ActionIcon variant="subtle" color="blue" onClick={() => onView?.(user)}>
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>

            {/* Edit Button */}
            {canEdit && !isSelf && (
              <Tooltip label="Edit User">
                <ActionIcon variant="subtle" color="blue" onClick={() => onEdit?.(user)}>
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
            )}

            {isSelf && (
              <Tooltip label="Cannot modify your own account">
                <ActionIcon variant="subtle" color="gray" disabled>
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
            )}

            {/* More Actions Menu */}
            <Menu shadow="md" width={220} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Actions</Menu.Label>

                <Menu.Item
                  leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                  onClick={() => onView?.(user)}
                >
                  View Details
                </Menu.Item>

                {canEdit && !isSelf && (
                  <Menu.Item
                    leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => onEdit?.(user)}
                  >
                    Edit User
                  </Menu.Item>
                )}

                {canChangeRole && !isSelf && (
                  <Menu.Item
                    leftSection={<IconKey style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => onChangeRole?.(user)}
                  >
                    Change Role
                  </Menu.Item>
                )}

                {canEdit && !isSelf && (
                  <>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={
                        user.status === 'active' ? (
                          <IconCircleX style={{ width: rem(14), height: rem(14) }} />
                        ) : (
                          <IconPower style={{ width: rem(14), height: rem(14) }} />
                        )
                      }
                      onClick={() => onToggleStatus?.(user)}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Menu.Item>
                  </>
                )}

                {canDelete && !isSelf && (
                  <>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => onDelete?.(user)}
                    >
                      Delete User
                    </Menu.Item>
                  </>
                )}

                {isSelf && (
                  <>
                    <Menu.Divider />
                    <Menu.Label c="dimmed">Cannot modify own account</Menu.Label>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth={900}>
      <Table striped highlightOnHover verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            {onSelectionChange && (
              <Table.Th style={{ width: 40 }}>
                <Checkbox checked={allSelected} indeterminate={someSelected} onChange={handleSelectAll} />
              </Table.Th>
            )}
            <Table.Th>User</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Last Login</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
