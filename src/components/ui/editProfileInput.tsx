import React from "react";
import { Icon } from "@iconify/react";

interface ProfileInputProps {
  label?: string;
  value: string;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  value,
  name,
  type = "text",
  placeholder,
  disabled = false,
  //   error,
  onChange,
}) => {
  return (
    <div className="mb-4 relative">
      {label && <label className="block mb-2 label text-black">{label}</label>}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={
            "w-full px-4 py-3 pr-12 border border-secondary-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow disabled:opacity-50 disabled:cursor-not-allowed"
          }
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Icon icon="ic:outline-edit" width="20" height="20" />
        </div>
      </div>
      {/* {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )} */}
    </div>
  );
};

export default ProfileInput;
