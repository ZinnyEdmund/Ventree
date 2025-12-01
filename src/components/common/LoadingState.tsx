import { useEffect, useState } from "react";

interface LoadingStateProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  overlay?: boolean;
  backgroundColor?: string;
  pulseColor?: string;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  size = "lg",
  text = "Loading...",
  overlay = true,
  backgroundColor = "rgba(255, 255, 255, 0.95)",
  pulseColor = "rgba(26, 92, 58, 0.3)", // Your brand green with opacity
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerClasses = overlay
    ? "fixed inset-0 z-50 flex items-center justify-center"
    : "flex items-center justify-center w-full h-full";

  return (
    <div
      className={`${containerClasses} ${mounted ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      style={{ backgroundColor: overlay ? backgroundColor : "transparent" }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Logo with Pulse Animation */}
        <div className="relative flex items-center justify-center">
          {/* Pulse Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: pulseColor,
                animationDuration: "1.5s",
              }}
            />
            <div
              className="absolute rounded-full animate-pulse"
              style={{
                width: "120%",
                height: "120%",
                backgroundColor: pulseColor,
                animationDuration: "2s",
              }}
            />
          </div>

          {/* Logo */}
          <div
            className={`relative ${sizeClasses[size]} flex items-center justify-center animate-pulse-scale`}
          >
            <img
              src="/images/logo.svg"
              alt="Loading"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Loading Text */}
        {text && (
          <p className="text-gray-700 font-medium text-lg animate-pulse">
            {text}
          </p>
        )}

        {/* Loading Dots Animation */}
        <div className="flex gap-2">
          <span
            className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "1s" }}
          />
          <span
            className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms", animationDuration: "1s" }}
          />
          <span
            className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms", animationDuration: "1s" }}
          />
        </div>
      </div>

      {/* Custom CSS for pulse-scale animation */}
      <style>{`
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        .animate-pulse-scale {
          animation: pulse-scale 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingState;