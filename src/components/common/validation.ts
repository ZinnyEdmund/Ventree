export const validateBusinessNumber = (value: string): string | null => {
  if (!value.trim()) return "Business number is required";
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value.trim()) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return null;
};

/**
 * Formats a phone number to Nigerian international format (+234)
 * Handles various input formats:
 * - Local format: 08123456789 -> +2348123456789
 * - International with +: +2348123456789 -> +2348123456789
 * - International without +: 2348123456789 -> +2348123456789
 * - 10 digits: 8123456789 -> +2348123456789
 */
export const formatNigerianPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Remove leading + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // Handle local format (starts with 0, should be 11 digits: 0 + 10 digits)
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    // Remove leading 0 and add country code
    cleaned = '234' + cleaned.substring(1);
  }
  // Handle international format (starts with 234, should be 13 digits: 234 + 10 digits)
  else if (cleaned.startsWith('234') && cleaned.length === 13) {
    // Already has country code, keep as is
  }
  // Handle 10-digit number (assume it's a local number without leading 0)
  else if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
    cleaned = '234' + cleaned;
  }
  // If it doesn't match any pattern, try to extract the last 10 digits
  else {
    // Extract last 10 digits
    const last10Digits = cleaned.slice(-10);
    if (last10Digits.length === 10 && /^\d{10}$/.test(last10Digits)) {
      cleaned = '234' + last10Digits;
    } else {
      // If we can't format it properly, return as is (validation will catch it)
      return '+' + cleaned;
    }
  }
  
  // Ensure it starts with +234
  return '+' + cleaned;
};

/**
 * Validates phone number format (10-15 digits in international format)
 * Accepts Nigerian phone numbers in various formats
 */
export const validatePhoneNumber = (value: string): string | null => {
  if (!value.trim()) return "Phone number is required";
  
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, '');
  
  // Check if it's empty after cleaning
  if (!cleaned || cleaned.length < 10) {
    return "Phone number must be at least 10 digits";
  }
  
  // Check if it's too long (max 15 digits for international format)
  const digitsOnly = cleaned.replace(/\+/g, '');
  if (digitsOnly.length > 15) {
    return "Phone number must not exceed 15 digits";
  }
  
  // Validate format - should contain only digits and optional +
  if (!/^\+?[\d]+$/.test(cleaned)) {
    return "Please enter a valid phone number";
  }
  
  // Check if it's a valid Nigerian number format
  // Accepts: 0XXXXXXXXX, +234XXXXXXXXX, 234XXXXXXXXX, or XXXXXXXXX (10 digits)
  const withoutPlus = cleaned.replace(/\+/g, '');
  
  // If it starts with 0, it should be 11 digits total (0 + 10 digits)
  if (withoutPlus.startsWith('0') && withoutPlus.length !== 11) {
    return "Invalid phone number format";
  }
  
  // If it starts with 234, it should be 13 digits total (234 + 10 digits)
  if (withoutPlus.startsWith('234') && withoutPlus.length !== 13) {
    return "Invalid phone number format";
  }
  
  // If it's just digits, should be 10-11 digits
  if (!withoutPlus.startsWith('234') && !withoutPlus.startsWith('0')) {
    if (withoutPlus.length < 10 || withoutPlus.length > 11) {
      return "Phone number must be 10-11 digits";
    }
  }
  
  return null;
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
};
