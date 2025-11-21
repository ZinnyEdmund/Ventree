import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

interface PasswordInputProps {
  label?: string;
  value: string;
  noFP?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  noFP = true,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4 relative">
      {label && (
        <label className="block mb-2 label text-black">
          {label}
        </label> // 👈 only render if passed}
      )}

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Put your password"
          className="w-full px-4 py-3 pr-12 border border-secondary-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow"
        />

       
        {/* Toggle password visibility */}
        <button
          type="button"
          className="absolute right-3 top-4 text-black"
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

export default PasswordInput;
