// ============================================
// GoodsTable.tsx - Optimized with Backend Pagination
// ============================================
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { MoreVertical, ArrowUpDown, ArrowUp, ArrowDown, Search, Plus } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface Good {
  id: string;
  product: string;
  costPrice: number;
  sellingPrice: number;
  quantity?: number;
  category?: string;
  sku?: string;
  unit?: string;
  isLowStock?: boolean;
  isOutOfStock?: boolean;
  reorderLevel?: number;
}

interface GoodsTableProps {
  goods: Good[];
  isLoading?: boolean;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  searchTerm: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onAddNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSort: (field: any) => void;
}

const columnHelper = createColumnHelper<Good>();

export const GoodsTable: React.FC<GoodsTableProps> = ({
  goods,
  isLoading = false,
  pagination,
  searchTerm,
  sortBy,
  sortOrder,
  onAddNew,
  onEdit,
  onDelete,
  onSearchChange,
  onPageChange,
  onSort,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Define columns
  const columns = useMemo<ColumnDef<Good, any>[]>(
    () => [
      columnHelper.accessor("product", {
        header: () => (
          <button
            className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
            onClick={() => onSort("name")}
          >
            Product
            {sortBy === "name" ? (
              sortOrder === "asc" ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )
            ) : (
              <ArrowUpDown size={16} className="text-gray-400" />
            )}
          </button>
        ),
        cell: (info) => (
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            {info.row.original.category && (
              <span className="text-xs text-gray-500">
                {info.row.original.category}
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("costPrice", {
        header: "Cost Price",
        cell: (info) => (
          <div className="text-gray-700">₦{info.getValue().toLocaleString()}</div>
        ),
      }),
      columnHelper.accessor("sellingPrice", {
        header: () => (
          <button
            className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
            onClick={() => onSort("sellingPrice")}
          >
            Selling Price
            {sortBy === "sellingPrice" ? (
              sortOrder === "asc" ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )
            ) : (
              <ArrowUpDown size={16} className="text-gray-400" />
            )}
          </button>
        ),
        cell: (info) => (
          <div className="text-gray-700">₦{info.getValue().toLocaleString()}</div>
        ),
      }),
      columnHelper.accessor("quantity", {
        header: () => (
          <button
            className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
            onClick={() => onSort("availableQuantity")}
          >
            Stock
            {sortBy === "availableQuantity" ? (
              sortOrder === "asc" ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )
            ) : (
              <ArrowUpDown size={16} className="text-gray-400" />
            )}
          </button>
        ),
        cell: (info) => {
          const quantity = info.getValue() || 0;
          const item = info.row.original;
          
          return (
            <div className="flex items-center gap-2">
              <span className="text-gray-700">
                {quantity} {item.unit || ""}
              </span>
              {item.isOutOfStock && (
                <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded">
                  Out
                </span>
              )}
              {item.isLowStock && !item.isOutOfStock && (
                <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded">
                  Low
                </span>
              )}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="relative">
            <button
              onClick={() =>
                setOpenMenuId(openMenuId === row.original.id ? null : row.original.id)
              }
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical size={20} />
            </button>
            {openMenuId === row.original.id && (
              <>
                {/* Backdrop for mobile */}
                <div
                  className="fixed inset-0 z-10 md:hidden"
                  onClick={() => setOpenMenuId(null)}
                />
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <button
                    onClick={() => {
                      onEdit(row.original.id);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Icon icon="mdi:pencil" width="18" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(row.original.id);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-error flex items-center gap-2 transition-colors"
                  >
                    <Icon icon="mdi:delete" width="18" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ),
      }),
    ],
    [openMenuId, sortBy, sortOrder, onEdit, onDelete, onSort]
  );

  // Initialize table
  const table = useReactTable({
    data: goods,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // We're handling pagination from backend
    manualSorting: true, // We're handling sorting from backend
    pageCount: pagination.pages,
  });

  return (
    <div className="lg:py-6 p-0">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 lg:px-0  pt-4 lg:pt-0">
        <div>
          <h2 className="h5 text-secondary">Inventory Items</h2>
          {pagination.total > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {pagination.total} {pagination.total === 1 ? "item" : "items"} total
            </p>
          )}
        </div>

        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Add Button - Desktop */}
          <button
            onClick={onAddNew}
            className="flex justify-center items-center gap-2 btn btn-primary whitespace-nowrap"
          >
            <Plus size={18} />
            Add New Goods
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        </div>
      ) : goods.length === 0 ? (
        // Empty State
        <EmptyState
          searchTerm={searchTerm}
          onAddNew={onAddNew}
          onClearSearch={() => onSearchChange("")}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-4 text-left text-sm text-gray-600"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
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
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Desktop Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * 10 + 1} to{" "}
                {Math.min(pagination.page * 10, pagination.total)} of{" "}
                {pagination.total} items
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                </div>
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {table.getRowModel().rows.map((row) => {
              const good = row.original;

              return (
                <div
                  key={row.id}
                  className="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {good.product}
                      </h3>
                      {good.category && (
                        <span className="text-xs text-gray-500">
                          {good.category}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === good.id ? null : good.id)
                        }
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openMenuId === good.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <button
                              onClick={() => {
                                onEdit(good.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Icon icon="mdi:pencil" width="18" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                onDelete(good.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-error flex items-center gap-2"
                            >
                              <Icon icon="mdi:delete" width="18" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Cost:</span>
                      <p className="text-gray-900 font-medium">
                        ₦{good.costPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Sells:</span>
                      <p className="text-gray-900 font-medium">
                        ₦{good.sellingPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Stock:</span>
                      <p className="text-gray-900 font-medium">
                        {good.quantity || 0} {good.unit || ""}
                      </p>
                    </div>
                    <div>
                      {good.isOutOfStock && (
                        <span className="inline-block text-xs bg-error/10 text-error px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                      {good.isLowStock && !good.isOutOfStock && (
                        <span className="inline-block text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Mobile Pagination */}
            <div className="flex flex-col gap-3 py-4">
              <div className="text-sm text-gray-700 text-center">
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Add Button (Floating) */}
      <button
        onClick={onAddNew}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors z-10"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};