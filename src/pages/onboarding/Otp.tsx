import { useState, useRef, useCallback } from "react";
import type { FormEvent } from "react";
import type { ClipboardEvent  } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { handleApiError } from "../../components/common/validation";
import { useFormSubmit } from "../../components/common/formHooks";

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
  const { isLoading, submit } = useFormSubmit();
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback((index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 5);

    if (!/^\d+$/.test(pastedData)) {
      toast.error("Please paste numbers only");
      return;
    }

    const newOtp = [...pastedData.split(""), ...Array(5).fill("")].slice(0, 5);
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 4)]?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (otp.some((digit) => !digit)) {
      toast.error("Please enter all 5 digits");
      return;
    }

    await submit(
      async () => {
        // YOUR API CALL HERE
        await new Promise((resolve) => setTimeout(resolve, 1500));
      },
      "Phone number verified successfully!"
    );
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // YOUR API CALL HERE
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Code resent successfully!");
      setOtp(Array(5).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="w-full flex flex-col md:space-y-6 space-y-16 justify-between md:p-6">
      <div className="text-center">
        <h2 className="h3 text-black mb-2">Confirm Your Phone Number</h2>
        <p className="body-small text-subtle mb-8">
          An SMS with an OTP code has been sent to your phone number. Kindly input the OTP in the boxes below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-12">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              // ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className="w-12 h-12 border border-secondary-4 h4 rounded text-center text-black focus:outline-success focus:ring-1 focus:ring-Tertiary"
            />
          ))}
        </div>

        <div className="w-full max-w-sm mx-auto space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 btn btn-primary flex items-center justify-center gap-2 border active:border-tertiary"
          >
            {isLoading ? "Verifying" : "Enter"}
            {isLoading && <LoaderCircle width={20} className="animate-spin" />}
          </button>

          <p className="text-subtle-text text-center">
            Did not receive code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="link-small text-black underline"
            >
              {isResending ? "Resending" : "Resend Code"}
            </button>
          </p>
        </div>
      </form>
    </section>
  );
}
