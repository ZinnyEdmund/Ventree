import { useState, useRef } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

export default function OtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Create refs for each input to handle auto-focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle input change and auto-focus next box
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to go to previous input
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste - auto-fill all boxes
  type PasteEvent = React.ClipboardEvent<HTMLInputElement>;

  const handlePaste = (e: PasteEvent) => {
    e.preventDefault();
    const pastedData: string = e.clipboardData.getData("text").slice(0, 5);

    if (!/^\d+$/.test(pastedData)) {
      toast.error("Please paste numbers only");
      return;
    }

    const newOtp: string[] = pastedData.split("");
    while (newOtp.length < 5) newOtp.push("");
    setOtp(newOtp);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Check if all boxes are filled
    if (otp.some((digit) => !digit)) {
      toast.error("Please enter all 5 digits");
      return;
    }

    setIsLoading(true);

    try {
      // YOUR API CALL GOES HERE
      // const response = await fetch('YOUR_API_ENDPOINT/verify-otp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     otp: otpCode,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Invalid OTP');
      // }
      //
      // const data = await response.json();

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Phone number verified successfully!");

      // Redirect after success
      // window.location.href = '/dashboard';
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Invalid OTP. Please try again.";
      toast.error(message);
      setOtp(["", "", "", "", ""]); // Clear OTP on error
      inputRefs.current[0]?.focus(); // Focus first input
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      // YOUR API CALL GOES HERE
      // const response = await fetch('YOUR_API_ENDPOINT/resend-otp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to resend code');
      // }

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Code resent successfully!");
      setOtp(["", "", "", "", ""]); // Clear OTP
      inputRefs.current[0]?.focus(); // Focus first input
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Failed to resend code. Please try again.";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="w-full flex flex-col md:space-y-6 space-y-16 justify-between md:p-6">
      <div className="text-center">
        <h2 className="h3 text-black mb-2">
          Confirm Your Phone Number
        </h2>
        <p className="body-small text-subtle mb-8">
          An SMS with an OTP code has been sent to your phone number. Kindly
          input the OTP in the boxes below.
        </p>
      </div>

      <div className="flex flex-col justify-between items-center space-y-12 md:space-y-19">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
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
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2 btn btn-primary flex items-center justify-center gap-2 border active:border-tertiary"
          >
            {isLoading ? "Verifying" : "Enter"}
            {isLoading && <LoaderCircle width={20} className="animate-spin" />}
          </button>

          <p className="text-subtle-text text-center mt-4">
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
      </div>
    </section>
  );
}
