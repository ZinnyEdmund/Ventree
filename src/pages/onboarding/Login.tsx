import { useState } from "react";

export default function Signup() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full flex flex-col md:space-y-16 space-y-16 justify-between md:p-6">
      <div className="text-center text-[var(--color-secondary)]">
        <h2 className="h3 pb-2">Welcome Back!</h2>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-6">
        <div>
          <label className="block text-[var(--color-black)] label md:mb-1 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Put your business number"
            className="w-full text-[var(--color-subtle)] border border-[var(--color-secondary-4)] body-small rounded-lg p-3 outline-none"
          />
        </div>
        <div>
          <label className="block text-[var(--color-black)] label md:mb-1 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Put your password"
            className="w-full text-[var(--color-subtle)] border border-[var(--color-secondary-4)] body-small rounded-md p-2 outline-none"
          />
          <p className="text-sm pt-1 text-right">
            <a href="/reset-password" className="font-medium text-[var(--color-secondary)]">
              Forgot password?{" "}
            </a>
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-4">
        <button className="w-full btn btn-primary">
          Login
        </button>
        <p className="password-small text-[var(--color-subtle-text)]  text-center">
          Don't have an account?{" "}
          <a href="/signup" className="font-medium text-[var(--color-secondary)] underline">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
