import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Icon } from "@iconify/react";
import TextInput from "../../components/ui/textInput";
import {
  validateBusinessNumber,
  validatePhoneNumber,
} from "../../components/common/validation";
import { useFormSubmit } from "../../components/common/formHooks";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
  });
  const { isLoading, submit } = useFormSubmit();

  const validateForm = (): boolean => {
    const errors = [
      validateBusinessNumber(formData.businessName),
      validatePhoneNumber(formData.phoneNumber),
    ].filter(Boolean);

    if (errors.length > 0) {
      toast.error(errors[0]!);
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
        setFormData({ businessName: "", phoneNumber: "" });
      }
    );
  };

  return (
    <section className="w-full flex flex-col md:space-y-16 space-y-16 justify-between md:p-6">
      <Link to="/login" className="absolute left-6 top-6 hidden md:inline">
        <Icon
          icon="iconamoon:arrow-left-6-circle-light"
          width="24"
          height="24"
        />
      </Link>

      <div className="text-center text-black">
        <h2 className="h3 pb-2">Reset Password</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto space-y-7"
      >
        <TextInput
          label="Business Name"
          placeholder="Enter your shop name"
          value={formData.businessName}
          onChange={(e) =>
            setFormData({ ...formData, businessName: e.target.value })
          }
          disabled={isLoading}
        />

        <TextInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          disabled={isLoading}
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