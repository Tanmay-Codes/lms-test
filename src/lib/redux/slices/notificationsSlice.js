import { createSlice } from '@reduxjs/toolkit';
import { notifications as initialNotifications } from '../../dummyData';

const initialState = {
  notifications: [...initialNotifications],
  loading: false,
  error: null,
  unreadCount: initialNotifications.filter(n => !n.read).length,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action) => {
      state.notifications = action.payload;
      state.loading = false;
      state.error = null;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
    fetchNotificationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addNotification: (state, action) => {
      const newNotification = {
        ...action.payload,
        id: Math.max(...state.notifications.map(n => n.id), 0) + 1,
        date: action.payload.date || new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(newNotification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1 && !state.notifications[index].read) {
        state.notifications[index].read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state, action) => {
      // If userId is provided, mark only that user's notifications as read
      if (action.payload) {
        state.notifications.forEach(notification => {
          if (notification.userId === action.payload && !notification.read) {
            notification.read = true;
          }
        });
      } else {
        // Mark all notifications as read
        state.notifications.forEach(notification => {
          notification.read = true;
        });
      }
      // Recalculate unread count
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },
    deleteNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        // Adjust unread count if deleting an unread notification
        if (!state.notifications[index].read) {
          state.unreadCount -= 1;
        }
        // Remove the notification
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      }
    },
    clearAllNotifications: (state, action) => {
      // If userId is provided, clear only that user's notifications
      if (action.payload) {
        state.notifications = state.notifications.filter(n => n.userId !== action.payload);
      } else {
        state.notifications = [];
      }
      // Recalculate unread count
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },
  },
});

// Export actions
export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

// Selectors
export const selectAllNotifications = (state) => state.notifications.notifications;
export const selectNotificationById = (state, notificationId) => 
  state.notifications.notifications.find(n => n.id === notificationId);
export const selectNotificationsByUser = (state, userId) => 
  state.notifications.notifications.filter(n => n.userId === userId);
export const selectUnreadNotifications = (state, userId) => 
  state.notifications.notifications.filter(n => n.userId === userId && !n.read);
export const selectUnreadCount = (state, userId) => 
  userId 
    ? state.notifications.notifications.filter(n => n.userId === userId && !n.read).length
    : state.notifications.unreadCount;

// Export reducer
export default notificationsSlice.reducer; 