import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useProfileAPI } from "../../components/common/profileApi";

interface ProfileData {
  shopName: string;
  shopType: string;
  ownerName: string;
  phoneNumber: string;
  address: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchProfile } = useProfileAPI();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await fetchProfile();
        
        setProfileData({
          shopName: data.businessName,
          shopType: data.businessType,
          ownerName: data.ownerName,
          phoneNumber: data.phoneNumber,
          address: data.address,
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]); // Removed fetchProfile to prevent infinite loops

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <LoaderCircle className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="ph:warning" width="32" height="32" className="text-red-600" />
          </div>
          <h2 className="h4 text-black mb-2">Failed to Load Profile</h2>
          <p className="body text-gray-600 mb-6">{error || "Profile data not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const profileFields = [
    { label: "Owner's name", value: profileData.ownerName },
    { label: "Phone number", value: profileData.phoneNumber, isPhone: true },
    { label: "Address", value: profileData.address },
  ];

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <header className="mb-6">
          <h1 className="h3 text-black">Owner's Profile</h1>
        </header>

        {/* Profile Card */}
        <article className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
          {/* Shop Info Section */}
          <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-100">
            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center shrink-0">
              <Icon
                icon="octicon:person-16"
                width="32"
                height="32"
                className="text-success"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <h2 className="h3 text-black truncate">{profileData.shopName}</h2>
              <p className="body text-subtle-text">{profileData.shopType}</p>
            </div>
          </div>

          {/* Owner Details */}
          <dl className="space-y-6 mb-10 pb-10 border-b border-gray-100">
            {profileFields.map(({ label, value, isPhone }) => (
              <div key={label} className="flex justify-between items-center gap-4">
                <dt className="h5 text-black shrink-0">{label}</dt>
                <dd className="body text-black text-right truncate min-w-0">
                  {isPhone ? (
                    <a href={`tel:${value}`} className="hover:underline">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
            <button
              onClick={() => navigate("/edit-profile")}
              className="w-full md:w-80 btn btn-primary border active:border-tertiary"
              aria-label="Edit profile"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full md:w-80 btn btn-tertiary border active:border-tertiary transition-colors"
              aria-label="Go back"
            >
              Back
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}