// ============================================
// 1. BusinessInfoCard.tsx - Business Information Display/Edit
// ============================================
import { useState } from "react";
import { Pen } from "lucide-react";
import { EditBusinessModal } from "./EditBusinessModal";
import { Icon } from "@iconify/react";
import { truncateTextWithStringMethod } from "../../../lib/helper";

export interface BusinessInfo {
  businessName: string;
  businessType: string;
  phoneNumber: string;
  email: string;
  address: string;
  logo?: string;
}

interface BusinessInfoCardProps {
  businessInfo: BusinessInfo;
  onUpdate: (info: BusinessInfo) => Promise<void>;
}

export const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({
  businessInfo,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-secondary-5 p-6 mb-6">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="flex items-start justify-between gap-4 mb-6">
          <article className="flex gap-3 items-center">
            {/* Logo */}
            <div className="w-[48px] h-[48px] rounded-full bg-secondary justify-center flex items-center">
              <Icon
                icon="octicon:person-16"
                width="24"
                height="24"
                className="text-primary-1"
              />
            </div>

            {/* Business Name & Owner */}
            <div>
              <h2 className="">
                {truncateTextWithStringMethod("Okafor Ifeanyi", 15)}
              </h2>
              <p className="text-accent text-sm">Client</p>
            </div>
          </article>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>Edit</span>
            <Pen size={16} />
          </button>
        </div>

        {/* Info Grid */}
        <article className="grid grid-cols-2 gap-x-8 gap-y-4">
          <InfoField label="Business Name" value={businessInfo.businessName} />
          <InfoField label="Business Type" value={businessInfo.businessType} />
          <InfoField label="Phone Number" value={businessInfo.phoneNumber} />
          <InfoField label="Email" value={businessInfo.email} />

          <div className="col-span-2 border-t border-subtle-2 mt-2 pt-6">
            <InfoField label="Business Address" value={businessInfo.address} />
          </div>
        </article>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            {/* Logo */}
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
              {businessInfo.businessName.charAt(0)}
            </div>

            {/* Business Name & Owner */}
            <div>
              <h2 className="font-semibold text-gray-900">
                {businessInfo.businessName}
              </h2>
              <p className="text-sm text-gray-600">Owner</p>
            </div>
          </div>

          {/* Edit Icon */}
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Pen size={20} />
          </button>
        </div>

        {/* Info Stack */}
        <div className="space-y-4">
          <InfoField label="Business Name" value={businessInfo.businessName} />
          <InfoField label="Business Type" value={businessInfo.businessType} />
          <InfoField label="Phone Number" value={businessInfo.phoneNumber} />
          <InfoField label="Email" value={businessInfo.email} />
          <div className="border-b border-subtle-2 my-5"></div>
          <InfoField label="Business Address" value={businessInfo.address} />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditBusinessModal
          businessInfo={businessInfo}
          onClose={() => setIsEditing(false)}
          onSave={async (updatedInfo) => {
            await onUpdate(updatedInfo);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

const InfoField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-subtle mb-1">{label}</p>
    <p className="text-gray-900">{value || "Not provided"}</p>
  </div>
);
