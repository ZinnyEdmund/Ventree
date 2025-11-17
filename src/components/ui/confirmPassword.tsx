import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

interface ConfirmPasswordProps {
  label?: string;
  value: string;
  type?: string;
  className?: string;
  noFP?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConfirmPassword: React.FC<ConfirmPasswordProps> = ({
  label,
  value,
  noFP = true,
  placeholder = "Password", // Default value
  disabled = false,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4 relative">
      {label && (
        <label className="block mb-2 label text-black">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 pr-12 border border-secondary-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {/* Toggle password visibility */}
        <button
          type="button"
          className="absolute right-3 top-4 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {/* Show password toggle */}
      <div className="flex justify-between mt-2 text-sm">
        <div></div>
        {noFP ? (
          <Link to="/reset-password" className="text-black hover:underline">
            Forgot Password?
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default ConfirmPassword;