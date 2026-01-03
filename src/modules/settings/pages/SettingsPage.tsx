import { useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  Group,
  Text,
  ColorInput,
  Button,
  SegmentedControl,
  Divider,
  Grid,
  Box,
  Badge,
  Switch,
} from '@mantine/core';
import { IconPalette, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useTheme } from '@/contexts/ThemeContext';
import { notifications } from '@mantine/notifications';

const SettingsPage = () => {
  const { theme, updateTheme, resetTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState(theme);

  const handleColorChange = (key: keyof typeof localTheme, value: string) => {
    setLocalTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateTheme(localTheme);
    notifications.show({
      title: 'Settings Saved',
      message: 'Your theme settings have been updated successfully',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
  };

  const handleReset = () => {
    resetTheme();
    setLocalTheme({
      sidebarColor: '#1864ab',
      sidebarTextColor: '#ffffff',
      primaryColor: '#1971c2',
      accentColor: '#51cf66',
      sidebarStyle: 'gradient',
    });
    notifications.show({
      title: 'Settings Reset',
      message: 'Theme settings have been reset to default',
      color: 'blue',
      icon: <IconRefresh size={16} />,
    });
  };

  const presetThemes = [
    {
      name: 'Default Blue',
      sidebarColor: '#1864ab',
      sidebarTextColor: '#ffffff',
      primaryColor: '#1971c2',
      accentColor: '#51cf66',
      sidebarStyle: 'gradient' as const,
    },
    {
      name: 'Dark Purple',
      sidebarColor: '#5f3dc4',
      sidebarTextColor: '#ffffff',
      primaryColor: '#7950f2',
      accentColor: '#ff6b6b',
      sidebarStyle: 'gradient' as const,
    },
    {
      name: 'Emerald Green',
      sidebarColor: '#087f5b',
      sidebarTextColor: '#ffffff',
      primaryColor: '#12b886',
      accentColor: '#ffd43b',
      sidebarStyle: 'gradient' as const,
    },
    {
      name: 'Ocean Teal',
      sidebarColor: '#0c8599',
      sidebarTextColor: '#ffffff',
      primaryColor: '#15aabf',
      accentColor: '#fab005',
      sidebarStyle: 'gradient' as const,
    },
    {
      name: 'Sunset Orange',
      sidebarColor: '#d9480f',
      sidebarTextColor: '#ffffff',
      primaryColor: '#fd7e14',
      accentColor: '#ffd43b',
      sidebarStyle: 'gradient' as const,
    },
    {
      name: 'Royal Indigo',
      sidebarColor: '#364fc7',
      sidebarTextColor: '#ffffff',
      primaryColor: '#4c6ef5',
      accentColor: '#ff6b6b',
      sidebarStyle: 'gradient' as const,
    },
  ];

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setLocalTheme(preset);
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={2} c={localTheme.primaryColor} style={{ textAlign: 'left' }}>
            Settings
          </Title>
          <Group>
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="light"
              color="gray"
              onClick={handleReset}
            >
              Reset to Default
            </Button>
            <Button
              leftSection={<IconCheck size={16} />}
              variant="filled"
              color="blue"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Group>
        </Group>

        {/* Theme Customization Section */}
        <Paper p="lg" radius="md" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <Group gap="xs" mb="lg">
            <IconPalette size={24} color={localTheme.primaryColor} />
            <Title order={3} size="h4">
              Theme Customization
            </Title>
          </Group>

          <Divider mb="lg" />

          {/* Preset Themes */}
          <Box mb="xl">
            <Text size="sm" fw={600} mb="md">
              Preset Themes
            </Text>
            <Grid gutter="md">
              {presetThemes.map((preset) => (
                <Grid.Col key={preset.name} span={{ base: 12, sm: 6, md: 4 }}>
                  <Paper
                    p="md"
                    radius="md"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      borderColor:
                        localTheme.sidebarColor === preset.sidebarColor &&
                        localTheme.primaryColor === preset.primaryColor
                          ? localTheme.primaryColor
                          : '#dee2e6',
                      borderWidth: 2,
                    }}
                    onClick={() => applyPreset(preset)}
                  >
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="sm" fw={600}>
                          {preset.name}
                        </Text>
                        {localTheme.sidebarColor === preset.sidebarColor &&
                          localTheme.primaryColor === preset.primaryColor && (
                            <Badge size="sm" color="blue">
                              Active
                            </Badge>
                          )}
                      </Group>
                      <Group gap="xs">
                        <Box
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 4,
                            background:
                              preset.sidebarStyle === 'gradient'
                                ? `linear-gradient(135deg, ${preset.sidebarColor} 0%, ${preset.primaryColor} 100%)`
                                : preset.sidebarColor,
                          }}
                        />
                        <Box
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 4,
                            backgroundColor: preset.primaryColor,
                          }}
                        />
                        <Box
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 4,
                            backgroundColor: preset.accentColor,
                          }}
                        />
                      </Group>
                    </Stack>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Box>

          <Divider mb="lg" />

          {/* Custom Colors */}
          <Box mb="xl">
            <Text size="sm" fw={600} mb="md">
              Custom Colors
            </Text>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <ColorInput
                  label="Sidebar Color"
                  description="Main sidebar background"
                  value={localTheme.sidebarColor}
                  onChange={(value) => handleColorChange('sidebarColor', value)}
                  format="hex"
                  swatches={[
                    '#1864ab',
                    '#5f3dc4',
                    '#087f5b',
                    '#0c8599',
                    '#d9480f',
                    '#364fc7',
                    '#862e9c',
                    '#c92a2a',
                  ]}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <ColorInput
                  label="Sidebar Text Color"
                  description="Text color in sidebar"
                  value={localTheme.sidebarTextColor}
                  onChange={(value) => handleColorChange('sidebarTextColor', value)}
                  format="hex"
                  swatches={['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#212529']}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <ColorInput
                  label="Primary Color"
                  description="Main theme color"
                  value={localTheme.primaryColor}
                  onChange={(value) => handleColorChange('primaryColor', value)}
                  format="hex"
                  swatches={[
                    '#1971c2',
                    '#7950f2',
                    '#12b886',
                    '#15aabf',
                    '#fd7e14',
                    '#4c6ef5',
                    '#ae3ec9',
                    '#f03e3e',
                  ]}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <ColorInput
                  label="Accent Color"
                  description="Secondary highlights"
                  value={localTheme.accentColor}
                  onChange={(value) => handleColorChange('accentColor', value)}
                  format="hex"
                  swatches={[
                    '#51cf66',
                    '#ff6b6b',
                    '#ffd43b',
                    '#fab005',
                    '#ff8787',
                    '#94d82d',
                    '#4dabf7',
                    '#ff922b',
                  ]}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Divider mb="lg" />

          {/* Sidebar Style */}
          <Box mb="md">
            <Text size="sm" fw={600} mb="md">
              Sidebar Style
            </Text>
            <SegmentedControl
              value={localTheme.sidebarStyle}
              onChange={(value) =>
                handleColorChange('sidebarStyle', value as 'solid' | 'gradient')
              }
              data={[
                { label: 'Solid Color', value: 'solid' },
                { label: 'Gradient', value: 'gradient' },
              ]}
            />
          </Box>

          {/* Preview */}
          <Box mt="xl">
            <Text size="sm" fw={600} mb="md">
              Preview
            </Text>
            <Paper
              p="lg"
              radius="md"
              style={{
                background:
                  localTheme.sidebarStyle === 'gradient'
                    ? `linear-gradient(135deg, ${localTheme.sidebarColor} 0%, ${localTheme.primaryColor} 100%)`
                    : localTheme.sidebarColor,
              }}
            >
              <Stack gap="md">
                <Text size="lg" fw={700} c={localTheme.sidebarTextColor}>
                  Sidebar Preview
                </Text>
                <Group gap="sm">
                  <Badge variant="filled" color={localTheme.primaryColor}>
                    Primary Badge
                  </Badge>
                  <Badge variant="filled" color={localTheme.accentColor}>
                    Accent Badge
                  </Badge>
                </Group>
                <Text size="sm" c={localTheme.sidebarTextColor}>
                  This is how your sidebar will look with the selected colors and style.
                </Text>
              </Stack>
            </Paper>
          </Box>
        </Paper>

        {/* Additional Settings Sections */}
        <Paper p="lg" radius="md" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <Title order={3} size="h4" mb="lg">
            Notification Settings
          </Title>
          <Stack gap="md">
            <Group justify="space-between">
              <Box>
                <Text size="sm" fw={600}>
                  Email Notifications
                </Text>
                <Text size="xs" c="dimmed">
                  Receive email notifications for important updates
                </Text>
              </Box>
              <Switch defaultChecked />
            </Group>
            <Group justify="space-between">
              <Box>
                <Text size="sm" fw={600}>
                  Desktop Notifications
                </Text>
                <Text size="xs" c="dimmed">
                  Show desktop notifications for real-time events
                </Text>
              </Box>
              <Switch defaultChecked />
            </Group>
            <Group justify="space-between">
              <Box>
                <Text size="sm" fw={600}>
                  Security Alerts
                </Text>
                <Text size="xs" c="dimmed">
                  Get notified about security-related events
                </Text>
              </Box>
              <Switch defaultChecked />
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SettingsPage;
