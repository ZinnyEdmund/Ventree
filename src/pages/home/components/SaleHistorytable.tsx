import { MoreVertical } from "lucide-react";

// Reusable Sales History Item Component
interface SalesHistoryItemProps {
  product: string;
  price: string;
  soldBy: string;
  time: string;
  onMenuClick?: () => void;
}

export const SalesHistoryItem: React.FC<SalesHistoryItemProps> = ({
  product,
  price,
  soldBy,
  time,
  onMenuClick,
}) => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:flex w-full items-center justify-between p-4 border-b border-accent-g2 last:border-b-0">
        <div className="w-5/12">
          <p className="text-grey">
            {product} – {price}
          </p>
        </div>
        <div className="w-3/12 text-left">
          <p className="text-gray-600">{soldBy}</p>
        </div>
        <div className="w-2/12 flex items-center gap-4">
          <p className="text-gray-600">{time}</p>
        </div>
        <div className="w-2/12 text-left flex items-center justify-end gap-4">
          <button
            onClick={onMenuClick}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden w-full p-4 border-b border-accent-g2 last:border-b-0">
        {/* Top Row: Product Name, Price, and Menu */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-medium text-gray-900">
            {product} – {price}
          </h3>
          <button
            onClick={onMenuClick}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors -mt-1"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Bottom Row: Sold By and Time */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{soldBy}</p>
          <p className="text-sm text-gray-600">{time}</p>
        </div>
      </div>
    </>
  );
};