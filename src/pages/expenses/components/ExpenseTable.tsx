// ============================================
// ExpenseTable.tsx - Optimized with Backend Pagination
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

import { ExpenseEmptyState } from "./ExpenseEmptyState";
import type { ExpenseData } from "../../../types/expense";
import SelectInput from "../../../components/ui/selectInput";

interface ExpenseTableProps {
  expenses: ExpenseData[];
  isLoading?: boolean;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  searchTerm: string;
  category: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onAddNew: () => void;
  onView: (expense: ExpenseData) => void;
  onEdit: (expense: ExpenseData) => void;
  onDelete: (expense: ExpenseData) => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSort: (field: any) => void;
}

const columnHelper = createColumnHelper<ExpenseData>();

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

const categoryOptions = [
  // { value: "", label: "All Categories" },
  { value: "Product Purchase", label: "Product Purchase" },
  { value: "Transportation / Delivery", label: "Transportation / Delivery" },
  { value: "Shop Rent", label: "Shop Rent" },
  { value: "Utilities (Electricity, Water, Internet)", label: "Utilities" },
  { value: "Repairs & Maintenance", label: "Repairs & Maintenance" },
  { value: "Staff Salary / Wages", label: "Staff Salary" },
  { value: "Advertising & Promotion", label: "Advertising" },
  { value: "Packaging Materials", label: "Packaging" },
  { value: "Cleaning & Sanitation", label: "Cleaning" },
  { value: "Equipment & Tools", label: "Equipment" },
  { value: "Taxes & Licenses", label: "Taxes" },
  { value: "Miscellaneous", label: "Others" },
];

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  isLoading = false,
  pagination,
  searchTerm,
  category,
  sortBy,
  sortOrder,
  onAddNew,
  onView,
  onEdit,
  onDelete,
  onSearchChange,
  onCategoryChange,
  onPageChange,
  onSort,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Define columns
  const columns = useMemo<ColumnDef<ExpenseData, any>[]>(
    () => [
      columnHelper.accessor("category", {
        header: () => (
          <button
            className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
            onClick={() => onSort("title")}
          >
            Category
            {sortBy === "title" ? (
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
            <div className="font-medium text-gray-900 max-w-[200px] truncate">
              {info.getValue()}
            </div>
            {info.row.original.notes && (
              <span className="text-xs text-gray-500 truncate block max-w-[200px]">
                {info.row.original.notes}
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("amount", {
        header: () => (
          <button
            className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
            onClick={() => onSort("amount")}
          >
            Amount
            {sortBy === "amount" ? (
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
          <div className="text-gray-700 font-medium">
            ₦{info.getValue().toLocaleString()}
          </div>
        ),
      }),
      columnHelper.accessor("title", {
        header: () => (
          <button
            className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
            onClick={() => onSort("createdAt")}
          >
            Date
            {sortBy === "createdAt" ? (
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
          <div className="text-gray-700">{formatDate(info.getValue())}</div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="relative">
            <button
              onClick={() =>
                setOpenMenuId(openMenuId === row.original._id ? null : row.original._id)
              }
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical size={20} />
            </button>
            {openMenuId === row.original._id && (
              <>
                <div
                  className="fixed inset-0 z-10 md:hidden"
                  onClick={() => setOpenMenuId(null)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <button
                    onClick={() => {
                      onView(row.original);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Icon icon="mdi:eye-outline" width="18" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      onEdit(row.original);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Icon icon="mdi:pencil-outline" width="18" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(row.original);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-error flex items-center gap-2 transition-colors"
                  >
                    <Icon icon="mdi:delete-outline" width="18" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ),
      }),
    ],
    [openMenuId, sortBy, sortOrder, onView, onEdit, onDelete, onSort]
  );

  // Initialize table
  const table = useReactTable({
    data: expenses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: pagination.pages,
  });

  return (
    <div className="lg:py-6 p-0">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 lg:px-0 px-4 pt-4 lg:pt-0">
        <div>
          <h2 className="h5 text-secondary">Expense Records</h2>
          {pagination.total > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {pagination.total} {pagination.total === 1 ? "expense" : "expenses"} total
            </p>
          )}
        </div>

        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          {/* <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select> */}
          <SelectInput 
            name="category"
            placeholder="All Categories"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={categoryOptions}

          />

          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Add Button - Desktop */}
          <button
            onClick={onAddNew}
            className="hidden md:flex items-center gap-2 btn btn-primary whitespace-nowrap"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        </div>
      ) : expenses.length === 0 ? (
        // Empty State
        <ExpenseEmptyState
          searchTerm={searchTerm}
          category={category}
          onAddNew={onAddNew}
          onClearFilters={() => {
            onSearchChange("");
            onCategoryChange("");
          }}
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
                Showing {(pagination.page - 1) * 5 + 1} to{" "}
                {Math.min(pagination.page * 5, pagination.total)} of{" "}
                {pagination.total} expenses
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
          <div className="lg:hidden space-y-3 px-4">
            {table.getRowModel().rows.map((row) => {
              const expense = row.original;

              return (
                <div
                  key={row.id}
                  className="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {expense.category}
                      </h3>
                      {expense.notes && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {expense.notes}
                        </p>
                      )}
                    </div>
                    <div className="relative ml-2">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === expense._id ? null : expense._id)
                        }
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openMenuId === expense._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <button
                              onClick={() => {
                                onView(expense);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Icon icon="mdi:eye-outline" width="18" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                onEdit(expense);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Icon icon="mdi:pencil-outline" width="18" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                onDelete(expense);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-error flex items-center gap-2"
                            >
                              <Icon icon="mdi:delete-outline" width="18" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-600">Amount: </span>
                      <span className="text-gray-900 font-medium">
                        ₦{expense.amount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {formatDate(expense.title)}
                      </span>
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