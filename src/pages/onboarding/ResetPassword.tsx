import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import {
  validateBusinessNumber,
  validatePassword,
} from "../../components/common/validation";
import { useFormSubmit } from "../../components/common/formHooks";
import { Icon } from "@iconify/react";

export default function ResetPassword() {
  const [businessNumber, setBusinessNumber] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, submit } = useFormSubmit();

  const validateForm = (): boolean => {
    const errors = [
      validateBusinessNumber(businessNumber),
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
      "Password reset successful!",
      () => {
        setBusinessNumber("");
        setPassword("");
        // window.location.href = '/login';
      }
    );
  };

  return (
    <section className="w-full flex flex-col md:space-y-16 space-y-16 justify-between md:p-6">
      <span className="absolute left-6 top-6 hidden md:inline">
        <Icon
          icon="iconamoon:arrow-left-6-circle-light"
          width="24"
          height="24"
        />
      </span>
      <div className="text-center text-black">
        <h2 className="h3 pb-2">Reset Password</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto space-y-6"
      >
        <div>
          <label className="block text-black label md:mb-1 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            placeholder="Put your business number"
            className="w-full text-black border border-secondary-4 focus:ring-2 focus:ring-tertiary body rounded-lg p-3 outline-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-black label md:mb-1 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Put your new password"
            className="w-full border border-secondary-4 focus:ring-2 focus:ring-tertiary body rounded-lg p-3 outline-none"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary flex items-center justify-center gap-2 border active:border-tertiary"
          disabled={isLoading}
        >
          {isLoading ? "Resetting" : "Reset Password"}
          {isLoading && <LoaderCircle width={20} className="animate-spin" />}
        </button>
      </form>

      <p className="password-small text-subtle-text text-center max-w-sm mx-auto">
        Remember your password?{" "}
        <a href="/login" className="link-small text-black underline">
          Back to Login
        </a>
      </p>
    </section>
  );
}
