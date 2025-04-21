import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coursesReducer from './slices/coursesSlice';
import schedulesReducer from './slices/schedulesSlice';
import assignmentsReducer from './slices/assignmentsSlice';
import attendanceReducer from './slices/attendanceSlice';
import usersReducer from './slices/usersSlice';
import notificationsReducer from './slices/notificationsSlice';
import discussionsReducer from './slices/discussionsSlice';
import resourcesReducer from './slices/resourcesSlice';
import assessmentsReducer from './slices/assessmentsSlice';
import revenueReducer from './slices/revenueSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    schedules: schedulesReducer,
    assignments: assignmentsReducer,
    attendance: attendanceReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    discussions: discussionsReducer,
    resources: resourcesReducer,
    assessments: assessmentsReducer,
    revenue: revenueReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Utility hooks for type-safe use of Redux with TypeScript
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);

export const RootState = store.getState;
export const AppDispatch = store.dispatch; 