import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import ErrorState from "../components/common/ErrorState";
export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <ErrorState 
          errorCode={404}
          message="Page not found. The page you're looking for doesn't exist." 
          onRetry={handleGoHome}
          btnMsg="Go to Home"
        />
        
        {/* Optional: Additional navigation */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home size={16} />
            Go to Home
          </button>
        </div>
      </div>
    </section>
  );
};