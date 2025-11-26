import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  shopName: string;
  shopType: string;
  ownerName: string;
  phoneNumber: string;
  address: string;
}

export default function OwnerProfile() {
  const navigate = useNavigate();

  const profileData: ProfileData = {
    shopName: "Lota Provisions",
    shopType: "Retailer",
    ownerName: "Lotachi Oranu",
    phoneNumber: "08134775647",
    address: "Gariki Market",
  };

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