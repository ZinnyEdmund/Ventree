# WebSocket Notification System Implementation

So basically, this is how we implemented real-time notifications for Ventree. If you're new to this or just trying to understand the codebase, this should help.

## Overview

You know how notifications work on social media? That's what we built here. When something important happens in a shop - like stock running low or a sale being completed - the owner gets notified instantly without having to refresh the page.

Here's the basic flow:

```
Event happens → Save to DB → Send via WebSocket → Show notification → Keep it in the app
```

## Frontend Architecture

### Main Components

We broke this down into 4 main parts:

1. **WebSocket Service** - This handles the actual connection to the server
2. **React Hook** - Makes it super easy to use notifications in any component  
3. **Redux Store** - Manages all the notification state across the app
4. **UI Components** - The actual stuff users see (toast notifications, bell icon, etc.)

### File Structure

```
src/
├── services/
│   ├── websocket.service.ts      # WebSocket connection logic
│   └── notifications.service.ts  # API calls for notifications
├── hooks/
│   └── useNotifications.ts       # React hook for components
├── state/Store/
│   └── notificationSlice.ts      # Redux state management
└── components/
    └── NotificationModal.tsx     # Shows notifications
```

## How Each Part Works

### 1. WebSocket Service (`websocket.service.ts`)

This is where the magic happens. It handles the real-time connection to our backend.

```typescript
class WebSocketService {
  connect() {
    // Connect to server with user's auth token
    this.socket = io('http://localhost:50001', {
      auth: { token: getUserToken() }
    });
    
    // Listen for new notifications
    this.socket.on('notification', (data) => {
      // Add to app state
      store.dispatch(addNotification(data));
    });
  }
}
```

**What's cool about this:**
- Only connects when someone actually logs in
- If the connection drops, it automatically tries to reconnect
- Uses the user's auth token so only they get their shop's notifications

### 2. React Hook (`useNotifications.ts`)

This makes working with notifications super simple in any React component.

```typescript
export const useNotifications = () => {
  // Connect WebSocket when user logs in
  useEffect(() => {
    if (isLoggedIn && user) {
      webSocketService.connect();
    }
  }, [isLoggedIn, user]);

  return {
    notifications,     // List of all notifications
    unreadCount,      // Number of unread notifications  
    markAsRead,       // Function to mark notification as read
    isConnected       // WebSocket connection status
  };
};
```

**Usage in components:**
```typescript
function MyComponent() {
  const { notifications, markAsRead } = useNotifications();
  
  return (
    <div>
      {notifications.map(notif => (
        <div key={notif._id} onClick={() => markAsRead(notif._id)}>
          {notif.message}
        </div>
      ))}
    </div>
  );
}
```

### 3. Redux Store (`notificationSlice.ts`)

Manages notification state across the entire app.

```typescript
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    isConnected: false
  },
  reducers: {
    addNotification: (state, action) => {
      // Add new notification to the list
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      // Find notification and mark it as read
      const notif = state.notifications.find(n => n._id === action.payload);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        state.unreadCount -= 1;
      }
    }
  }
});
```

**Persistence:** 
We save notifications to browser storage so they survive page refreshes:

```typescript
const persistConfig = {
  key: "notifications",
  storage: localStorage,
  whitelist: ["notifications", "unreadCount"]
};
```

### 4. API Service (`notifications.service.ts`)

Handles API calls for notification actions.

```typescript
export const notificationsApi = createApi({
  endpoints: (builder) => ({
    // Get notifications from server
    fetchNotifications: builder.query({
      query: ({ shopId, limit = 20 }) => ({
        url: `/v1/notifications?shopId=${shopId}&limit=${limit}`
      })
    }),
    
    // Mark notification as read on server
    markNotificationAsRead: builder.mutation({
      query: ({ shopId, notificationId }) => ({
        url: `/v1/notifications`,
        method: "PATCH",
        params: { shopId, notificationId },
        body: { isRead: true }
      })
    })
  })
});
```

## User Experience Flow

### When User Logs In
1. WebSocket connects automatically
2. App loads existing notifications from API
3. Real-time notifications start working

### When New Notification Arrives
1. WebSocket receives the notification
2. Toast popup appears on screen
3. Browser notification shows (if allowed)
4. Notification added to Redux store
5. Bell icon shows updated count

### When User Clicks Notification
1. Marks notification as read locally (immediate)
2. Sends API call to server
3. User navigates to notifications page or relevant section

## UI Components

### Bell Icon (in header)
- Shows unread count as red badge
- Click opens notification dropdown

### Notification Modal
- Shows recent 5 notifications
- Each notification has icon, message, and time
- "See all" link goes to full notifications page

### Toast Notifications
- Appear when new notification arrives
- Auto-dismiss after 5 seconds
- "View" button marks as read and navigates

## Data Flow

```
1. Backend Event
   ↓
2. Save to Database
   ↓  
3. Publish to Redis
   ↓
4. WebSocket Server broadcasts
   ↓
5. Frontend WebSocket receives
   ↓
6. Add to Redux Store
   ↓
7. UI Updates (toast, bell icon, etc.)
   ↓
8. User interacts (mark as read)
   ↓
9. API call to server
```

## Notification Types

The system supports different types of notifications:

- **Low Stock** - When inventory runs low
- **Out of Stock** - When items are depleted  
- **Sale Completed** - When a sale is recorded

Each type has its own icon and formatting.

## Key Features

**Real-time:** Notifications appear instantly without page refresh

**Persistent:** Notifications survive browser refresh and reopening

**Offline-friendly:** If WebSocket disconnects, notifications are fetched on reconnect

**User-friendly:** Clear visual feedback with toast notifications and badge counts

**Efficient:** Only loads new data when needed, uses WebSocket for real-time updates


This implementation provides a robust, user-friendly notification system that keeps shop owners informed of important events in real-time.