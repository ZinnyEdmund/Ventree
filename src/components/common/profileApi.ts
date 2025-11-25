import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import type { FormState } from "../../components/common/profileTypes";
import { getAccessTokenCookie } from "../../lib/cookies";

export const useProfileAPI = () => {
  // Get shopId from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const shopId = user?.shopId;

  // Debug logs
  console.log("=== Profile API Debug ===");
  console.log("User from Redux:", user);
  console.log("Is Logged In:", isLoggedIn);
  console.log("Shop ID:", shopId);
  console.log("=======================");

  const fetchProfile = async (): Promise<FormState> => {
    if (!shopId) {
      console.error("Shop ID missing! User object:", user);
      throw new Error("Shop ID not found. Please log in again.");
    }

    try {
      console.log("Fetching profile for shopId:", shopId);
      
      // Get token from cookies
      const token = getAccessTokenCookie();
      
      const response = await fetch(`http://localhost:8000/shop/${shopId}/profile`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch profile: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        ownerName: data.ownerName || data.owner_name || "",
        businessName: data.businessName || data.shopName || "",
        phoneNumber: data.phoneNumber || data.phone_number || "",
        businessType: data.businessType || data.shopType || "",
        address: data.address || "",
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  };

  const updateProfile = async (formData: FormState): Promise<void> => {
    if (!shopId) {
      throw new Error("Shop ID not found. Please log in again.");
    }

    try {
      console.log("Updating profile for shopId:", shopId);
      
      // Get token from cookies
      const token = getAccessTokenCookie();
      
      const response = await fetch(`http://localhost:8000/shop/${shopId}/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update profile: ${response.status}`);
      }

      // Parse response to ensure it was successful
      await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return { fetchProfile, updateProfile };
};