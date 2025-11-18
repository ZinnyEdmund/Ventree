import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { validatePhoneNumber, validatePassword, formatNigerianPhoneNumber } from "../../components/common/validation";
import { Icon } from "@iconify/react";
import { useRegisterMutation } from "../../services/auth.service";
import { handleApiError } from "../../lib/errorHandler";
import { STORAGE_KEYS } from "../../constants/storage";

export default function Signup() {
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const validateForm = (): boolean => {
    const errors = [
      !shopName.trim() ? "Shop name is required" : null,
      !ownerName.trim() ? "Owner name is required" : null,
      validatePhoneNumber(phoneNumber),
      validatePassword(password),
    ].filter(Boolean);

    if (errors.length > 0) {
      toast.error(errors[0]!);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) return;

    // Format phone number to Nigerian international format
    const formattedPhoneNumber = formatNigerianPhoneNumber(phoneNumber);

    try {
      const result = await registerMutation({
        shopName: shopName.trim(),
        phoneNumber: formattedPhoneNumber,
        ownerName: ownerName.trim(),
        password,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Registration successful! Please verify your OTP.");
        // Store shopName and formatted phoneNumber for OTP verification
        localStorage.setItem(STORAGE_KEYS.PENDING_VERIFICATION, JSON.stringify({ shopName: shopName.trim(), phoneNumber: formattedPhoneNumber }));
        navigate('/otp');
      }
    } catch (error: any) {
      handleApiError(error);
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
      <div className="text-center text-black md:pb-7">
        <h2 className="h3 pb-2">Less Stress</h2>
        <p className="h3">More Business</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-6">
        <div>
          <label className="block text-black label md:mb-1 mb-2">Shop Name</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Enter your shop name"
            className="w-full text-black border border-secondary-4 focus:ring-2 focus:ring-tertiary rounded-lg p-3 outline-none body"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-black label md:mb-1 mb-2">Owner Name</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter owner name"
            className="w-full text-black border border-secondary-4 focus:ring-2 focus:ring-tertiary rounded-lg p-3 outline-none body"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-black label md:mb-1 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full text-black border border-secondary-4 focus:ring-2 focus:ring-tertiary rounded-lg p-3 outline-none body"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-black label md:mb-1 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Put your password"
            className="w-full text-black border border-secondary-4 focus:ring-2 focus:ring-tertiary rounded-lg p-3 outline-none body"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary flex items-center justify-center gap-2 border active:border-tertiary"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account" : "Create Account"}
          {isLoading && <LoaderCircle width={20} className="animate-spin" />}
        </button>
      </form>

      <p className="password-small text-subtle-text text-center max-w-sm mx-auto">
        Already have an account?{" "}
        <a href="/login" className="link-small text-black underline">
          Login
        </a>
      </p>
    </section>
  );
}