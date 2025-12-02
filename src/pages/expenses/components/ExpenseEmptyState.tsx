// ============================================
// ExpenseEmptyState.tsx - Beautiful Empty State for Expenses
// ============================================
import { Receipt, Plus, X } from "lucide-react";

interface ExpenseEmptyStateProps {
  searchTerm: string;
  category: string;
  onAddNew: () => void;
  onClearFilters: () => void;
}

export const ExpenseEmptyState: React.FC<ExpenseEmptyStateProps> = ({
  searchTerm,
  category,
  onAddNew,
  onClearFilters,
}) => {
  // Empty state for search/filter results
  if (searchTerm || category) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Receipt className="text-gray-400" size={32} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No expenses found
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            {searchTerm && category ? (
              <>
                No expenses matching <span className="font-medium">"{searchTerm}"</span>{" "}
                in <span className="font-medium">{category}</span>
              </>
            ) : searchTerm ? (
              <>
                No expenses matching{" "}
                <span className="font-medium text-gray-900">"{searchTerm}"</span>
              </>
            ) : (
              <>No expenses in <span className="font-medium">{category}</span></>
            )}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              Clear Filters
            </button>
            
          </div>
        </div>
      </div>
    );
  }

  // Empty state for no expenses at all
  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        {/* Illustration */}
        <div className="mb-6">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-300"
          >
            {/* Receipt illustration */}
            <rect
              x="30"
              y="20"
              width="60"
              height="80"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            {/* Receipt lines */}
            <line x1="40" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="2" />
            <line x1="40" y1="45" x2="70" y2="45" stroke="currentColor" strokeWidth="2" />
            <line x1="40" y1="55" x2="75" y2="55" stroke="currentColor" strokeWidth="2" />
            <line x1="40" y1="65" x2="65" y2="65" stroke="currentColor" strokeWidth="2" />
            {/* Wavy bottom */}
            <path
              d="M30 90 L35 95 L40 90 L45 95 L50 90 L55 95 L60 90 L65 95 L70 90 L75 95 L80 90 L85 95 L90 90"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            {/* Plus sign */}
            <circle cx="85" cy="30" r="15" fill="currentColor" opacity="0.2" />
            <path
              d="M85 22 L85 38 M77 30 L93 30"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No expenses recorded yet
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Start tracking your business expenses to better understand your spending
          patterns and manage your finances effectively.
        </p>

        {/* Action Button */}
        <button
          onClick={onAddNew}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Record Your First Expense
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
              <span className="font-medium">Track Spending</span>
            </div>
            <p className="text-gray-600 text-xs">
              Monitor where your money goes
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
              <span className="font-medium">Categorize</span>
            </div>
            <p className="text-gray-600 text-xs">
              Organize by expense types
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
              <span className="font-medium">Analyze Trends</span>
            </div>
            <p className="text-gray-600 text-xs">
              View spending insights
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};