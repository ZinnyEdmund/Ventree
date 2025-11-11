import type { ReactElement, ReactNode } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../state/store';
import { toast } from 'sonner';
// import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';

type Props = {
  component: ReactNode
}

const MainWrapper = ({ component }: Props): ReactElement => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isLoggedIn);

  if (typeof isAuthenticated === 'undefined') {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    toast.warning('Login to access this page')
    // return <Navigate to="/login" replace />;
  }

  return <>{component}</>;
}

export default MainWrapper
