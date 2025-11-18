import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Icon } from "@iconify/react";
import ProfileInput from "../../components/ui/editProfileInput";
import ProfileSelect from "../../components/ui/editProfileSelect";
import {
  useProfileFormSubmit,
  useProfileFormValidation,
} from "../../components/common/profileValidation";

type FormState = {
  ownerName: string;
  businessName: string;
  phoneNumber: string;
  businessType: string;
};

export default function EditProfile() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    ownerName: "Owner",
    businessName: "Owner Provisions",
    phoneNumber: "08134775647",
    businessType: "Provision Store",
  });

  const { isLoading, submit } = useProfileFormSubmit();
  const { errors, validateField, validateAll, clearErrors } =
    useProfileFormValidation();

  // Business type options
  const businessTypeOptions = [
    { value: "Provision Store", label: "Provision Store" },
    { value: "Grocery Store", label: "Grocery Store" },
    { value: "Supermarket", label: "Supermarket" },
    { value: "Mini Mart", label: "Mini Mart" },
  ];

  // API CALL FUNCTION
  const updateProfile = async (_data: FormState) => {
    // TODO: Replace with your actual API endpoint
    /*
    const response = await fetch('https://your-api.com/api/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yourAuthToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return await response.json();
    */

    // Temporary placeholder
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  // HANDLERS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field on change
    validateField(name, value);
  };

  const handleSubmit = async () => {
    // Validate all fields
    const isValid = validateAll(formData);

    if (!isValid) {
      return; // Don't submit if validation fails
    }

    // Submit form
    await submit(
      () => updateProfile(formData),
      "Profile updated successfully!",
      () => {
        setShowSuccess(true);
        clearErrors();
      }
    );
  };

  const handleCancel = () => {
    setFormData({
      ownerName: "Owner",
      businessName: "Owner Provisions",
      phoneNumber: "08134775647",
      businessType: "Provision Store",
    });
    clearErrors();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:bg-white">
      <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="md:text-white text-black md:py-15 md:px-6 py-4 text-left md:text-center md:bg-black bg-center md:bg-[url('images/onboarding-pattern.svg')]">
          <h1 className="h2">Edit Profile</h1>
        </div>

        {/* Form Content */}
        <div className="md:py-8 py-5 space-y-6">
          <ProfileInput
            label="Owner's Name"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            disabled={isLoading}
            error={errors.ownerName}
            placeholder="Enter owner's name"
          />

          <ProfileInput
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            disabled={isLoading}
            error={errors.businessName}
            placeholder="Enter business name"
          />

          <ProfileInput
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={isLoading}
            error={errors.phoneNumber}
            placeholder="Enter phone number"
          />

          <ProfileSelect
            label="Business Type"
            name="businessType"
            value={formData.businessType}
            options={businessTypeOptions}
            onChange={handleChange}
            disabled={isLoading}
            error={errors.businessType}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-4 md:flex-row md:justify-between">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full md:w-80 btn btn-tertiary rounded-md  border active:border-tertiary"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full md:w-80 btn btn-primary rounded-md flex items-center justify-center gap-2  border active:border-tertiary"
            >
              {isLoading ? "Saving" : "Save"}
              {isLoading && <LoaderCircle className="w-5 h-5 animate-spin" />}
            </button>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-2xl min-h-[380px] flex flex-col items-center justify-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-white">
                  <Icon icon="stash:check-solid" width="48" height="48" />
                </span>
              </div>

              {/* Text Content */}
              <div className="mb-10">
                <h2 className="h4 text-secondary mb-3">Success!</h2>
              </div>

              {/* Button */}
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full max-w-[200px] px-8 py-3 btn btn-sec border active:border-tertiary"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
