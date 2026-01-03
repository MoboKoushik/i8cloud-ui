import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { IntegrationJob, JobStats } from '../../types/job.types';
import { fetchJobs as fetchJobsAPI, fetchJobStats as fetchJobStatsAPI } from '../../services/jobService';

interface JobsState {
  jobs: IntegrationJob[];
  stats: JobStats | null;
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}

const initialState: JobsState = {
  jobs: [],
  stats: null,
  loading: false,
  error: null,
  lastFetchTime: null,
};

// Async thunk for fetching jobs with ETA
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchJobsAPI();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for fetching job statistics
export const fetchJobStats = createAsyncThunk(
  'jobs/fetchJobStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchJobStatsAPI();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetJobs: (state) => {
      state.jobs = [];
      state.stats = null;
      state.lastFetchTime = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch stats
      .addCase(fetchJobStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchJobStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetJobs } = jobsSlice.actions;
export default jobsSlice.reducer;
