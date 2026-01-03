import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// Import all reducers
import authReducer from './slices/authSlice';
import permissionsReducer from './slices/permissionsSlice';
import uiReducer from './slices/uiSlice';
import jobsReducer from '../features/jobs/jobsSlice';

// Import middleware
import { authMiddleware } from './middleware/authMiddleware';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  permissions: permissionsReducer,
  ui: uiReducer,
  jobs: jobsReducer,
});

// Redux Persist Configuration
const persistConfig = {
  key: 'i8cloud-root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui state
  blacklist: ['permissions', 'jobs'], // Don't persist permissions (security) or jobs (always fetch fresh)
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authMiddleware),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
