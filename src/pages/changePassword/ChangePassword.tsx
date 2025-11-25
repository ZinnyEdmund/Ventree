import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import ConfirmPassword from "../../components/ui/confirmPassword";
import { validatePassword } from "../../components/common/validation";
import { useFormSubmit } from "../../components/common/formHooks";

interface PasswordState {
  current: string;
  new: string;
  confirm: string;
}

const INITIAL_PASSWORD_STATE: PasswordState = {
  current: "",
  new: "",
  confirm: "",
};

const PASSWORD_FIELDS = [
  {
    id: "current" as const,
    label: "Current Password",
    placeholder: "Put your current password",
  },
  {
    id: "new" as const,
    label: "New Password",
    placeholder: "Put your new password",
  },
  {
    id: "confirm" as const,
    label: "Confirm Password",
    placeholder: "Put your new password again",
  },
];

export default function ChangePasswordForm() {
  const [passwords, setPasswords] = useState<PasswordState>(INITIAL_PASSWORD_STATE);
  const { isLoading, submit } = useFormSubmit();
  const navigate = useNavigate();

  const handlePasswordChange = (field: keyof PasswordState, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    // Validate current and new passwords
    const currentError = validatePassword(passwords.current);
    if (currentError) {
      toast.error(currentError);
      return false;
    }

    const newError = validatePassword(passwords.new);
    if (newError) {
      toast.error(`New password: ${newError.toLowerCase()}`);
      return false;
    }

    // Check if passwords match
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return false;
    }

    // Check if new password is different from current
    if (passwords.current === passwords.new) {
      toast.error("New password must be different from current password");
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
        // Example: await changePassword({ currentPassword: passwords.current, newPassword: passwords.new });
        await new Promise((resolve) => setTimeout(resolve, 1500));
      },
      "Password changed successfully!",
      () => {
        setPasswords(INITIAL_PASSWORD_STATE);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:bg-white">
      <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden">
        <div className="md:text-white text-black md:py-15 md:px-6 py-4 text-left md:text-center md:bg-black bg-center md:bg-[url('images/onboarding-pattern.svg')]">
          <h1 className="h2">Change Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="md:py-8 py-5 space-y-6">
          {PASSWORD_FIELDS.map((field) => (
            <ConfirmPassword
              key={field.id}
              label={field.label}
              placeholder={field.placeholder}
              value={passwords[field.id]}
              onChange={(e) =>
                handlePasswordChange(field.id, e.target.value)
              }
              disabled={isLoading}
              noFP={false}
            />
          ))}

          <div className="flex flex-col gap-4 pt-4 md:flex-row md:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="w-full md:w-80 btn btn-tertiary rounded-md border active:border-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-80 btn btn-primary rounded-md flex items-center justify-center gap-2 border active:border-tertiary"
            >
              {isLoading ? "Saving" : "Save"}
              {isLoading && <LoaderCircle width={20} className="animate-spin" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}