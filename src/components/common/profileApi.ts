import type { FormState } from "../../components/common/profileTypes";

export const useProfileAPI = () => {
  // TODO: Replace this with your actual method of getting the shopId
  // Choose ONE of these options:
  
  // OPTION 1: From localStorage (most common)
  const shopId = localStorage.getItem("shopId");
  
  // OPTION 2: From a specific key you're using
  // const shopId = localStorage.getItem("user_shop_id");
  
  // OPTION 3: Hardcode for testing (REMOVE AFTER TESTING!)
  // const shopId = "123";
  
  if (!shopId) {
    throw new Error("Shop ID not found. Please log in again.");
  }

  const fetchProfile = async (): Promise<FormState> => {
    try {
      const response = await fetch(`http://localhost:8000/shop/${shopId}/profile`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
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
    try {
      const response = await fetch(`http://localhost:8000/shop/${shopId}/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
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