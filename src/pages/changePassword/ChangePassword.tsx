import { useState } from "react";
import type { FormEvent } from "react";
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

export default function ChangePasswordForm() {
  const [passwords, setPasswords] = useState<PasswordState>({
    current: "",
    new: "",
    confirm: "",
  });
  const { isLoading, submit } = useFormSubmit();

  const handlePasswordChange = (field: keyof PasswordState, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const validationErrors = [
      { 
        error: validatePassword(passwords.current), 
        prefix: "" 
      },
      { 
        error: validatePassword(passwords.new), 
        prefix: "New password: " 
      },
    ];

    // Check for validation errors
    for (const { error, prefix } of validationErrors) {
      if (error) {
        toast.error(prefix ? `${prefix}${error.toLowerCase()}` : error);
        return false;
      }
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

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) return;

    await submit(
      async () => {
        // YOUR API CALL HERE
        // Example: await changePassword({ currentPassword: passwords.current, newPassword: passwords.new });
        await new Promise((resolve) => setTimeout(resolve, 1500));
      },
      "Password changed successfully!",
      () => {
        setPasswords({ current: "", new: "", confirm: "" });
        // Optional: redirect or close modal
        // window.location.href = '/profile';
      }
    );
  };

  const handleCancel = () => {
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const passwordFields = [
    {
      id: "current",
      label: "Current Password",
      placeholder: "Put your current password",
      value: passwords.current,
    },
    {
      id: "new",
      label: "New Password",
      placeholder: "Put your new password",
      value: passwords.new,
    },
    {
      id: "confirm",
      label: "Confirm Password",
      placeholder: "Put your new password again",
      value: passwords.confirm,
    },
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:bg-white">
      <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden">
        <div className="md:text-white text-black md:py-15 md:px-6 py-4 text-left md:text-center md:bg-black bg-center md:bg-[url('images/onboarding-pattern.svg')]">
          <h1 className="h2">Change Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="md:py-8 py-5 space-y-6">
          {passwordFields.map((field) => (
            <ConfirmPassword
              key={field.id}
              label={field.label}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => handlePasswordChange(field.id as keyof PasswordState, e.target.value)}
              disabled={isLoading}
              noFP={false}
            />
          ))}

          <div className="flex flex-col gap-4 pt-4 md:flex-row md:justify-between">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full md:w-80 px-6 btn btn-tertiary rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-80 px-6 btn btn-primary rounded-md flex items-center justify-center gap-2"
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