// ============================================
// 5. SalesPersonModal.tsx - Add/Edit Sales Person Modal

import { useState } from "react";
import { toast } from "sonner";
import type { SalesPerson } from "./SalesTeamCard";
import TextInput from "../../../components/ui/textInput";
import { X } from "lucide-react";
import PasswordInput from "../../../components/ui/passwordInput";

// ============================================

interface SalesPersonModalProps {
  person: SalesPerson | null;
  onClose: () => void;
  onSave: (person: Omit<SalesPerson, "id">) => Promise<void>;
}

export const SalesPersonModal: React.FC<SalesPersonModalProps> = ({
  person,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: person?.name || "",
    password: "",
    canAddSales: person?.canAddSales ?? true,
    canAddExpense: person?.canAddExpense ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!person && !formData.password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      toast.success(
        person
          ? "Sales person updated successfully!"
          : "Sales person added successfully!"
      );
    } catch (error) {
      toast.error("Failed to save sales person");
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
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
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
            <div className="flex w-1/2 gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn btn-tertiary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
            </article>
            
          </form>
        </div>
      </div>
    </>
  );
};
