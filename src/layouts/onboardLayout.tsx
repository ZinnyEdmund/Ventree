import { Outlet } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex w-full max-w-4xl m-8 rounded-lg md:shadow-2xl overflow-hidden">
        {/* Left side */}
        <div
          className="hidden md:flex justify-center items-center mx-auto w-1/2 relative 
            bg-black bg-cover"
          style={{ backgroundImage: "url('images/onboarding-pattern.svg')" }}
        >
          <img
            src="/images/logo-white.svg"
            alt="Ventree Logo"
            width={200}
            className="z-10"
          />
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 flex flex-col justify-between pl-2  py-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
