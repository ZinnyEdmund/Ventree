import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { INotification, NotificationState } from '../../types/general';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  connectionError: null,
  lastUpdated: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null; // clear error when connected
      }
    },
    
    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
      if (action.payload) {
        state.isConnected = false;
      }
    },

    addNotification: (state, action: PayloadAction<INotification>) => {
      const notification = action.payload;
      
      // check for dupes - backend might send same notif twice sometimes
      const existingIndex = state.notifications.findIndex(n => n._id === notification._id);
      
      if (existingIndex === -1) {
        state.notifications.unshift(notification); // newest first
        
        if (!notification.isRead) {
          state.unreadCount += 1;
        }
        
        state.lastUpdated = new Date().toISOString();
      }
    },

    // bulk load from API
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
      state.lastUpdated = new Date().toISOString();
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n._id === notificationId);
      
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.isRead) {
          notification.isRead = true;
        }
      });
      state.unreadCount = 0;
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const index = state.notifications.findIndex(n => n._id === notificationId);
      
      if (index !== -1) {
        const notification = state.notifications[index];
        
        // update count if we're removing unread
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        
        state.notifications.splice(index, 1);
      }
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.lastUpdated = new Date().toISOString();
    },

    // for optimistic updates
    updateNotification: (state, action: PayloadAction<{id: string; updates: Partial<INotification>}>) => {
      const { id, updates } = action.payload;
      const notification = state.notifications.find(n => n._id === id);
      
      if (notification) {
        Object.assign(notification, updates);
        
        // recalc if read status changed
        if ('isRead' in updates) {
          state.unreadCount = state.notifications.filter(n => !n.isRead).length;
        }
      }
    },

    resetNotificationState: () => initialState
  }
});

export const {
  setConnectionStatus,
  setConnectionError,
  addNotification,
  setNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  updateNotification,
  resetNotificationState
} = notificationSlice.actions;

export default notificationSlice.reducer;

// selectors - saves typing these everywhere
export const selectNotifications = (state: { notifications: NotificationState }) => 
  state.notifications.notifications;

export const selectUnreadNotifications = (state: { notifications: NotificationState }) => 
  state.notifications.notifications.filter(n => !n.isRead);

export const selectUnreadCount = (state: { notifications: NotificationState }) => 
  state.notifications.unreadCount;

export const selectConnectionStatus = (state: { notifications: NotificationState }) => 
  state.notifications.isConnected;

export const selectConnectionError = (state: { notifications: NotificationState }) => 
  state.notifications.connectionError;

export const selectRecentNotifications = (limit: number = 5) => 
  (state: { notifications: NotificationState }) => 
    state.notifications.notifications.slice(0, limit);