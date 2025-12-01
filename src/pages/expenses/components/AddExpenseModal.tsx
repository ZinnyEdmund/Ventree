// ============================================
// AddExpenseModal.tsx - Optimized React Modal
// ============================================
import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import SelectInput from "../../../components/ui/selectInput";
import TextInput from "../../../components/ui/textInput";
import type { ICreateExpense } from "../../../types/general";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateExpense) => Promise<void>;
  isLoading?: boolean;
}

const expenseCategoryOptions = [
  { value: "Product Purchase", label: "Product Purchase" },
  { value: "Transportation / Delivery", label: "Transportation / Delivery" },
  { value: "Shop Rent", label: "Shop Rent" },
  { value: "Utilities (Electricity, Water, Internet)", label: "Utilities (Electricity, Water, Internet)" },
  { value: "Repairs & Maintenance", label: "Repairs & Maintenance" },
  { value: "Staff Salary / Wages", label: "Staff Salary / Wages" },
  { value: "Advertising & Promotion", label: "Advertising & Promotion" },
  { value: "Packaging Materials", label: "Packaging Materials" },
  { value: "Cleaning & Sanitation", label: "Cleaning & Sanitation" },
  { value: "Equipment & Tools", label: "Equipment & Tools" },
  { value: "Taxes & Licenses", label: "Taxes & Licenses" },
  { value: "Miscellaneous", label: "Others (Miscellaneous)" },
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ICreateExpense>({
    shopId: "",
    category: "",
    amount: 0,
    title: "",
    notes: "",
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        shopId: "",
        category: "",
        amount: 0,
        title: "",
        notes: "",
      });
    }
  }, [isOpen]);

  const handleInputChange = useCallback(
    (field: keyof ICreateExpense, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    if (!formData.category.trim()) {
      toast.error("Please select a category");
      return false;
    }
    if (formData.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return false;
    }
    if (!formData.title.trim()) {
      toast.error("Please select a date");
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      try {
        await onSubmit(formData);
        toast.success("Expense added successfully!");
      } catch (error: any) {
        toast.error(error?.message || "Failed to add expense");
        throw error;
      }
    },
    [formData, validateForm, onSubmit]
  );

  const handleClose = useCallback(() => {
    if (isLoading) return;
    onClose();
  }, [isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-bg" onClick={handleClose} >

      {/* Modal */}
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[450px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
            <h2 className="h6 font-semibold text-gray-900">Add New Expense</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expense Category <span className="text-error">*</span>
              </label>
              <SelectInput
                name="category"
                placeholder="Select category"
                options={expenseCategoryOptions}
                value={formData.category}
                onChange={(e: any) =>
                  handleInputChange("category", e.target.value)
                }
                required
                disabled={isLoading}
              />
            </div>

            {/* Amount */}
            <TextInput
              label="Amount Spent"
              placeholder="e.g., 5000"
              type="number"
              value={formData.amount || ""}
              onChange={(e: any) =>
                handleInputChange("amount", Number(e.target.value))
              }
              required
              disabled={isLoading}
            />

            {/* Date */}
            <TextInput
              label="Date"
              placeholder="Select date"
              type="date"
              value={formData.title || ""}
              onChange={(e: any) => handleInputChange("title", e.target.value)}
              required
              disabled={isLoading}
            />

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note (Optional)
              </label>
              <textarea
                placeholder="Add any extra details about this expense"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 btn btn-tertiary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Expense"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};