import React from "react";
import { Icon } from "@iconify/react";

interface ProfileSelectProps {
  label?: string;
  value: string;
  name: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProfileSelect: React.FC<ProfileSelectProps> = ({
  label,
  value,
  name,
  options,
  disabled = false,
  //   error,
  onChange,
}) => {
  return (
    <div className="mb-4 relative">
      {label && <label className="block mb-2 label text-black">{label}</label>}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full px-4 py-3 pr-12 border border-secondary-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
          style={{ WebkitAppearance: "none", MozAppearance: "none" }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Icon icon="ic:outline-arrow-drop-down-circle" width="22" height="22" />
      </div>

      {/* {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )} */}
    </div>
  );
};

export default ProfileSelect;
