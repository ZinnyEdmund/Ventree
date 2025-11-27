import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from "./routes";
import { webSocketService } from './services/websocket.service';
import type { RootState } from './state/store';

function App() {
  const { isLoggedIn, _initialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // don't mess with websocket until redux has loaded from storage
    if (!_initialized) return;
    
    if (isLoggedIn) {
      webSocketService.connect();
    } else {
      webSocketService.disconnect(); 
    }
  }, [isLoggedIn, _initialized]);

  return <AppRoutes />;
}

export default App;
