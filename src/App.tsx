import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from "./routes";
import { webSocketService } from './services/websocket.service';
import type { RootState } from './state/store';

function App() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // connect websocket when logged in, disconnect when not
    if (isLoggedIn) {
      webSocketService.connect();
    } else {
      webSocketService.disconnect(); 
    }
  }, [isLoggedIn]);

  return <AppRoutes />;
}

export default App;
