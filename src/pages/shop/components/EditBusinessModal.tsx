// ============================================
// 2. EditBusinessModal.tsx - Edit Business Info Modal
// ============================================
import { X } from "lucide-react";
import TextInput from "../../../components/ui/textInput";
import { toast } from "sonner";
import type { BusinessInfo } from "./BusinessInfoCard";
import { useState } from "react";

export interface EditBusinessModalProps {
  businessInfo: BusinessInfo;
  onClose: () => void;
  onSave: (info: BusinessInfo) => Promise<void>;
}

export const EditBusinessModal: React.FC<EditBusinessModalProps> = ({
  businessInfo,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(businessInfo);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      toast.success("Business information updated successfully!");
    } catch (error) {
      toast.error("Failed to update business information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-bg" onClick={onClose} />

      {/* Modal */}
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg w-full lg:w-[800px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 ">
            <h2 className="h6 md:h4 text-secondary">Edit Business Information</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <article className="grid md:grid-cols-2 gap-x-8 gap-y-4 border-b border-subtle-2 pb-8">
              <TextInput
                label="Business Name"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                required
              />
              <TextInput
                label="Business Type"
                value={formData.businessType}
                onChange={(e) =>
                  setFormData({ ...formData, businessType: e.target.value })
                }
                placeholder="Add your business type"
              />
              <TextInput
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
              <TextInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Add your Email"
              />
            </article>

            <TextInput
              label="Business Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Add your address"
            />

            <article className="w-full flex justify-end">
              <div className="flex w-full md:w-1/2 gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </article>
          </form>
        </div>
      </div>
    </>
  );
};
