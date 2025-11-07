import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

export default function Login() {
  const [businessNumber, setBusinessNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;

    if (!businessNumber.trim()) {
      toast.error("Business number is required");
      isValid = false;
    }

    if (!password.trim()) {
      isValid = false;
      toast.error("Password is required");
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
      //     phoneNumber: phoneNumber,
      //     password: password,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      //
      // const data = await response.json();

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Login successful!");

      //Clears the form after successful login
      setBusinessNumber("");
      setPassword("");

      // Redirect the user to the dashboard(We don't have any yet)
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
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Put your business number"
            className="w-full text-[var(--color-subtle)] border border-[var(--color-secondary-4)] body-small rounded-lg p-3 outline-none"
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
            className="w-full text-[var(--color-subtle)] border border-[var(--color-secondary-4)] body-small rounded-md p-2 outline-none"
            disabled={isLoading}
          />
          <p className="text-sm pt-1 text-right">
            <a
              href="/reset-password"
              className="font-medium text-[var(--color-secondary)]"
            >
              Forgot password?{" "}
            </a>
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-4">
        <button
          onClick={handleSubmit}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? "Logging in" : "Login"}
          {isLoading && <LoaderCircle width={20} className="animate-spin" />}
        </button>
        <p className="password-small text-[var(--color-subtle-text)]  text-center">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-[var(--color-secondary)] underline"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
