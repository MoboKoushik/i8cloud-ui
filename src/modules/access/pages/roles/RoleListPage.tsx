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
} from "@mantine/core";
import { IconSearch, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getRoles, deleteRole, updateRole } from "@/services/dataManager";
import { notifications } from "@mantine/notifications";

interface Role {
  uuid: string;
  name: string;
  description: string;
  is_admin: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const RoleListPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRoles(getRoles());
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (uuid: string, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      updateRole(uuid, { is_active: newStatus });
      loadData();
      notifications.show({
        title: "Success",
        message: "Role status updated successfully",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update role status",
        color: "red",
      });
    }
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpened(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRole) {
      try {
        deleteRole(selectedRole.uuid);
        loadData();
        notifications.show({
          title: "Success",
          message: "Role deleted successfully",
          color: "green",
        });
      } catch (error: any) {
        notifications.show({
          title: "Error",
          message: error.message || "Failed to delete role",
          color: "red",
        });
      }
    }
    setDeleteModalOpened(false);
    setSelectedRole(null);
  };

  return (
    <Box p="lg">
      <Container fluid>
        <Group justify="space-between" mb="xl">
          <Title order={2} style={{ color: "#212529" }}>
            Role Management
          </Title>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => navigate("/app/access/roles/create")}
            style={{ backgroundColor: "#228be6" }}
          >
            Add Role
          </Button>
        </Group>

        <Paper p="md" style={{ backgroundColor: "#ffffff", borderRadius: 8 }}>
          <Group mb="md">
            <TextInput
              placeholder="Search roles..."
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
                <Table.Th>Name</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th style={{ width: 150, textAlign: "center" }}>
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredRoles.length === 0 ? (
                <Table.Tr>
                  <Table.Td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: "#868e96",
                    }}
                  >
                    No roles found
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredRoles.map((role) => (
                  <Table.Tr key={role.uuid}>
                    <Table.Td style={{ fontWeight: 500, color: "#212529" }}>
                      {role.name}
                    </Table.Td>
                    <Table.Td style={{ color: "#495057" }}>
                      {role.description}
                    </Table.Td>
                    <Table.Td>
                      {role.is_admin === 1 ? (
                        <Badge color="red" variant="light">
                          Admin
                        </Badge>
                      ) : (
                        <Badge color="blue" variant="light">
                          User
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Switch
                        checked={role.is_active === 1}
                        onChange={() =>
                          handleStatusChange(role.uuid, role.is_active)
                        }
                        color="green"
                        size="md"
                        label={role.is_active === 1 ? "Active" : "Inactive"}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="center">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() =>
                            navigate(`/app/access/roles/edit/${role.uuid}`)
                          }
                        >
                          <IconEdit size={18} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteClick(role)}
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
          setSelectedRole(null);
        }}
        title="Delete Role"
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
            Are you sure you want to delete the role{" "}
            <strong>{selectedRole?.name}</strong>? This action cannot be undone.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              onClick={() => {
                setDeleteModalOpened(false);
                setSelectedRole(null);
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

export default RoleListPage;
