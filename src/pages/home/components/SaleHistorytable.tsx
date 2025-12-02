import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SaleHistoryItem } from "../../../types/general";
import ErrorState from "../../../components/common/ErrorState"; // ADD THIS IMPORT
// import { formatDate, formatTime } from "../../../lib/helper";


interface SalesHistoryTableProps {
  sales: SaleHistoryItem[];
  isLoading?: boolean;
  error?: Error | null;        // ADD THIS PROP ✅
  onView: (sale: SaleHistoryItem) => void;
  onRetry?: () => void;         // ADD THIS PROP ✅
}

const columnHelper = createColumnHelper<SaleHistoryItem>();

export const SalesHistoryTable: React.FC<SalesHistoryTableProps> = ({
  sales,
  isLoading = false,
  error = null,              // ADD THIS ✅
  onView,
  onRetry,                   // ADD THIS ✅
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Calculate time ago
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const saleDate = new Date(date);
    const diffMs = now.getTime() - saleDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Define columns
  const columns = useMemo<ColumnDef<SaleHistoryItem, any>[]>(
    () => [
      columnHelper.accessor("itemName", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product
            {column.getIsSorted() === "asc" ? (
              <ArrowUp size={16} />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUpDown size={16} className="text-gray-400" />
            )}
          </button>
        ),
        cell: (info) => (
          <div className="font-medium text-gray-900">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("lineTotal", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            {column.getIsSorted() === "asc" ? (
              <ArrowUp size={16} />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUpDown size={16} className="text-gray-400" />
            )}
          </button>
        ),
        cell: (info) => (
          <div className="text-gray-700 font-medium">
            {formatCurrency(info.getValue())}
          </div>
        ),
      }),
      columnHelper.accessor("soldByName", {
        header: "Sold By",
        cell: (info) => (
          <div className="text-gray-700">
            {info.getValue() || "You"}
          </div>
        ),
      }),
      columnHelper.accessor("date", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Time
            {column.getIsSorted() === "asc" ? (
              <ArrowUp size={16} />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUpDown size={16} className="text-gray-400" />
            )}
          </button>
        ),
        cell: (info) => (
          <div className="text-gray-700">{getTimeAgo(info.getValue())}</div>
        ),
      }),
    ],
    [onView]
  );

  // Initialize table
  const table = useReactTable({
    data: sales,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  // LOADING STATE ✅
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:loading" className="animate-spin" width="24" />
          <span className="text-gray-600">Loading sales...</span>
        </div>
      </div>
    );
  }

  // ERROR STATE ✅ - ADD THIS BLOCK
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ErrorState
          errorCode="Error"
          message={error.message || "Failed to load latest sales history. Please try again."}
          onRetry={onRetry}
          showRetryButton={!!onRetry}
        />
      </div>
    );
  }

  // EMPTY STATE ✅
  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <Icon
          icon="mdi:cart-outline"
          width="48"
          height="48"
          className="mx-auto text-gray-400 mb-3"
        />
        <p className="text-gray-600 mb-1">No sales recorded yet</p>
        <p className="text-sm text-gray-500">
          Sales will appear here once you start recording them
        </p>
      </div>
    );
  }

  // SUCCESS STATE - SHOW DATA ✅
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  >
                    {header.isPlaceholder ? null : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {table.getRowModel().rows.map((row) => {
          const sale = row.original;

          return (
            <div key={row.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {sale.itemName}
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(sale.lineTotal)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-600">
                    Sold by {sale.soldByName || "You"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">
                    {getTimeAgo(sale.date)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};