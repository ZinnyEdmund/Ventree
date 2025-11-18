import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import OnboardWrapper from "../layouts/onboardWrapper";
import OnboardLayout from "../layouts/onboardLayout";
import MainLayout from "../layouts/mainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { Home } from "../pages/home";
import { ManageStocks } from "../pages/stocks";
import RecordSale from "../pages/sales/RecordSales";
import Notification from "../pages/notification/Notification";
import { SetupShopPage } from "../pages/shop";
import Settings from "../pages/settings/Settings"
import { BusinessInsightsPage } from "../pages/insights";
import { ExpensesPage } from "../pages/expenses";
import ChangePassword from "../pages/changePassword/ChangePassword";
import EditProfile from "../pages/profile/EditProfile";
import Feedback from "../pages/feedback/Feedback";
import AboutApp from "../pages/about/AboutApp";

const RegisterPage = lazy(() => import("../pages/onboarding/Signup"));
const LoginPage = lazy(() => import("../pages/onboarding/Login"));
const WelcomePage = lazy(() => import("../pages/onboarding/Welcome"));
const Otp = lazy(() => import("../pages/onboarding/Otp"));
const ResetPasswordPage = lazy(() => import("../pages/onboarding/ResetPassword"));
const DesignSystem = lazy(() => import("../pages/DS/designSystem"));
const LogoutPage = lazy(() => import("../pages/onboarding/Logout"));



function AppRoutes() {
  // Redux Persist handles rehydration automatically via PersistGate
  // No need to manually load from localStorage

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
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            {/* Owner-only routes */}
            <Route path="/home" element={<ProtectedRoute requiredRole="owner"><Home /></ProtectedRoute>} />
            <Route path="/stocks" element={<ProtectedRoute requiredRole="owner"><ManageStocks /></ProtectedRoute>} />
            <Route path="/setup-shop" element={<ProtectedRoute requiredRole="owner"><SetupShopPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requiredRole="owner"><Settings /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute requiredRole="owner"><BusinessInsightsPage /></ProtectedRoute>} />
            <Route path="/home/expenses" element={<ProtectedRoute requiredRole="owner"><ExpensesPage /></ProtectedRoute>} />
            <Route path="/notification" element={<ProtectedRoute requiredRole="owner"><Notification /></ProtectedRoute>} />
            
            {/* Available to both owner and staff */}
            <Route path="/record-sales" element={<ProtectedRoute><RecordSale /></ProtectedRoute>} />
          </Route>

          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="/aboutapp" element={<ProtectedRoute><AboutApp /></ProtectedRoute>} />
          
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default AppRoutes;
