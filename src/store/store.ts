
import { configureStore } from '@reduxjs/toolkit';
import projectSlice from './slices/projectSlice';
import scenarioSlice from './slices/scenarioSlice';
import testCaseSlice from './slices/testCaseSlice';
import testRunSlice from './slices/testRunSlice';

export const store = configureStore({
  reducer: {
    projects: projectSlice,
    scenarios: scenarioSlice,
    testCases: testCaseSlice,
    testRuns: testRunSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
