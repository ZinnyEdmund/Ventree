interface ErrorStateProps {
  errorCode?: string | number;
//   title?: string;
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorCode = "500",
//   title = "Something went wrong",
  message = "Something went wrong but don't worry.",
  onRetry,
  showRetryButton = true,
}) => {
  return (
    // Full-screen overlay
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-12">
        {/* Error Code */}
        <h1 className="text-8xl md:text-9xl font-bold text-[#073E1E] mb-8">
          {errorCode}
        </h1>

        {/* Illustration */}
        <div className="mb-8">
          <img
            src="/images/error-state-illustration.svg"
            alt="Error Illustration"
            className="w-48 h-48 md:w-64 md:h-64"
          />
        </div>

        {/* Error Message */}
        <p className="text-[#073E1E] text-center mb-8 text-base md:text-lg max-w-md">
          {message}
        </p>

        {/* Try Again Button */}
        {showRetryButton && (
          <button
            onClick={onRetry}
            className="btn btn-primary min-w-40 justify-center"
          >
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;