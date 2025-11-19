import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./state/store.ts";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import { initializeAuth } from "./state/Store/authSlice";
import LoadingSpinner from "./components/shared/LoadingSpinner";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate 
      loading={<LoadingSpinner />} 
      persistor={persistor}
      onBeforeLift={() => {
        // Initialize auth state after rehydration completes
        // This syncs cookies with persisted Redux state
        store.dispatch(initializeAuth());
      }}
    >
      <Toaster richColors position="top-right" />
      <App />
    </PersistGate>
  </Provider>
);
