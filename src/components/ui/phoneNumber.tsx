import React from "react";
import clsx from "clsx";

interface PhoneNumberInputProps {
  label?: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Put you phone number",
  error,
  required,
  className,
  disabled,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="block mb-2 label text-black">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        {/* Phone Number Input */}
        <input
          type="tel"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={clsx(
            "w-full px-4 py-3 border border-secondary-4 rounded-lg focus:outline-none focus:ring-2",
            error
              ? "border-error focus:ring-error"
              : "border-grey focus:ring-glow"
          )}
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PhoneNumberInput;
