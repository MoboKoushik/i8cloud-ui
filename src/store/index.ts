/* eslint-disable @typescript-eslint/no-explicit-any */
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
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import permissionsReducer from './slices/permissionsSlice';
import uiReducer from './slices/uiSlice';

// Persist configs (unchanged)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'role', 'isAuthenticated', 'expiresAt'],
};

const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['sidebarCollapsed'],
};

// Explicitly typed root reducer
const rootReducer = {
  auth: persistReducer<any>(authPersistConfig, authReducer),
  permissions: permissionsReducer as typeof permissionsReducer, // preserves original type
  ui: persistReducer<any>(uiPersistConfig, uiReducer),
};

export const store = configureStore({
  reducer: rootReducer,
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