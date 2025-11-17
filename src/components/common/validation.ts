export const validateBusinessNumber = (value: string): string | null => {
  if (!value.trim()) return "Business number is required";
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value.trim()) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validatePhoneNumber = (value: string): string | null => {
  if (!value.trim()) return "Phone number is required";
  if (!/^\+?[\d\s-()]+$/.test(value)) return "Please enter a valid phone number";
  return null;
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
};
