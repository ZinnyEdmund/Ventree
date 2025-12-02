import { io, Socket } from 'socket.io-client';
import { store } from '../state/store';
import { getAccessTokenCookie, getRefreshTokenCookie } from '../lib/cookies';
import {
  setConnectionStatus,
  setConnectionError,
  addNotification
} from '../state/Store/notificationSlice';
import type { NotificationMessage, ConnectionConfirmation } from '../types/general';

export class WebSocketService {
  private socket: Socket | null = null;
  private reconnectTimeout: number | null = null;
  private isConnecting: boolean = false;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';
    // need to strip /api for socket connection
    this.baseUrl = this.baseUrl.replace('/api', '');
  }

  connect(): void {
    if (this.isConnecting || this.socket?.connected) {
      return;
    }

    // try access token first, fallback to refresh token
    const accessToken = getAccessTokenCookie();
    const refreshToken = getRefreshTokenCookie();
    const token = accessToken || refreshToken;
    
    if (!token) {
      console.error('No auth token available - cannot connect to WebSocket');
      return;
    }

    this.isConnecting = true;
    console.log(`Connecting to ${this.baseUrl}`);

    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(this.baseUrl, {
      path: '/socket.io/notifications',
      auth: { token },
      autoConnect: true,
      reconnection: false, // handle reconnect manually 
      timeout: 10000,
      transports: ['websocket', 'polling']
    });

    this.setupHandlers();
  }

  private setupHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connected', (data: ConnectionConfirmation) => {
      console.log('WebSocket connected:', data);
      store.dispatch(setConnectionStatus(true));
      store.dispatch(setConnectionError(null));
      this.isConnecting = false;
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    });

    this.socket.on('notification', (message: NotificationMessage) => {
      console.log('Got notification:', message.data);
      console.log('Notification structure:', JSON.stringify(message.data, null, 2));
      
      try {
        // add to redux
        console.log('Before dispatch - count:', store.getState().notifications.notifications.length);
        store.dispatch(addNotification(message.data));
        console.log('After dispatch - count:', store.getState().notifications.notifications.length);
        
        // dispatch event for components  
        window.dispatchEvent(new CustomEvent('newNotification', { 
          detail: message.data 
        }));
        
      } catch (err) {
        console.error('Error processing notification:', err);
        console.error('Error details:', err);
      }
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Connection failed:', error.message);
      store.dispatch(setConnectionStatus(false));
      store.dispatch(setConnectionError(error.message));
      this.isConnecting = false;
      
      // maybe auth token expired?
      if (error.message.includes('Authentication')) {
        console.log('Auth error - you might need to refresh the page');
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Disconnected:', reason);
      store.dispatch(setConnectionStatus(false));
      this.isConnecting = false;

      // don't reconnect on transport close - usually means auth issue
      if (reason === 'io server disconnect' || reason === 'transport error') {
        console.log('Server disconnected us, not reconnecting automatically');
      } else {
        this.scheduleReconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber: any) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('All reconnection attempts failed');
      store.dispatch(setConnectionError('Failed to reconnect'));
    });

    // keepalive
    this.socket.on('pong', () => {
      console.log('Pong received');
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log('Retrying connection...');
      this.connect();
    }, 3000);
  }

  disconnect(): void {
    console.log('Disconnecting...');
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    store.dispatch(setConnectionStatus(false));
    store.dispatch(setConnectionError(null));
    this.isConnecting = false;
  }

  ping(): void {
    if (this.socket?.connected) {
      this.socket.emit('ping');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getConnectionId(): string | null {
    return this.socket?.id ?? null;
  }

  // when token refreshes
  reconnectWithNewToken(): void {
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }
}

export const webSocketService = new WebSocketService();

// for debugging in console
if (typeof window !== 'undefined') {
  (window as any).webSocketService = webSocketService;
}