import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const INITIAL_FORM_DATA: FormState = {
  ownerName: "Owner",
  businessName: "Owner Provisions",
  phoneNumber: "08134775647",
  businessType: "Provision Store",
};

const BUSINESS_TYPE_OPTIONS = [
  { value: "Provision Store", label: "Provision Store" },
  { value: "Grocery Store", label: "Grocery Store" },
  { value: "Supermarket", label: "Supermarket" },
  { value: "Mini Mart", label: "Mini Mart" },
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
];

export default function EditProfile() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_DATA);
  const navigate = useNavigate();

  const { isLoading, submit } = useProfileFormSubmit();
  const { errors, validateField, validateAll, clearErrors } =
    useProfileFormValidation();

  const updateProfile = async (_data: FormState) => {
    // TODO: Replace with your actual API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async () => {
    if (!validateAll(formData)) return;

    await submit(
      () => updateProfile(formData),
      "Profile updated successfully!",
      () => {
        setShowSuccess(true);
        clearErrors();
      }
    );
  };

  const handleModalClose = () => {
    setShowSuccess(false);
    navigate(-1);
  };

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
              className="w-full md:w-80 btn btn-primary rounded-md flex items-center justify-center gap-2 border active:border-tertiary"
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