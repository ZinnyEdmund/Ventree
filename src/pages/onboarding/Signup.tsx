import { useState } from "react";

export default function Signup() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex w-full max-w-4xl rounded-lg md:shadow-2xl overflow-hidden">
        {/* Left side */}
        <div className="hidden md:flex w-1/2 relative">
          <img
            src="/images/logo-white.svg"
            alt="Ventree Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-8 min-h-[600px]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold pb-2">Less Stress</h2>
            <p className="text-2xl font-semibold">More Business</p>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Put your phone number"
                className="w-full border rounded-md p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Put your password"
                className="w-full border rounded-md p-2 outline-none"
              />
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-4">
            <button className="w-full py-2 rounded-md font-medium border">
              Create Account
            </button>
            <p className="text-sm text-center">
              Already have an account?{" "}
              <a href="/login" className="font-medium underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
