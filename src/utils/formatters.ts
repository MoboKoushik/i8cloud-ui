/**
 * Formatter Utilities
 *
 * Functions for formatting data for display
 */

/**
 * Format date to locale string
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return 'Never';

  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) return 'Never';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  } catch {
    return dateString;
  }
};

/**
 * Format user status for display
 */
export const formatUserStatus = (status: 'active' | 'inactive' | 'suspended'): string => {
  const statusMap = {
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
  };
  return statusMap[status] || status;
};

/**
 * Get color for user status badge
 */
export const getUserStatusColor = (
  status: 'active' | 'inactive' | 'suspended'
): string => {
  const colorMap = {
    active: 'green',
    inactive: 'gray',
    suspended: 'red',
  };
  return colorMap[status] || 'gray';
};

/**
 * Format risk level for display
 */
export const formatRiskLevel = (
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
): string => {
  const riskMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return riskMap[riskLevel] || riskLevel;
};

/**
 * Get color for risk level badge
 */
export const getRiskLevelColor = (
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
): string => {
  const colorMap = {
    low: 'blue',
    medium: 'yellow',
    high: 'orange',
    critical: 'red',
  };
  return colorMap[riskLevel] || 'gray';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert snake_case to Title Case
 */
export const snakeToTitle = (str: string): string => {
  if (!str) return '';
  return str
    .split('_')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format permission count
 */
export const formatPermissionCount = (count: number): string => {
  return `${count} permission${count !== 1 ? 's' : ''}`;
};

/**
 * Format user count
 */
export const formatUserCount = (count: number): string => {
  return `${count} user${count !== 1 ? 's' : ''}`;
};

/**
 * Get initials from full name
 */
export const getInitials = (fullName: string): string => {
  if (!fullName) return '?';

  const parts = fullName.split(' ').filter((part) => part.length > 0);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate avatar color from name (consistent color for same name)
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    'red',
    'pink',
    'grape',
    'violet',
    'indigo',
    'blue',
    'cyan',
    'teal',
    'green',
    'lime',
    'yellow',
    'orange',
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Format boolean as Yes/No
 */
export const formatBoolean = (value: boolean): string => {
  return value ? 'Yes' : 'No';
};

/**
 * Format audit action for display
 */
export const formatAuditAction = (
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'role_change'
): string => {
  const actionMap = {
    create: 'Created',
    update: 'Updated',
    delete: 'Deleted',
    login: 'Logged In',
    logout: 'Logged Out',
    role_change: 'Role Changed',
  };
  return actionMap[action] || action;
};

/**
 * Get color for audit action
 */
export const getAuditActionColor = (
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'role_change'
): string => {
  const colorMap = {
    create: 'green',
    update: 'blue',
    delete: 'red',
    login: 'cyan',
    logout: 'gray',
    role_change: 'orange',
  };
  return colorMap[action] || 'gray';
};

/**
 * Generate role key from role name
 * Converts "Regional Manager" to "regional_manager"
 */
export const generateRoleKey = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

/**
 * Generate permission subject from module name
 * Converts "Product Management" → "Product"
 * Removes common suffixes like "Management", "Module", "System"
 */
export const generatePermissionSubject = (moduleName: string): string => {
  if (!moduleName) return '';

  // Remove common suffixes
  const cleaned = moduleName
    .replace(/\s*(Management|Module|System)\s*$/i, '')
    .trim();

  return cleaned || moduleName;
};

/**
 * Generate UUID for permissions
 * Uses sequential pattern for development (timestamp + random)
 */
export const generatePermissionUUID = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `perm-${timestamp}-${random}`;
};
