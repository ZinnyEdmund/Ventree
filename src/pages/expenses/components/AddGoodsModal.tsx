// ============================================
// 1. AddGoodsModal.tsx - Reusable Modal Component
// ============================================
import { useState, useCallback } from "react";
import { toast } from "sonner";
import SelectInput from "../../../components/ui/selectInput";
import TextInput from "../../../components/ui/textInput";
import { X } from "lucide-react";
import type { ICreateExpense } from "../../../types/general";

interface AddGoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateExpense) => Promise<void>;
}

export interface ExpenseFormData {

  category: string;
  amount: number;
  title: string;
  notes: string;
}

export const AddGoodsModal: React.FC<AddGoodsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ICreateExpense>({
    shopId: "",
    category: "",
    amount: 0,
    title: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  // Category options
  // Category options where label = value
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

  const handleInputChange = useCallback(
    (field: keyof ExpenseFormData, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    if (!formData.category.trim()) {
      toast.error("Please select a Category");
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
    // if (formData.notes.trim()) {
    //   toast.error("Please enter a note");
    //   return false;
    // }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setLoading(true);
      try {
        await onSubmit(formData);
        toast.success("Expense added successfully!");

        // Reset form
        setFormData({
          shopId: "",
          category: "",
          amount: 0,
          title: "",
          notes: "",
        });

        onClose();
      } catch (error: any) {
        toast.error(error?.message || "Failed to add goods");
      } finally {
        setLoading(false);
      }
    },
    [formData, validateForm, onSubmit, onClose]
  );

  const handleClose = useCallback(() => {
    if (loading) return; // Prevent closing while submitting
    setFormData({
      shopId: "",
      category: "",
      amount: 0,
      title: "",
      notes: "",
    });
    onClose();
  }, [loading, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-b"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[400px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="h6 font-semibold text-gray-900">Enter Expense</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Expense Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expense Category
              </label>
              <SelectInput
                name="Expense Category"
                placeholder="Select Category"
                options={expenseCategoryOptions}
                value={formData.category}
                onChange={(e: any) =>
                  handleInputChange("category", e.target.value)
                }
                required
                // disabled={loading}
              />
            </div>

            {/* Quantity */}
            <TextInput
              label="Amount Spent"
              placeholder="e.g., 5000"
              type="number"
              value={formData.amount}
              onChange={(e: any) =>
                handleInputChange("amount", Number(e.target.value))
              }
              required
              disabled={loading}
            />

            {/* Select Date */}
            <TextInput
              label="Date"
              placeholder="Select Date"
              type="date"
              value={formData.title || ""}
              onChange={(e: any) =>
                handleInputChange("title", e.target.value)
              }
              required
              disabled={loading}
            />

            {/* Note */}
            <TextInput
              label="Note (Optional)"
              placeholder="Add any extra details about this expense"
              type="text"
              value={formData.notes || ""}
              onChange={(e: any) =>
                handleInputChange("notes", e.target.value)
              }
              
              disabled={loading}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Goods"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
