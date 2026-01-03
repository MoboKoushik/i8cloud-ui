/**
 * Module Types for Dynamic Module Registration
 *
 * Modules define the available features in the system
 */

export interface Module {
  id: string;
  key: string; // Machine-readable key, e.g., "security_groups"
  name: string; // Display name, e.g., "Security Groups"
  description: string;
  icon: string; // Icon name from @tabler/icons-react, e.g., "IconShield"
  route: string; // Base route path, e.g., "/security-groups"
  category: string; // Grouping category, e.g., "Security", "Audit", "Reports"
  order: number; // Display order in navigation
  isActive: boolean; // Module can be enabled/disabled
  availableActions: string[]; // Actions available for this module, e.g., ["view", "edit", "delete"]
}

export type ModuleCategory = 'Security' | 'Audit' | 'Integration' | 'Compliance' | 'Reports' | 'Administration';

export interface ModuleAction {
  key: string; // e.g., "view", "edit", "delete"
  displayName: string; // e.g., "View", "Edit", "Delete"
  description: string;
}
