import type { IntegrationJob, JobStats } from '../types/job.types';

// API base URL - should be from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Fetch all jobs with current ETA information
 * This will be called on page load and manual refresh
 */
export const fetchJobs = async (): Promise<IntegrationJob[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const data = await response.json();
    return data.jobs || data; // Handle different response formats
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Fetch job statistics
 */
export const fetchJobStats = async (): Promise<JobStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job stats: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching job stats:', error);
    throw error;
  }
};

/**
 * Fetch a single job by ID with updated ETA
 */
export const fetchJobById = async (jobId: string): Promise<IntegrationJob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};
