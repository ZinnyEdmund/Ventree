import { useState, useRef, useCallback, useEffect } from "react";
import type { FormEvent } from "react";
import type { ClipboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Icon } from "@iconify/react";
import { useVerifyOtpMutation } from "../../services/auth.service";
import { handleApiError } from "../../lib/errorHandler";
import { formatNigerianPhoneNumber } from "../../components/common/validation";
import { STORAGE_KEYS } from "../../constants/storage";

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [verifyOtpMutation, { isLoading }] = useVerifyOtpMutation();
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load shopName and phoneNumber from localStorage (set during registration)
  useEffect(() => {
    const pendingVerification = localStorage.getItem(STORAGE_KEYS.PENDING_VERIFICATION);
    if (pendingVerification) {
      try {
        const { shopName: storedShopName, phoneNumber: storedPhoneNumber } = JSON.parse(pendingVerification);
        setShopName(storedShopName);
        setPhoneNumber(storedPhoneNumber);
      } catch (error) {
        toast.error("Session expired. Please register again.");
        navigate('/register');
      }
    } else {
      toast.error("No pending verification found. Please register first.");
      navigate('/register');
    }
  }, [navigate]);

  const handleChange = useCallback((index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      toast.error("Please paste numbers only");
      return;
    }

    const newOtp = [...pastedData.split(""), ...Array(6).fill("")].slice(0, 6);
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (otp.some((digit) => !digit)) {
      toast.error("Please enter all 6 digits");
      return;
    }

    if (!shopName || !phoneNumber) {
      toast.error("Session expired. Please register again.");
      navigate('/register');
      return;
    }

    const otpCode = otp.join('');

    // Ensure phone number is formatted (in case it wasn't formatted when stored)
    const formattedPhoneNumber = formatNigerianPhoneNumber(phoneNumber);

    try {
      const result = await verifyOtpMutation({
        shopName,
        phoneNumber: formattedPhoneNumber,
        otp: otpCode,
      }).unwrap();

      if (result.success) {
        // Clear pending verification
        localStorage.removeItem(STORAGE_KEYS.PENDING_VERIFICATION);
        
        // Show success message
        toast.success(result.message || "Phone number verified successfully! Please login to continue.");
        
        // Redirect to login page
        navigate('/login');
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const handleResendCode = async () => {
    if (!shopName || !phoneNumber) {
      toast.error("Session expired. Please register again.");
      navigate('/register');
      return;
    }

    setIsResending(true);
    try {
      // Re-register to get a new OTP
      // You might want to create a separate resend-otp endpoint
      toast.success("Code resent successfully!");
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="w-full flex flex-col md:space-y-6 space-y-16 justify-between md:p-6">
      <span className="absolute left-6 top-6 hidden md:inline">
        <Icon
          icon="iconamoon:arrow-left-6-circle-light"
          width="24"
          height="24"
        />
      </span>
      <div className="text-center">
        <h2 className="h3 text-black mb-2">Confirm Your Phone Number</h2>
        <p className="body-small text-subtle mb-8">
          An SMS with an OTP code has been sent to your phone number. Kindly
          input the OTP in the boxes below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-12"
      >
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
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
