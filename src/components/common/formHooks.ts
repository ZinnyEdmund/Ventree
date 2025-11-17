import { useState } from "react";
import { toast } from "sonner";
import { handleApiError } from "./validation";

export const useFormSubmit = () => {
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
