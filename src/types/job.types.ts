export type JobStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'ABORTED';

export interface IntegrationJob {
  id: string;
  name: string;
  description?: string;
  status: JobStatus;
  startTime: string;
  endTime?: string;
  estimatedEndTime?: string; // ETA - This will be updated on refresh
  progress: number; // 0-100
  currentStep?: string;
  totalSteps?: number;
  completedSteps?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  jobs: IntegrationJob[];
  total: number;
  page: number;
  pageSize: number;
}

export interface JobStats {
  total: number;
  running: number;
  pending: number;
  success: number;
  failed: number;
}
