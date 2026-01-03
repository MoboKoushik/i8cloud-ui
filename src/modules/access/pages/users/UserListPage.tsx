import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Table,
  ActionIcon,
  Badge,
  Paper,
  Switch,
  Modal,
  Text,
  Stack,
  Avatar,
} from "@mantine/core";
import { IconSearch, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getUsers, getRoles, deleteUser, updateUser } from "@/services/dataManager";
import { notifications } from "@mantine/notifications";

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  fullName: string;
  roleId: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

const UserListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(getUsers());
    setRoles(getRoles());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleName = (roleId: string) => {
    // Convert old format to new format
    const roleMapping: Record<string, string> = {
      role_001: "role-001",
      role_002: "role-002",
      role_003: "role-003",
      role_004: "role-004",
      role_005: "role-002",
      role_006: "role-002",
    };

    const mappedRoleId = roleMapping[roleId] || roleId;
    const role = roles.find((r) => r.uuid === mappedRoleId);
    return role?.name || "Unknown Role";
  };

  const handleStatusChange = (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      updateUser(id, { status: newStatus });
      loadData();
      notifications.show({
        title: "Success",
        message: "User status updated successfully",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update user status",
        color: "red",
      });
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpened(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      try {
        deleteUser(selectedUser.id);
        loadData();
        notifications.show({
          title: "Success",
          message: "User deleted successfully",
          color: "green",
        });
      } catch (error: any) {
        notifications.show({
          title: "Error",
          message: error.message || "Failed to delete user",
          color: "red",
        });
      }
    }
    setDeleteModalOpened(false);
    setSelectedUser(null);
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box p="lg">
      <Container fluid>
        <Group justify="space-between" mb="xl">
          <Title order={2} style={{ color: "#212529" }}>
            User Management
          </Title>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => navigate("/app/access/users/create")}
            style={{ backgroundColor: "#228be6" }}
          >
            Add User
          </Button>
        </Group>

        <Paper p="md" style={{ backgroundColor: "#ffffff", borderRadius: 8 }}>
          <Group mb="md">
            <TextInput
              placeholder="Search users..."
              leftSection={<IconSearch size={18} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              style={{ flex: 1 }}
            />
          </Group>

          <Table
            striped
            highlightOnHover
            withTableBorder
            styles={{
              th: {
                backgroundColor: "#1971c2",
                color: "#ffffff",
                fontWeight: 600,
                padding: "12px 16px",
              },
              td: {
                padding: "12px 16px",
              },
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>User</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th style={{ width: 150, textAlign: "center" }}>
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredUsers.length === 0 ? (
                <Table.Tr>
                  <Table.Td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: "#868e96",
                    }}
                  >
                    No users found
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredUsers.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar color="blue" radius="xl" size="sm">
                          {getInitials(user.fullName)}
                        </Avatar>
                        <Text fw={500} style={{ color: "#212529" }}>
                          {user.fullName}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td style={{ color: "#495057" }}>
                      {user.email}
                    </Table.Td>
                    <Table.Td style={{ color: "#495057" }}>
                      {user.username}
                    </Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light">
                        {getRoleName(user.roleId)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Switch
                        checked={user.status === "active"}
                        onChange={() =>
                          handleStatusChange(user.id, user.status)
                        }
                        color="green"
                        size="md"
                        label={user.status === "active" ? "Active" : "Inactive"}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="center">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() =>
                            navigate(`/app/access/users/edit/${user.id}`)
                          }
                        >
                          <IconEdit size={18} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
          setSelectedUser(null);
        }}
        title="Delete User"
        centered
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 1,
        }}
        styles={{
          title: {
            color: "#212529",
            fontWeight: 600,
            fontSize: 18,
          },
          inner: {
            top: 0,
            left: 0,
          },
        }}
      >
        <Stack gap="md">
          <Text size="sm" c="#495057">
            Are you sure you want to delete the user{" "}
            <strong>{selectedUser?.fullName}</strong>? This action cannot be
            undone.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              onClick={() => {
                setDeleteModalOpened(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default UserListPage;
