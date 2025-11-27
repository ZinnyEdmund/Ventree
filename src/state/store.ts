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
import { stocksApi } from "../services/stocks.service";
import { expenseApi } from "../services/expenses.service";
import { notificationsApi } from "../services/notifications.service";

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
  storage
  // no transforms, no whitelists - persist everything
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
  [stocksApi.reducerPath]: stocksApi.reducer,
  [expenseApi.reducerPath]: expenseApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
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
      .concat(stocksApi.middleware)
      .concat(expenseApi.middleware)
      .concat(notificationsApi.middleware)
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
