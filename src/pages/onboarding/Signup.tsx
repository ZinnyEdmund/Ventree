import { useState } from "react";

export default function Signup() {
  const [BusinessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full flex flex-col md:space-y-6 space-y-16 justify-between md:p-6">
      <div className="text-center text-[var(--color-secondary)] md:pb-7 ">
        <h2 className="h3 pb-2">Less Stress</h2>
        <p className="h3">More Business</p>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-6">
        <div>
          <label className="block text-[var(--color-black)] label md:mb-1 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={BusinessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Put your business name"
            className="w-full text[var(--color-subtle)] border border-[var(--color-secondary-4)] rounded-lg p-3 outline-none body-small"
          />
        </div>
        <div>
          <label className="block text-[var(--color-black)] label md:mb-1 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Put your phone number"
            className="w-full text[var(--color-subtle)] border border-[var(--color-secondary-4)] rounded-lg p-3 outline-none body-small"
          />
        </div>
        <div>
          <label className="block text-[var(--color-black)] label md:mb-1 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Put your password"
            className="w-full text-[var(--color-subtle)] border border-[var(--color-secondary-4)] rounded-lg p-3 outline-none body-small"
          />
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-4">
        <button className="w-full btn btn-primary ">
          Create Account
        </button>
        <p className="password-small text-[var(--color-subtle-text)] text-center">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-[var(--color-secondary)] underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
