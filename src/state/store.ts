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
import { authApi } from "../services/auth.service";
import { userApi } from "../services/user.service";
import { staffApi } from "../services/staff.service";
import { stocksApi } from "../services/stocks.service";

// Transform to exclude _initialized from persistence
// _initialized is a runtime flag and shouldn't be persisted
const authTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState: any) => {
    const { _initialized, ...stateToPersist } = inboundState;
    return stateToPersist;
  },
  // transform state being rehydrated
  (outboundState: any) => {
    return { ...outboundState, _initialized: false };
  },
  // define which reducers this transform gets called for
  { whitelist: ["auth"] }
);

const persistConfig = {
  key: "auth",
  storage,
  // When using persistReducer on a specific reducer, whitelist refers to state properties
  // We want to persist user and isLoggedIn, but not _initialized
  // The transform will handle excluding _initialized, so we don't need an explicit whitelist
  transforms: [authTransform],
  // Note: accessToken is not in auth state (stored in cookies)
  // Only user and isLoggedIn will be persisted (not _initialized, which is excluded by transform)
};

export const reducers = combineReducers({
  skip: skipReducer,
  auth: persistReducer(persistConfig, authReducer),
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [staffApi.reducerPath]: staffApi.reducer,
  [stocksApi.reducerPath]: stocksApi.reducer
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
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
