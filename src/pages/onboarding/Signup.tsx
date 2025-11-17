import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { validatePhoneNumber, validatePassword } from "../../components/common/validation";
import { useFormSubmit } from "../../components/common/formHooks";

export default function Signup() {
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, submit } = useFormSubmit();

  const validateForm = (): boolean => {
    const errors = [
      !businessName.trim() ? "Business name is required" : null,
      validatePhoneNumber(phoneNumber),
      validatePassword(password),
    ].filter(Boolean);

    if (errors.length > 0) {
      toast.error(errors[0]!);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) return;

    await submit(
      async () => {
        // YOUR API CALL HERE
        await new Promise((resolve) => setTimeout(resolve, 1500));
      },
      "Account created successfully!",
      () => {
        setBusinessName("");
        setPhoneNumber("");
        setPassword("");
      }
    );
  };

  return (
    <section className="w-full flex flex-col md:space-y-6 space-y-16 justify-between md:p-6">
      <div className="text-center text-black md:pb-7">
        <h2 className="h3 pb-2">Less Stress</h2>
        <p className="h3">More Business</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-6">
        <div>
          <label className="block text-black label md:mb-1 mb-2">Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Put your business name"
            className="w-full text-black border border-secondary-4 focus:ring-2 focus:ring-tertiary rounded-lg p-3 outline-none body"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-black label md:mb-1 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Put your phone number"
            className="w-full text-black border border-secondary-4 focus:ring-2 focus:ring-tertiary rounded-lg p-3 outline-none body"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-black label md:mb-1 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Put your password"
            className="w-full text-black border border-secondary-4 focus:ring-2 focus:ring-tertiary rounded-lg p-3 outline-none body"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary flex items-center justify-center gap-2 border active:border-tertiary"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account" : "Create Account"}
          {isLoading && <LoaderCircle width={20} className="animate-spin" />}
        </button>
      </form>

      <p className="password-small text-subtle-text text-center max-w-sm mx-auto">
        Already have an account?{" "}
        <a href="/login" className="link-small text-black underline">
          Login
        </a>
      </p>
    </section>
  );
}