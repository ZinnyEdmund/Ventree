import { useState } from "react";
import { toast } from "sonner";

// ==========================================
// FORM SUBMIT HOOK
// ==========================================
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
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, submit };
};

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================
export const validateOwnerName = (value: string): string | null => {
  if (!value.trim()) return "Owner's name is required";
  if (value.trim().length < 2) return "Owner's name must be at least 2 characters";
  return null;
};

export const validateBusinessName = (value: string): string | null => {
  if (!value.trim()) return "Business name is required";
  if (value.trim().length < 2) return "Business name must be at least 2 characters";
  return null;
};

export const validatePhoneNumber = (value: string): string | null => {
  if (!value.trim()) return "Phone number is required";
  
  // Remove spaces, dashes, and parentheses for validation
  const cleanedNumber = value.replace(/[\s\-()]/g, '');
  
  // Check if it's a valid format (allow + for country code)
  if (!/^\+?[\d]{10,15}$/.test(cleanedNumber)) {
    return "Please enter a valid phone number";
  }
  
  return null;
};

export const validateBusinessType = (value: string): string | null => {
  if (!value.trim()) return "Business type is required";
  return null;
};

// ==========================================
// ERROR HANDLING
// ==========================================
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
};

// ==========================================
// FORM VALIDATION HOOK
// ==========================================
export const useProfileFormValidation = () => {
  const [errors, setErrors] = useState<{
    ownerName: string | null;
    businessName: string | null;
    phoneNumber: string | null;
    businessType: string | null;
  }>({
    ownerName: null,
    businessName: null,
    phoneNumber: null,
    businessType: null,
  });

  const validateField = (name: string, value: string) => {
    let error: string | null = null;

    switch (name) {
      case 'ownerName':
        error = validateOwnerName(value);
        break;
      case 'businessName':
        error = validateBusinessName(value);
        break;
      case 'phoneNumber':
        error = validatePhoneNumber(value);
        break;
      case 'businessType':
        error = validateBusinessType(value);
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateAll = (formData: {
    ownerName: string;
    businessName: string;
    phoneNumber: string;
    businessType: string;
  }) => {
    const newErrors = {
      ownerName: validateOwnerName(formData.ownerName),
      businessName: validateBusinessName(formData.businessName),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      businessType: validateBusinessType(formData.businessType),
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== null);
  };

  const clearErrors = () => {
    setErrors({
      ownerName: null,
      businessName: null,
      phoneNumber: null,
      businessType: null,
    });
  };

  return { errors, validateField, validateAll, clearErrors };
};