import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react"; // Added space after import
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { useDispatch } from "react-redux";
import { loadAuthFromLocalStorage } from "../state/Store/authSlice";
import type { AppDispatch } from "../state/store";
import OnboardWrapper from "../layouts/onboardWrapper";
import OnboardLayout from "../layouts/onboardLayout";
import MainWrapper from "../layouts/mainWrapper";
import MainLayout from "../layouts/mainLayout";

const RegisterPage = lazy(() => import("../pages/onboarding/Signup"));
const LoginPage = lazy(() => import("../pages/onboarding/Login"));
const WelcomePage = lazy(() => import("../pages/onboarding/Welcome"));
const Otp = lazy(() => import("../pages/onboarding/Otp"));
const DesignSystem = lazy(() => import("../pages/DS/designSystem"));


function AppRoutes() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadAuthFromLocalStorage());
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BrowserRouter>
        <Routes>
          {/* Onboarding */}
          <Route path="/" element={<WelcomePage />} />

          {/* Authentication */}
          <Route path="/" element={<OnboardWrapper component={<OnboardLayout />} />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp" element={<Otp />} />
          </Route>

          <Route path="/design" element={<DesignSystem />} />

          {/* Main Application */}
          <Route path="/" element={<MainWrapper component={<MainLayout />} />}>
            {/* Post main application components here!! */}
          </Route>
          
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default AppRoutes;
