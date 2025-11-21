import React from "react";
import clsx from "clsx";

interface TextInputProps {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string; // error messages
  required?: boolean;
  className?: string; // 👈 new
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
  className, // 👈 new
  disabled
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="block mb-2 label text-black">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={clsx(
          "w-full px-4 py-3 border border-secondary-4 rounded-lg focus:outline-none focus:ring-2",
          error ? "border-error focus:ring-error" : "border-grey focus:ring-glow"
        )}
        disabled={disabled}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TextInput;

const DateInput: React.FC<TextInputProps> = ({
  label,
  type = "date",
  value,
  onChange,
  placeholder,
  error,
  required,
  className, // 👈 new
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-black">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={clsx(
          "appearance-none w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
          error ? "border-error focus:ring-error" : "border-grey focus:ring-SB"
        )}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export { DateInput };