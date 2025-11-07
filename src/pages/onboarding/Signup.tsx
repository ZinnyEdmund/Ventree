import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

export default function Signup() {
  const [BusinessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;

    if (!BusinessName.trim()) {
      toast.error("Business name is required");
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      toast.error("Phone number is required");
      isValid = false;
    } else if (!/^\+?[\d\s-()]+$/.test(phoneNumber)) {
      toast.error("Please enter a valid phone number");
      isValid = false;
    }

    if (!password) {
      toast.error("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // My api call will be here...
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     businessName: BusinessName,
      //     phoneNumber: phoneNumber,
      //     password: password,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Signup failed');
      // }
      //
      // const data = await response.json();

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Account created successfully!");

      // Clears the form after successful signup
      setBusinessName("");
      setPhoneNumber("");
      setPassword("");

      // Redirect the user to the dashboard
      // window.location.href = '/dashboard';
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

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
            onKeyPress={handleKeyPress}
            placeholder="Put your business name"
            className="w-full text[var(--color-subtle)] border border-[var(--color-secondary-4)] rounded-lg p-3 outline-none body-small"
            disabled={isLoading}
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
            onKeyPress={handleKeyPress}
            placeholder="Put your phone number"
            className="w-full text[var(--color-subtle)] border border-[var(--color-secondary-4)] rounded-lg p-3 outline-none body-small"
            disabled={isLoading}
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
            onKeyPress={handleKeyPress}
            placeholder="Put your password"
            className="w-full text-[var(--color-subtle)] border border-[var(--color-secondary-4)] rounded-lg p-3 outline-none body-small"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-4">
        <button
          onClick={handleSubmit}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account" : "Create Account"}
          {isLoading && <LoaderCircle width={20} className="animate-spin" />}
        </button>
        <p className="password-small text-[var(--color-subtle-text)] text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-[var(--color-secondary)] underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
