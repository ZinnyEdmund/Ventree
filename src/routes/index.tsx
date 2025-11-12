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
import { Home } from "../pages/home";
import { ManageStocks } from "../pages/stocks";
import RecordSale from "../pages/sales/RecordSales";
import { SetupShopPage } from "../pages/shop";

const RegisterPage = lazy(() => import("../pages/onboarding/Signup"));
const LoginPage = lazy(() => import("../pages/onboarding/Login"));
const WelcomePage = lazy(() => import("../pages/onboarding/Welcome"));
const Otp = lazy(() => import("../pages/onboarding/Otp"));
const ResetPasswordPage = lazy(() => import("../pages/onboarding/ResetPassword"));
const DesignSystem = lazy(() => import("../pages/DS/designSystem"));
const LogoutPage = lazy(() => import("../pages/onboarding/Logout"));



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
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route path="/design" element={<DesignSystem />} />
          <Route path="/logout" element={<LogoutPage />} />

          {/* Main Application */}
          <Route path="/" element={<MainWrapper component={<MainLayout />} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/stocks" element={<ManageStocks />} />
            <Route path="/record-sales" element={<RecordSale />} />
            <Route path="/setup-shop" element={<SetupShopPage />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default AppRoutes;
