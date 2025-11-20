import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import {
  validatePhoneNumber,
  validatePassword,
} from "../../components/common/validation";
import PasswordInput from "../../components/ui/passwordInput";
import TextInput from "../../components/ui/textInput";
import PhoneNumberInput from "../../components/ui/phoneNumber";
import { useFormSubmit } from "../../components/common/formHooks";
import { Icon } from "@iconify/react";

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
      <span className="absolute left-6 top-6 hidden md:inline">
        <Icon
          icon="iconamoon:arrow-left-6-circle-light"
          width="24"
          height="24"
        />
      </span>
      <div className="text-center text-black leading-snug">
        <h2 className="h3">Less Stress</h2>
        <p className="h3">More Business</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto space-y-6"
      >
        <TextInput
          label="Business Name"
          placeholder="Put your business number"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          disabled={isLoading}
        />

        <PhoneNumberInput
          label="Phone Number"
          value={password}
          type="tel"
          onChange={(e) => setPassword(e.target.value)}
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
