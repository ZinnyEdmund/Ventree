// ============================================
// 4. SalesPersonItem.tsx - Individual Sales Person Row
// ============================================
import { Pen, Trash2 } from "lucide-react";
import type { SalesPerson } from "./SalesTeamCard";
import { Icon } from "@iconify/react";

interface SalesPersonItemProps {
  person: SalesPerson;
  onEdit: () => void;
  onDelete: () => void;
}

export const SalesPersonItem: React.FC<SalesPersonItemProps> = ({
  person,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 mb-2">{person.name}</h3>
        <div className="flex flex-wrap gap-2">
          {person.canAddSales && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              <Icon icon="mdi:check-circle" width="14" height="14" />
              Can Add Sales
            </span>
          )}
          {person.canAddExpense ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              <Icon icon="mdi:check-circle" width="14" height="14" />
              Can Add Expense
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              <Icon icon="mdi:close-circle" width="14" height="14" />
              No Expense Access
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Pen size={18} className="text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
        >
          <Trash2 size={18} className="text-red-600" />
        </button>
      </div>
    </div>
  );
};