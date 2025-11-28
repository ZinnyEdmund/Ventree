import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import TextInput from "../../components/ui/textInput";
import PasswordInput from "../../components/ui/passwordInput";
import {
  validatePassword,
  validatePhoneNumber,
  formatNigerianPhoneNumber,
} from "../../components/common/validation";
import { Icon } from "@iconify/react";
import { useLoginMutation } from "../../services/auth.service";
import { login } from "../../state/Store/authSlice";
import type { AppDispatch } from "../../state/store";
import { handleApiError } from "../../lib/errorHandler";

export default function Login() {
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loginMutation, { isLoading }] = useLoginMutation();

  const validateForm = (): boolean => {
    const errors = [
      !shopName.trim() ? "Shop name is required" : null,
      validatePhoneNumber(phoneNumber),
      validatePassword(password),
    ].filter(Boolean);

    if (errors.length > 0) {
      toast.error(errors[0]!);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Format phone number to Nigerian international format
      const formattedPhoneNumber = formatNigerianPhoneNumber(phoneNumber);


      const result = await loginMutation({
        shopName: shopName.trim(),
        phoneNumber: formattedPhoneNumber,
        password,
      }).unwrap();
      // console.log('Login result:', result);
      if (result.success && result.data) {
        const { accessToken, refreshToken, role, owner, shop, staff } =
          result.data;

        // Construct user object from API response
        const user = {
          userId: role === "owner" ? staff?.id || shop?.id || "" : staff?.id || "",
          shopId: shop?.id || "",
          shopName: shop?.shopName || "",
          phoneNumber: owner?.phoneNumber || shop?.phoneNumber || "",
          userName:
            role === "owner" ? owner?.name || "" : staff?.staffName || "",
          role: role as "owner" | "staff",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Dispatch login action to store tokens and user
        dispatch(login({ user, accessToken, refreshToken }));

        toast.success(result.data.message || "Login successful!");

        // Use requestAnimationFrame to ensure state is updated and persisted before navigation
        requestAnimationFrame(() => {
          // Redirect based on user role
          if (user.role === "staff") {
            navigate("/record-sales", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        });
      }
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };

  return (
    <section className="w-full flex flex-col md:space-y-7 space-y-16 justify-between md:p-3">
      <Link to="/" className="absolute left-6 top-6 hidden md:inline">
        <Icon
          icon="iconamoon:arrow-left-6-circle-light"
          width="24"
          height="24"
        />
      </Link>

      <div className="text-center text-black">
        <h2 className="h3 pb-2">Welcome Back!</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto space-y-6"
      >
        <TextInput
          label="Business Name"
          placeholder="Enter your shop name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          disabled={isLoading}
        />

        <TextInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoading}
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full btn btn-primary flex items-center justify-center gap-2 border active:border-tertiary"
          disabled={isLoading}
        >
          {isLoading ? "Logging in" : "Login"}
          {isLoading && <LoaderCircle width={20} className="animate-spin" />}
        </button>
      </form>

      <p className="password-small text-subtle-text text-center max-w-sm mx-auto">
        Don't have an account?{" "}
        <a href="/register" className="link-small text-black underline">
          Create Account
        </a>
      </p>
    </section>
  );
}
