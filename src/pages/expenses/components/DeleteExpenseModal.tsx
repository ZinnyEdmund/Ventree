// ============================================
// DeleteExpenseModal.tsx - Delete Confirmation
// ============================================
import { AlertTriangle, X } from "lucide-react";
import type { ExpenseData } from "../../../types/general";

interface DeleteExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseData | null;
  onConfirm: (expenseId: string) => Promise<void>;
  isLoading?: boolean;
}

export const DeleteExpenseModal: React.FC<DeleteExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen || !expense) return null;

  const handleConfirm = async () => {
    await onConfirm(expense._id);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-bg" onClick={isLoading ? undefined : onClose}>

      {/* Modal */}
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[450px] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-error" size={20} />
              </div>
              <h2 className="h6 font-semibold text-gray-900">Delete Expense</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this expense? This action cannot be
              undone.
            </p>

            {/* Expense Details */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
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

            {/* Warning */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ <span className="font-medium">Warning:</span> This will
                permanently remove this expense from your records.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn btn-tertiary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 btn btn-error"
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
                    Deleting...
                  </span>
                ) : (
                  "Delete Expense"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};