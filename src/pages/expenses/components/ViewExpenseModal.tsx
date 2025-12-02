// ============================================
// ViewExpenseModal.tsx - View Expense Details
// ============================================
import { X } from "lucide-react";
import type { ExpenseData } from "../../../types/general";
import { formatDate } from "../../../lib/helper";

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
      {/* Backdrop */}
      <div className="modal-bg" onClick={onClose}>

      {/* Modal */}
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[450px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
            <h2 className="h6 font-semibold text-gray-900">Expense Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
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
          <div className="p-6 pt-0">
            <button onClick={onClose} className="w-full btn btn-tertiary">
              Close
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};