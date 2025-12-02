import {
  combineReducers,
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
  persistStore,
  createTransform,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import skipReducer from "./Store/skipSlice";
import authReducer from "./Store/authSlice";
import draftSalesReducer from "./Store/draftSalesSlice";
import notificationReducer from "./Store/notificationSlice";
import { authApi } from "../services/auth.service";
import { userApi } from "../services/user.service";
import { staffApi } from "../services/staff.service";
import { inventoryApi } from "../services/stocks.service";
import { expenseApi } from "../services/expenses.service";
import { notificationsApi } from "../services/notifications.service";
import { shopApi } from "../services/shop.service";
import { salesApi } from "../services/sales.service";
import { analyticsApi } from "../services/analytics.service";

// Transform to exclude _initialized from persistence
// _initialized is a runtime flag and shouldn't be persisted
const authTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState: any) => {
    if (!inboundState) return inboundState;
    const { _initialized, ...stateToPersist } = inboundState;
    return stateToPersist;
  },
  // transform state being rehydrated
  (outboundState: any) => {
    if (!outboundState) return outboundState;
    return { ...outboundState, _initialized: false };
  }
  // no whitelist needed when applying to specific reducer
);

const persistConfig = {
  key: "auth",
  storage,
  // When using persistReducer on a specific reducer, whitelist refers to state properties
  // We want to persist user and isLoggedIn, but not _initialized
  // The transform will handle excluding _initialized, so we don't need an explicit whitelist
  transforms: [authTransform],
  // whitelist: [shopApi.reducerPath],
  // Note: accessToken is not in auth state (stored in cookies)
  // Only user and isLoggedIn will be persisted (not _initialized, which is excluded by transform)
};

// Persist configuration for draft sales
const draftSalesPersistConfig = {
  key: "draftSales",
  storage,
  whitelist: ["goods", "paymentMethod", "isEditing", "lastUpdated"],
};

// notifications need to stick around
const notificationsPersistConfig = {
  key: "notifications",
  storage,
  whitelist: ["notifications", "unreadCount"], // keep connection state separate
};

const persistedDraftSalesReducer = persistReducer(
  draftSalesPersistConfig,
  draftSalesReducer
);

const persistedNotificationReducer = persistReducer(
  notificationsPersistConfig,
  notificationReducer
);

export const reducers = combineReducers({
  skip: skipReducer,
  draftSales: persistedDraftSalesReducer,
  auth: persistReducer(persistConfig, authReducer),
  notifications: persistedNotificationReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [staffApi.reducerPath]: staffApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  [expenseApi.reducerPath]: expenseApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [salesApi.reducerPath]: salesApi.reducer,
  [analyticsApi.reducerPath]: analyticsApi.reducer
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Ignore redux-persist non-serializable actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(staffApi.middleware)
      .concat(inventoryApi.middleware)
      .concat(expenseApi.middleware)
      .concat(notificationsApi.middleware)
      .concat(shopApi.middleware)
      .concat(salesApi.middleware)
      .concat(analyticsApi.middleware)
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
