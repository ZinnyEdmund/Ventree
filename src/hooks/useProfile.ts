import { useState, useEffect } from "react";
import { toast } from "sonner";
import { handleApiError } from "../components/common/validation";

interface ProfileData {
  ownerName: string;
  businessName: string;
  phoneNumber: string;
  businessType: string;
}

export const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // YOUR API CALL TO FETCH PROFILE
        // const response = await fetch('YOUR_API_ENDPOINT/profile', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // if (!response.ok) throw new Error('Failed to fetch profile');
        // const data = await response.json();
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API response
        const data = {
          ownerName: 'John Doe',
          businessName: 'Doe Provisions',
          phoneNumber: '08134775647',
          businessType: 'Provision Store'
        };
        
        setProfileData(data);
      } catch (error) {
        toast.error(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profileData, isLoading };
};


