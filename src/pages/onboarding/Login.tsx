import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import TextInput from "../../components/ui/textInput";
import PasswordInput from "../../components/ui/passwordInput";
import { validateBusinessNumber, validatePassword } from "../../components/common/validation";
import { useFormSubmit } from "../../components/common/formHooks";

export default function Login() {
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
      "Login successful!",
      () => {
        setBusinessNumber("");
        setPassword("");
        // window.location.href = '/dashboard';
      }
    );
  };

  return (
    <section className="w-full flex flex-col md:space-y-16 space-y-16 justify-between md:p-6">
      <div className="text-center text-black">
        <h2 className="h3 pb-2">Welcome Back!</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-6">
        <TextInput
          label="Business Name"
          placeholder="Put your business number"
          value={businessNumber}
          onChange={(e) => setBusinessNumber(e.target.value)}
          disabled={isLoading}
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full btn btn-primary flex items-center justify-center gap-2 border active:border-tertiary"
          disabled={isLoading}
        >
          {isLoading ? "Logging in" : "Login"}
          {isLoading && <LoaderCircle width={20} className="animate-spin" />}
        </button>
      </form>

      <p className="password-small text-subtle-text text-center max-w-sm mx-auto">
        Don't have an account?{" "}
        <a href="/register" className="link-small text-black underline">
          Create Account
        </a>
      </p>
    </section>
  );
}