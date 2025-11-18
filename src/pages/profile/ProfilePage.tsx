import { useCallback } from "react";
import { Icon } from "@iconify/react";

interface ProfileData {
  shopName: string;
  shopType: string;
  ownerName: string;
  phoneNumber: string;
  address: string;
}

export default function OwnerProfile() {
  const profileData: ProfileData = {
    shopName: "Lota Provisions",
    shopType: "Retailer",
    ownerName: "Lotachi Oranu",
    phoneNumber: "08134775647",
    address: "Gariki Market",
  };

  const handleEditProfile = useCallback(() => {
    // TODO: Implement edit profile functionality
    console.log("Edit profile clicked");
  }, []);

  const handleBack = useCallback(() => {
    // TODO: Implement back navigation
    console.log("Back clicked");
  }, []);

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <header className="mb-6">
          <h1 className="h3 text-black">Owner's Profile</h1>
        </header>

        {/* Profile Card */}
        <article className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8">
          {/* Shop Info Section */}
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-gray-100">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary rounded-xl flex items-center justify-center shrink-0">
              <Icon
                icon="octicon:person-16"
                width="28"
                height="28"
                className="text-success sm:w-8 sm:h-8"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <h2 className="h3 text-black truncate">{profileData.shopName}</h2>
              <p className="body text-subtle-text">{profileData.shopType}</p>
            </div>
          </div>

          {/* Owner Details */}
          <dl className="space-y-5 sm:space-y-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-gray-100">
            <div className="flex justify-between items-center gap-2 sm:gap-4">
              <dt className="h5 text-black shrink-0 text-sm sm:text-base">Owner's name</dt>
              <dd className="body text-black text-right truncate min-w-0 text-sm sm:text-base">{profileData.ownerName}</dd>
            </div>

            <div className="flex justify-between items-center gap-2 sm:gap-4">
              <dt className="h5 text-black shrink-0 text-sm sm:text-base">Phone number</dt>
              <dd className="body text-black text-right min-w-0 text-sm sm:text-base">
                <a 
                  href={`tel:${profileData.phoneNumber}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {profileData.phoneNumber}
                </a>
              </dd>
            </div>

            <div className="flex justify-between items-center gap-2 sm:gap-4">
              <dt className="h5 text-black shrink-0 text-sm sm:text-base">Address</dt>
              <dd className="body text-black text-right truncate min-w-0 text-sm sm:text-base">{profileData.address}</dd>
            </div>
          </dl>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
            <button
              onClick={handleEditProfile}
              className="w-full md:w-80 btn btn-primary border active:border-tertiary"
              aria-label="Edit profile"
            >
              Edit Profile
            </button>
            <button
              onClick={handleBack}
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