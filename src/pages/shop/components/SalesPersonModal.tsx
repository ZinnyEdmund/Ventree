// ============================================
// 5. SalesPersonModal.tsx - Add/Edit Sales Person Modal

import { useState } from "react";
import { toast } from "sonner";
import type { SalesPerson, SalesPersonFormValues } from "./SalesTeamCard";
import TextInput from "../../../components/ui/textInput";
import { X } from "lucide-react";
import PasswordInput from "../../../components/ui/passwordInput";
import { validatePhoneNumber } from "../../../components/common/validation";

// ============================================

interface SalesPersonModalProps {
  person: SalesPerson | null;
  onClose: () => void;
  onSave: (person: SalesPersonFormValues) => Promise<void>;
  isSaving?: boolean;
}

export const SalesPersonModal: React.FC<SalesPersonModalProps> = ({
  person,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState({
    name: person?.name || "",
    phoneNumber: person?.phoneNumber || "",
    password: "",
    confirmPassword: "",
    canAddSales: person?.canAddSales ?? true,
    canAddExpense: person?.canAddExpense ?? false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    }

    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    if (!person && !formData.password) {
      toast.error("Password is required");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload: SalesPersonFormValues = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
        canAddSales: formData.canAddSales,
        canAddExpense: formData.canAddExpense,
      };
      await onSave(payload);
      toast.success(
        person
          ? "Sales person updated successfully!"
          : "Sales person added successfully!"
      );
    } catch (error) {
      if (!(error as { __handled?: boolean })?.__handled) {
        toast.error("Failed to save sales person");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/75 z-50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg w-full lg:w-[800px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="text-lg font-semibold">
              {person ? "Edit" : "Add"} Sales Person
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <TextInput
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Sales Person1"
              required
            />

            <TextInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="08012345678"
              required
            />

            <PasswordInput
              label="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              noFP={false}
            />

            <PasswordInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              noFP={false}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Access Permissions
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.canAddSales}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        canAddSales: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-success"
                  />
                  <span className="text-sm text-gray-700">Can add sales</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.canAddExpense}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        canAddExpense: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm text-gray-700">
                    Can add expense (Optional)
                  </span>
                </label>
              </div>
            </div>

            <article className="w-full flex justify-end">
            <div className="flex flex-col w-full md:w-1/2 md:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn btn-tertiary"
                disabled={loading || isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn btn-primary"
                disabled={loading || isSaving}
              >
                {loading || isSaving ? "Saving..." : "Save"}
              </button>
            </div>
            </article>
            
          </form>
        </div>
      </div>
    </>
  );
};
