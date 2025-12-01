import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Icon } from "@iconify/react";
import ProfileInput from "../../components/ui/editProfileInput";
import ProfileSelect from "../../components/ui/editProfileSelect";
import type { FieldName } from "../../components/common/profileTypes";
import {
  useProfileFormSubmit,
  useProfileFormValidation
} from "../../components/common/profileValidation";
import { useProfileAPI } from "../../components/common/profileApi";
import { useDispatch } from "react-redux"; 


type FormState = {
  ownerName: string;
  businessName: string;
  phoneNumber: string;
  businessType: string;
  address: string;
};

const INITIAL_FORM_DATA: FormState = {
  ownerName: "",
  businessName: "",
  phoneNumber: "",
  businessType: "",
  address: "",
};

const BUSINESS_TYPE_OPTIONS = [
  { value: "Provision Store", label: "Provision Store" },
  { value: "Grocery Store", label: "Grocery Store" },
  { value: "Supermarket", label: "Supermarket" },
  { value: "Mini Mart", label: "Mini Mart" },
  { value: "Retailer", label: "Retailer" },
];

const FORM_FIELDS = [
  {
    label: "Owner's Name",
    name: "ownerName" as const,
    placeholder: "Enter owner's name",
    type: "text" as const,
  },
  {
    label: "Business Name",
    name: "businessName" as const,
    placeholder: "Enter business name",
    type: "text" as const,
  },
  {
    label: "Phone Number",
    name: "phoneNumber" as const,
    placeholder: "Enter phone number",
    type: "tel" as const,
  },
  {
    label: "Address",
    name: "address" as const,
    placeholder: "Enter address",
    type: "text" as const,
  },
];

export default function EditProfile() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_DATA);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const navigate = useNavigate();
    const dispatch = useDispatch(); 

  // Custom hooks
  const { isLoading, submit } = useProfileFormSubmit();
  const { errors, validateField, validateAll, clearErrors, clearFieldError } =
    useProfileFormValidation();
  const { fetchProfile, updateProfile } = useProfileAPI();

  // Fetch current profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setFetchError(null);
        const data = await fetchProfile();
        setFormData(data);
      } catch (err) {
        console.error("Error loading profile:", err);
        setFetchError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setFetchLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = name as FieldName;

    setFormData((prev) => ({ ...prev, [field]: value }));

    clearFieldError(field);
    validateField(field, value);
  };

  const handleSubmit = async () => {

    // Validate form
    if (!validateAll(formData)) {
      console.log("Validation failed:", errors);
      return;
    }

    console.log("Validation passed, submitting...");

    // Submit form
    await submit(
      () => updateProfile(formData, dispatch),
      "Profile updated successfully!",
      () => {
        setShowSuccess(true);
        clearErrors();
      }
    );
  };

  const handleModalClose = () => {
    setShowSuccess(false);
    // FIX: Navigate to profile with state to force refresh
    navigate("/my-profile", { 
      replace: true,
      state: { refresh: Date.now() } // Add timestamp to force refresh
    });
  };

  // Show loading state while fetching initial data
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <LoaderCircle className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if initial fetch failed
  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="ph:warning" width="32" height="32" className="text-red-600" />
          </div>
          <h2 className="h4 text-black mb-2">Failed to Load Profile</h2>
          <p className="body text-gray-600 mb-6">{fetchError}</p>
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="md:text-white text-black md:py-15 md:px-6 py-4 text-left md:text-center md:bg-black bg-center md:bg-[url('images/onboarding-pattern.svg')]">
          <h1 className="h2">Edit Profile</h1>
        </div>

        {/* Form Content */}
        <div className="md:py-8 py-5 space-y-6">
          {FORM_FIELDS.map(({ label, name, placeholder, type }) => (
            <ProfileInput
              key={name}
              label={label}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              disabled={isLoading}
              error={errors[name]}
              placeholder={placeholder}
            />
          ))}

          <ProfileSelect
            label="Business Type"
            name="businessType"
            value={formData.businessType}
            options={BUSINESS_TYPE_OPTIONS}
            onChange={handleChange}
            disabled={isLoading}
            error={errors.businessType}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-4 md:flex-row md:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="w-full md:w-80 btn btn-tertiary rounded-md border active:border-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full md:w-80 btn btn-primary rounded-md flex items-center justify-center gap-2 border active:border-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-8">
                <Icon
                  icon="stash:check-solid"
                  width="48"
                  height="48"
                  className="text-white"
                />
              </div>

              <h2 className="h4 text-secondary mb-10">Success!</h2>

              <button
                onClick={handleModalClose}
                className="w-full max-w-[200px] btn btn-sec border active:border-tertiary"
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