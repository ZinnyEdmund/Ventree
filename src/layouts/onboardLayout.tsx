import { Outlet } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex w-full max-w-4xl rounded-lg md:shadow-2xl overflow-hidden">
        {/* Left side */}
        <div
          className="hidden md:flex justify-center items-center mx-auto w-1/2 relative 
             bg-black bg-[url('/images/onboard-pattern.svg')] 
             bg-cover bg-center bg-no-repeat bg-blend-overlay"
        >
          <img
            src="/images/logo-white.svg"
            alt="Ventree Logo"
            width={200}
            className="z-10"
          />
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-8 min-h-[600px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
