import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface SelectInputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  className?: string; // 👈 new
  disabled?: boolean
}

export default function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  className, // 👈 new
  disabled
}: SelectInputProps) {
  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm font-medium text-black">
          {label}
        </label>
      )}

<div className={clsx("relative w-full", className)}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={clsx(
          "appearance-none w-full border-secondary-4  px-4 py-3 border rounded-lg focus:outline-none focus:ring-2",
          "focus:ring-glow"
        )}
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        size={18}
      />
    </div>
    </div>
    
  );
}

export function SelectInputGrey({
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  className, // 👈 new
}: SelectInputProps) {
  return (
    <div className={clsx("relative w-full", className)}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="appearance-none bg-gray rounded-full px-3 py-2 w-full"
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        size={18}
      />
    </div>
  );
}

export function SelectInputBorderless({
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  className, // 👈 new
}: SelectInputProps) {
  return (
    <div className={clsx("relative", className)}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="appearance-none border-none bg-gray rounded-full py-2 w-full focus:outline-none"
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        size={18}
      />
    </div>
  );
}