import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import SelectInput from "../../../components/ui/selectInput";
import TextInput from "../../../components/ui/textInput";
import type { ExpenseData, ICreateExpense } from "../../../types/general";
import { formatDate } from "../../../lib/helper";

// ============================================
// 1. View Expense Modal
// ============================================
interface ViewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseData | null;
}

export const ViewExpenseModal: React.FC<ViewExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
}) => {
  if (!isOpen || !expense) return null;

  return (
    <>
      <div className="modal-b" onClick={onClose} />
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[450px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <h2 className="h6 font-semibold text-gray-900">Expense Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 space-y-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Category
              </label>
              <p className="text-base text-gray-900 font-medium">
                {expense.category}
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Amount
              </label>
              <p className="text-2xl text-gray-900 font-bold">
                ₦{expense.amount.toLocaleString()}
              </p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Date
              </label>
              <p className="text-base text-gray-900">
                {formatDate(expense.createdAt)}
              </p>
            </div>

            {/* Note */}
            {expense.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Note
                </label>
                <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {expense.notes}
                </p>
              </div>
            )}

            {/* Created At */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created At
              </label>
              <p className="text-sm text-gray-600">
                {new Date(expense.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6">
            <button onClick={onClose} className="w-full btn btn-tertiary">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// 2. Edit Expense Modal
// ============================================
interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseData | null;
  onSubmit: (expenseId: string, data: ICreateExpense) => Promise<void>;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ICreateExpense>({
    shopId: "",
    category: "",
    amount: 0,
    title: "",
    notes: "",
    // date: "",
  });
  const [loading, setLoading] = useState(false);

  // Category options
  const expenseCategoryOptions = [
    { value: "product_purchase", label: "Product Purchase" },
    { value: "transportation", label: "Transportation / Delivery" },
    { value: "rent", label: "Shop Rent" },
    { value: "utilities", label: "Utilities (Electricity, Water, Internet)" },
    { value: "maintenance", label: "Repairs & Maintenance" },
    { value: "salary", label: "Staff Salary / Wages" },
    { value: "advertising", label: "Advertising & Promotion" },
    { value: "packaging", label: "Packaging Materials" },
    { value: "cleaning", label: "Cleaning & Sanitation" },
    { value: "equipment", label: "Equipment & Tools" },
    { value: "taxes", label: "Taxes & Licenses" },
    { value: "miscellaneous", label: "Miscellaneous" },
  ];

  // Populate form when expense changes
  useEffect(() => {
    if (expense) {
      setFormData({
        shopId: expense.shopId,
        category: expense.category,
        amount: expense.amount,
        title: expense.title.split("T")[0], // Convert to YYYY-MM-DD format
        // title: expense.title,
        notes: expense.notes || "",
      });
    }
  }, [expense]);

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
    // if (!formData..trim()) {
    //   toast.error("Please select a date");
    //   return false;
    // }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm() || !expense) return;

      setLoading(true);
      try {
        await onSubmit(expense._id, formData);
        toast.success("Expense updated successfully!");
        onClose();
      } catch (error: any) {
        toast.error(error?.message || "Failed to update expense");
      } finally {
        setLoading(false);
      }
    },
    [formData, validateForm, expense, onSubmit, onClose]
  );

  if (!isOpen || !expense) return null;

  return (
    <>
      <div className="modal-b" onClick={!loading ? onClose : undefined} />
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[450px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="h6 font-semibold text-gray-900">Edit Expense</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expense Category
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
                // disabled={loading}
              />
            </div>

            {/* Amount */}
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

            {/* Date */}
            <TextInput
              label="Date"
              placeholder="Select date"
              type="date"
              value={formData.title}
              onChange={(e: any) => handleInputChange("title", e.target.value)}
              required
              disabled={loading}
            />

            {/* Note */}
            <TextInput
              label="Note (Optional)"
              placeholder="Add any extra details about this expense"
              type="text"
              value={formData.notes || ""}
              onChange={(e: any) => handleInputChange("notes", e.target.value)}
              disabled={loading}
            />

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
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
                className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Expense"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ============================================
// 3. Delete Expense Modal
// ============================================
interface DeleteExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseData | null;
  onConfirm: (expenseId: string) => Promise<void>;
}

export const DeleteExpenseModal: React.FC<DeleteExpenseModalProps> = ({                                                  
  isOpen,
  onClose,
  expense,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!expense) return;

    setLoading(true);
    try {
      await onConfirm(expense._id);
      toast.success("Expense deleted successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  }, [expense, onConfirm, onClose]);

  if (!isOpen || !expense) return null;

  return (
    <>
      <div className="modal-b" onClick={!loading ? onClose : undefined} />
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[450px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Icon
                  icon="mdi:alert-circle-outline"
                  width="24"
                  className="text-error"
                />
              </div>
              <h2 className="h6 font-semibold text-gray-900">Delete Expense</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this expense? This action cannot be
              undone.
            </p>

            {/* Expense Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm font-medium text-gray-900">
                  {expense.category}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-medium text-gray-900">
                  ₦{expense.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 btn btn-tertiary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    Deleting...
                    {/* <Loader2 size={16} className="animate-spin" /> */}
                  </>
                ) : (
                  <>
                    {/* <Icon icon="mdi:delete-outline" width="18" /> */}
                    Delete Expense
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};