/**
 * UI Slice - UI State Management
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '../../types';

interface UIState {
  sidebarCollapsed: boolean;
  activeModule: string | null;
  modals: {
    [key: string]: {
      isOpen: boolean;
      data?: unknown;
    };
  };
  notifications: Notification[];
  loading: {
    [key: string]: boolean;
  };
}

const initialState: UIState = {
  sidebarCollapsed: false,
  activeModule: null,
  modals: {},
  notifications: [],
  loading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setActiveModule: (state, action: PayloadAction<string>) => {
      state.activeModule = action.payload;
    },
    openModal: (state, action: PayloadAction<{ id: string; data?: unknown }>) => {
      state.modals[action.payload.id] = {
        isOpen: true,
        data: action.payload.data,
      };
    },
    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].isOpen = false;
      }
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setActiveModule,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
