import { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { webSocketService } from '../services/websocket.service';
import { 
  useFetchNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllAsReadMutation,
} from '../services/notifications.service';
import { getNotificationDisplay, canShowBrowserNotification } from '../lib/notificationHelpers';
import { markAsRead, resetNotificationState, setNotifications } from '../state/Store/notificationSlice';
import { handleApiError } from '../lib/errorHandler';
import type { RootState, AppDispatch } from '../state/store';
import type { INotification } from '../types/general';

export const useNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { 
    notifications, 
    unreadCount, 
    isConnected, 
    connectionError 
  } = useSelector((state: RootState) => state.notifications);
  
  const hasInitialized = useRef(false);
  
  const { 
    data: notificationsData, 
    error: fetchError, 
    isLoading: isFetchingNotifications,
    refetch: refetchNotifications 
  } = useFetchNotificationsQuery(
    { shopId: user?.shopId ?? '' },
    { 
      skip: !isLoggedIn || !user?.shopId,
      pollingInterval: 60000 // fallback if websocket dies
    }
  );
  
  const [markAsReadMutation] = useMarkNotificationAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllAsReadMutation();

  const handleNewNotification = useCallback((event: CustomEvent<INotification>) => {
    try {
      const notification = event.detail;
      const display = getNotificationDisplay(notification.type);

      // show toast
      toast.info(notification.message, {
        duration: 5000,
        action: {
          label: 'View',
          onClick: () => {
            dispatch(markAsRead(notification._id));
            window.location.href = '/notification';
          }
        }
      });

      // browser notification
      if (canShowBrowserNotification()) {
        const browserNotif = new Notification(display.title, {
          body: notification.message,
          icon: '/images/logo.svg',
          tag: notification._id,
        });

        setTimeout(() => browserNotif.close(), 10000);

        browserNotif.onclick = () => {
          dispatch(markAsRead(notification._id));
          window.focus();
          window.location.href = '/notification';
          browserNotif.close();
        };
      }
      
    } catch (error) {
      console.error('Error handling notification:', error);
      handleApiError(error);
    }
  }, [dispatch]);


  const cleanupWebSocket = useCallback(() => {
    webSocketService.disconnect();
    dispatch(resetNotificationState());
    hasInitialized.current = false;
  }, [dispatch]);

  const handleTokenRefresh = useCallback(() => {
    if (isLoggedIn && user) {
      webSocketService.reconnectWithNewToken();
    }
  }, [isLoggedIn, user]);

  // init websocket - only when needed
  useEffect(() => {
    if (isLoggedIn && user && !webSocketService.isConnected()) {
      webSocketService.connect();
    }
  }, [isLoggedIn, user]);

  // cleanup on logout
  useEffect(() => {
    if (!isLoggedIn || !user) {
      cleanupWebSocket();
    }
  }, [isLoggedIn, user, cleanupWebSocket]);

  // listen for notifications
  useEffect(() => {
    window.addEventListener('newNotification', handleNewNotification as EventListener);
    return () => window.removeEventListener('newNotification', handleNewNotification as EventListener);
  }, [handleNewNotification]);

  // token refresh
  useEffect(() => {
    window.addEventListener('tokenRefreshed', handleTokenRefresh);
    return () => window.removeEventListener('tokenRefreshed', handleTokenRefresh);
  }, [handleTokenRefresh]);

  // only sync API data on first load when we have no notifications
  useEffect(() => {
    if (notificationsData?.success && notificationsData?.data && notifications.length === 0) {
      dispatch(setNotifications(notificationsData.data));
    }
  }, [notificationsData, dispatch, notifications.length]);

  useEffect(() => {
    if (fetchError) {
      handleApiError(fetchError);
    }
  }, [fetchError]);


  return {
    notifications,
    unreadCount,
    isConnected,
    connectionError,
    isFetchingNotifications,
    
    connect: webSocketService.connect.bind(webSocketService),
    disconnect: webSocketService.disconnect.bind(webSocketService),
    ping: webSocketService.ping.bind(webSocketService),
    isWebSocketConnected: webSocketService.isConnected.bind(webSocketService),
    
    markAsRead: async (id: string) => {
      try {
        dispatch(markAsRead(id));
        
        await markAsReadMutation({
          shopId: user?.shopId ?? '',
          notificationId: id,
          isRead: true
        }).unwrap();
        
      } catch (error) {
        handleApiError(error);
      }
    },
    
    markAllAsRead: async () => {
      try {
        await markAllAsReadMutation({
          shopId: user?.shopId ?? ''
        }).unwrap();
        
        refetchNotifications();
        
      } catch (error) {
        handleApiError(error);
      }
    }
  };
};