/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

import authReducer from './slices/authSlice';
import permissionsReducer from './slices/permissionsSlice';
import uiReducer from './slices/uiSlice';

// Persist config for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'role', 'isAuthenticated', 'expiresAt'], // Only persist these fields
};

// Persist config for UI preferences
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['sidebarCollapsed'], // Only persist sidebar state
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    permissions: permissionsReducer, // DO NOT persist permissions - fetch fresh on each session
    ui: persistReducer(uiPersistConfig, uiReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
