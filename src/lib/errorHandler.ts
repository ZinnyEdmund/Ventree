/**
 * Centralized API error handler
 * 
 * Handles various error response formats:
 * - Validation errors with details array
 * - Standard error objects with message
 * - Unauthorized/401 errors (triggers logout)
 * - Fallback error messages
 * 
 * @param error - The error object from RTK Query or API call
 */
import { toast } from "sonner";
import { clearAuthTokens } from "./cookies";

export function handleApiError(error: unknown): void {
  console.error("API Error:", error);

  // Handle RTK Query error structure
  const errorData = (error as { data?: unknown; message?: string; status?: number })?.data as {
    error?: { message?: string; details?: Array<{ msg?: string; path?: string }> };
    message?: string | string[];
  } | undefined;
  const errorObject = errorData?.error;
  const errorStatus = (error as { status?: number })?.status;
  const fallbackMessage = (error as { message?: string })?.message || errorData?.message;

  // Handle unauthorized/network issues
  if (
    (typeof errorData?.message === "string" && errorData.message.startsWith("Unauthorized")) ||
    (typeof fallbackMessage === "string" && fallbackMessage.startsWith("Unauthorized")) ||
    errorData?.message === "Missing Authorization Header" ||
    errorStatus === 401
  ) {
    toast.error("Session expired. Please log in again.");
    // Clear all tokens from cookies
    clearAuthTokens();
    // Redux Persist will handle clearing the persisted auth state
    window.location.href = "/login";
    return;
  }

  // Handle validation errors with details array
  // Structure: { success: false, error: { message: "...", details: [{ msg: "...", path: "..." }] } }
  if (errorObject?.details && Array.isArray(errorObject.details) && errorObject.details.length > 0) {
    // Display each validation error message
    errorObject.details.forEach((detail) => {
      if (detail?.msg) {
        toast.error(detail.msg);
      }
    });
    return;
  }

  // Handle error object with message
  if (errorObject?.message && typeof errorObject.message === "string") {
    toast.error(errorObject.message);
    return;
  }

  // Handle array of messages
  if (Array.isArray(errorData?.message)) {
    errorData.message.forEach((msg: string) => toast.error(msg));
    return;
  }

  // Handle single string message from error.data.message
  if (typeof errorData?.message === "string") {
    toast.error(errorData.message);
    return;
  }

  // Handle fallback error message
  if (typeof fallbackMessage === "string") {
    toast.error(fallbackMessage);
    return;
  }

  // Default error message
  toast.error("Something went wrong. Please try again.");
}