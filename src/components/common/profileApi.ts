import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import type { FormState } from "../../components/common/profileTypes";
import { getAccessTokenCookie } from "../../lib/cookies";

// Define a type for the user object with all possible fields
interface UserWithShopData {
  shopId?: string;
  userName?: string;
  ownerName?: string;
  shopName?: string;
  businessName?: string;
  phoneNumber?: string;
  shopType?: string;
  businessType?: string;
  address?: string;
}

export const useProfileAPI = () => {
  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isInitialized = useSelector((state: RootState) => state.auth._initialized);

  // Extract shopId correctly
  const shopId = (user as UserWithShopData | null)?.shopId;

  const fetchProfile = async (): Promise<FormState> => {
    // Check if auth is initialized first
    if (!isInitialized) {
      throw new Error("Authentication initializing. Please wait...");
    }

    if (!isLoggedIn || !user) {
      throw new Error("Please log in to view your profile.");
    }

    if (!shopId) {
      throw new Error("Shop ID not found. Please log in again.");
    }

    // OPTIMIZED: Use Redux data directly instead of fetching from backend
    // This avoids CORS issues and provides instant data
    const userObj = user as UserWithShopData;
    // console.log("Loading profile from Redux store");

    return {
      ownerName: userObj.userName || userObj.ownerName || "",
      businessName: userObj.shopName || userObj.businessName || "",
      phoneNumber: userObj.phoneNumber || "",
      businessType: userObj.shopType || userObj.businessType || "",
      address: userObj.address || "",
    };
  };

  const updateProfile = async (formData: FormState): Promise<void> => {
    if (!isInitialized) {
      throw new Error("Authentication initializing. Please wait...");
    }

    if (!isLoggedIn) {
      throw new Error("Please log in to update your profile.");
    }

    if (!shopId) {
      throw new Error("Shop ID not found. Please log in again.");
    }

    try {
      const token = getAccessTokenCookie();
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }

      // FIX: Corrected URL with actual shopId value
      const response = await fetch(`https://backenddomain/shops/${shopId}/kyc/update`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ownerName: formData.ownerName,
          shopName: formData.businessName,
          phoneNumber: formData.phoneNumber,
          shopType: formData.businessType,
          address: formData.address,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update profile: ${response.status}`);
      }

      await response.json();
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return { fetchProfile, updateProfile };
};