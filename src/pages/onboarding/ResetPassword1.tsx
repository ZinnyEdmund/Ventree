import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Icon } from "@iconify/react";
import PasswordInput from "../../components/ui/passwordInput";
import ConfirmPassword from "../../components/ui/confirmPassword";
import { validatePassword } from "../../components/common/validation";
import { useFormSubmit } from "../../components/common/formHooks";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { isLoading, submit } = useFormSubmit();

  const validateForm = (): boolean => {
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validatePassword(formData.confirmPassword);

    if (passwordError) {
      toast.error(passwordError);
      return false;
    }

    if (confirmPasswordError) {
      toast.error(confirmPasswordError);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await submit(
      async () => {
        // YOUR API CALL HERE
        await new Promise((resolve) => setTimeout(resolve, 1500));
      },
      "Password reset successful!",
      () => {
        setFormData({ password: "", confirmPassword: "" });
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
        className="w-full max-w-sm mx-auto space-y-7"
      >
        <PasswordInput
          label="New Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          noFP={false}
        />

        <ConfirmPassword
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          noFP={false}
        />

        <button
          type="submit"
          className="w-full md:w-70 mx-auto mt-20 btn btn-primary flex items-center justify-center gap-2 border active:border-tertiary"
          disabled={isLoading}
        >
          Enter
          {isLoading && <LoaderCircle width={20} className="animate-spin" />}
        </button>
      </form>
    </section>
  );
}