/**
 * Common Types & Interfaces
 */

/**
 * Standardized API/Service Response Format
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface FilterState {
  searchTerm: string;
  [key: string]: string | string[] | number | boolean;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

export interface Notification {
  id: string;
  type: StatusType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  reason?: any;
  changes?: any;
  entityType: string;
  entityName: any;
  username?: any;
  id: string;
  timestamp: string;
  userId: string;
  userName?: string;
  action: string;
  resource?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  entityId?: string;
}
