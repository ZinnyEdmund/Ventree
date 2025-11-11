import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import TextInput from "../../components/ui/textInput";
import PasswordInput from "../../components/ui/passwordInput";

export default function Login() {
  // State boxes to store what the user types
  const [businessNumber, setBusinessNumber] = useState("");
  const [password, setPassword] = useState("");
  // Track if we're currently submitting (for loading state)
  const [isLoading, setIsLoading] = useState(false);

  // Check if the form is filled correctly before submitting
  const validateForm = () => {
    let isValid = true;

    // Check if business number field is empty
    if (!businessNumber.trim()) {
      toast.error("Business number is required");
      isValid = false;
    }

    // Check if password field is empty
    if (!password.trim()) {
      isValid = false;
      toast.error("Password is required");
    } 
    // If password exists, make sure it's long enough
    else if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  // This runs when user clicks "Login" button
  const handleSubmit = async () => {
    // First check if form is valid
    if (!validateForm()) {
      return; // Stop if validation failed
    }

    // Start loading (button becomes disabled, shows spinner)
    setIsLoading(true);

    try {
      // YOUR API CALL GOES HERE
      // Send businessNumber and password to your backend
      // Backend checks if they match what's in the database
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     businessNumber: businessNumber,
      //     password: password,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      //
      // const data = await response.json();

      // Fake API call (simulates 1.5 second wait)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // If we reach here, login was successful!
      toast.success("Login successful!");

      // Clear the input fields
      setBusinessNumber("");
      setPassword("");

      // Take user to dashboard after successful login
      // window.location.href = '/dashboard';
    } 
    // If something goes wrong (wrong password, network error, etc.)
    catch (error) {
      // Figure out what error message to show
      const message =
        error instanceof Error
          ? error.message // Use the error's message
          : typeof error === "string"
          ? error // Use error if it's already a string
          : "Something went wrong. Please try again."; // Default message
      toast.error(message);
    } 
    // This runs no matter what (success or error)
    finally {
      // Stop loading (re-enable button)
      setIsLoading(false);
    }
  };

  // Allow users to press Enter key to submit instead of clicking button
  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <section className="w-full flex flex-col md:space-y-16 space-y-16 justify-between md:p-6">
      <div className="text-center text-black">
        <h2 className="h3 pb-2">Welcome Back!</h2>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-6">
        <div>
          {/* <label className="block text-black label md:mb-1 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Put your business number"
            className="w-full border border-secondary-4 focus:ring-2 focus:ring-[var(--color-tertiary)] body-small rounded-lg p-3 outline-none"
            disabled={isLoading}
          /> */}
          <TextInput 
            label="Business Name"
            placeholder="Put your business number"
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            className=""
            disabled={isLoading}
        />
        </div>
        <div>
        {/* <label className="block text-[var(--color-black)] label md:mb-1 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Put your password"
            className="w-full border border-[var(--color-secondary-4)] focus:ring-2 focus:ring-[var(--color-tertiary)] body-small rounded-md p-2 outline-none"
            disabled={isLoading}
          /> */}
          <PasswordInput 
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <p className="text-sm pt-1 text-right">
            <a
              href="/reset-password"
              className="font-medium text-[var(--color-black)]"
            >
              Forgot password?{" "}
            </a>
          </p> */}
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-4">
        <button
          onClick={handleSubmit}
          className="w-full btn btn-primary flex items-center justify-center gap-2 border active:border-[var(--color-tertiary)]" 
          disabled={isLoading}
        >
          {isLoading ? "Logging in" : "Login"}
          {isLoading && <LoaderCircle width={20} className="animate-spin" />}
        </button>
        <p className="password-small text-[var(--color-subtle-text)]  text-center">
          Don't have an account?{" "}
          <a
            href="/register"
            className="link-small text-[var(--color-black)] underline"
          >
            Create Account
          </a>
        </p>
      </div>
    </section>
  );
}