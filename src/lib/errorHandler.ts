import { toast } from "sonner";
import { clearAuthTokens } from "./cookies";

export function handleApiError(error: unknown): void {
  console.error("API Error:", error);

  const err = error as {
    status?: number;
    data?: {
      success?: boolean;
      message?: string | string[];
      error?: {
        message?: string;
        code?: string;
        details?: Array<{ msg?: string; path?: string }>;
      };
    };
  };

  const status = err?.status;
  const apiError = err?.data?.error;
  const apiMessage = err?.data?.message;

  // --- 1. Handle 401 Unauthorized ---
  if (status === 401 || apiError?.code === "AUTHENTICATION_ERROR") {
    toast.error(apiError?.message || "Session expired. Please log in again.");
    clearAuthTokens();
    return;
  }

  // --- 2. Handle Validation Errors (details) ---
  if (apiError?.details?.length) {
    apiError.details.forEach((d) => {
      if (d.msg) toast.error(d.msg);
    });
    return;
  }

  // --- 3. Handle error.error.message (most common) ---
  if (apiError?.message) {
    toast.error(apiError.message);
    return;
  }

  // --- 4. Handle array messages ---
  if (Array.isArray(apiMessage)) {
    apiMessage.forEach((msg) => toast.error(msg));
    return;
  }

  // --- 5. Handle string message ---
  if (typeof apiMessage === "string") {
    toast.error(apiMessage);
    return;
  }

  // --- 6. Fallback ---
  toast.error("Something went wrong. Please try again.");
}