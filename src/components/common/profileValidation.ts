import { useState } from "react";
import { toast } from "sonner";
import type { FormState, FieldName, Errors } from "../../components/common/profileTypes";

// VALIDATORS (cleaned and type-safe)
const validators: Record<FieldName, (value: string) => string | null> = {
  ownerName: (value) =>
    !value.trim() ? "Owner's name is required" :
    value.trim().length < 2 ? "Owner's name must be at least 2 characters" : null,

  businessName: (value) =>
    !value.trim() ? "Business name is required" :
    value.trim().length < 2 ? "Business name must be at least 2 characters" : null,

  phoneNumber: (value) => {
    if (!value.trim()) return "Phone number is required";
    const cleaned = value.replace(/[\s\-()]/g, "");
    return /^\+?\d{10,15}$/.test(cleaned)
      ? null
      : "Please enter a valid phone number";
  },

  businessType: (value) =>
    !value.trim() ? "Business type is required" : null,

  address: (value) =>
    !value.trim() ? "Address is required" :
    value.trim().length < 3 ? "Address must be at least 3 characters" : null,
};

// FORM VALIDATION HOOK
export const useProfileFormValidation = () => {
  const [errors, setErrors] = useState<Errors>({
    ownerName: null,
    businessName: null,
    phoneNumber: null,
    businessType: null,
    address: null,
  });

  const validateField = (name: FieldName, value: string) => {
    const error = validators[name](value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateAll = (formData: FormState) => {
    const newErrors = Object.fromEntries(
      (Object.keys(formData) as FieldName[]).map((key) => [
        key,
        validators[key](formData[key]),
      ])
    ) as Errors;

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => e === null);
  };

  const clearErrors = () => {
    setErrors({
      ownerName: null,
      businessName: null,
      phoneNumber: null,
      businessType: null,
      address: null,
    });
  };

  const clearFieldError = (name: FieldName) => {
    setErrors((prev: Errors): Errors => ({ ...prev, [name]: null }));
  };

  return {
    errors,
    validateField,
    validateAll,
    clearErrors,
    clearFieldError,
  };
};

// SUBMIT HOOK
export const useProfileFormSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (
    apiCall: () => Promise<void>,
    successMessage: string,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);

    try {
      await apiCall();
      toast.success(successMessage);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, submit };
};
