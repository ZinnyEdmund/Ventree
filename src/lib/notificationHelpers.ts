import { NotificationType } from '../types/general';
import type { NotificationDisplay } from '../types/general';

export const getNotificationDisplay = (type: NotificationType): NotificationDisplay => {
  switch (type) {
    case NotificationType.LOW_STOCK:
      return {
        icon: "ic:outline-trending-down",
        title: "Low Stock Alert", 
        color: "orange"
      };
    case NotificationType.OUT_OF_STOCK:
      return {
        icon: "ic:outline-remove-shopping-cart",
        title: "Out of Stock",
        color: "red"
      };
    case NotificationType.SALE_COMPLETED:
      return {
        icon: "ic:outline-playlist-add", 
        title: "Sale Completed",
        color: "green"
      };
    default:
      return {
        icon: "ic:outline-notifications",
        title: "Notification",
        color: "blue"
      };
  }
};

export const formatNotificationTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export const canShowBrowserNotification = (): boolean => {
  return typeof Notification !== 'undefined' && Notification.permission === 'granted';
};

// TODO: should probably ask for permission somewhere in settings
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof Notification === 'undefined') return false;
  
  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return Notification.permission === 'granted';
};