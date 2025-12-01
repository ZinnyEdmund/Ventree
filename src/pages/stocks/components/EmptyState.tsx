// ============================================
// EmptyState.tsx - Beautiful Empty State for Inventory
// ============================================
import { Icon } from "@iconify/react";
import { Package, Plus, X } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  onAddNew: () => void;
  onClearSearch: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  onAddNew,
  onClearSearch,
}) => {
  // Empty state for search results
  if (searchTerm) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="text-gray-400" size={32} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No items found
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            We couldn't find any items matching{" "}
            <span className="font-medium text-gray-900">"{searchTerm}"</span>
          </p>

          {/* Actions */}
          <div className="flex flex-col justify-center sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={onClearSearch}
              className="btn btn-tertiary flex gap-2 items-center-safe"
            >
              <X size={18} />
              Clear Search
            </button>
            <button
              onClick={onAddNew}
              className="btn btn-primary flex gap-2 items-center"
            >
              <Plus size={18} />
              Add New Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state for no inventory
  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        {/* Illustration */}
        <div className="mb-3 text-gray-300">
          <Icon icon="ic:outline-shopping-bag" width="48" height="48" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          You do not have any goods in your inventory
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6">
         Add goods to your inventory
        </p>

        {/* Action Button */}
        <button
          onClick={onAddNew}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Add Your First Item
        </button>

        {/* Features */}
        {/* <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-left w-full">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 5L6 12L3 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium">Track Stock</span>
            </div>
            <p className="text-gray-600 text-xs">
              Monitor inventory levels in real-time
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 5L6 12L3 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium">Set Alerts</span>
            </div>
            <p className="text-gray-600 text-xs">
              Get notified for low stock items
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 5L6 12L3 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium">Manage Pricing</span>
            </div>
            <p className="text-gray-600 text-xs">
              Track costs and selling prices
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};