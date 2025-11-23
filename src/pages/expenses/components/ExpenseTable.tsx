import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { MoreVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { ExpenseData } from "../../../types/general";

// Mock formatDate helper (replace with your actual implementation)
const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};



interface ExpenseTableProps {
  expenses: ExpenseData[];
  isLoading?: boolean;
  onView: (expense: ExpenseData) => void;
  onEdit: (expense: ExpenseData) => void;
  onDelete: (expense: ExpenseData) => void;
  onAddNew: () => void;
}

const columnHelper = createColumnHelper<ExpenseData>();

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Define columns
  const columns = useMemo<ColumnDef<ExpenseData, any>[]>(
    () => [
      columnHelper.accessor("category", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
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
          <div className="font-medium text-gray-900 max-w-[200px] truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("amount", {
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
            ₦{info.getValue().toLocaleString()}
          </div>
        ),
      }),
      columnHelper.accessor("title", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
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
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenMenuId(null)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <button
                    onClick={() => {
                      onView(row.original);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Icon icon="mdi:eye-outline" width="18" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      onEdit(row.original);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Icon icon="mdi:pencil-outline" width="18" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(row.original);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center gap-2"
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
    [openMenuId, onView, onEdit, onDelete]
  );

  // Initialize table
  const table = useReactTable({
    data: expenses,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="lg:py-6 p-0 overflow-hidden">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 lg:px-0 pt-4 lg:pt-0">
        <h2 className="h4 text-secondary">Expenses List</h2>
        <div className="w-full md:w-auto flex gap-2 px-1">
          <input
            type="text"
            placeholder="Search expenses..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
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
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-12">
                      <Icon
                        icon="mdi:receipt-text-outline"
                        width="48"
                        height="48"
                        className="mx-auto text-gray-400 mb-3"
                      />
                      <p className="text-gray-500">No expenses found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Click "Add New Expense" to get started
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {table.getRowModel().rows.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}{" "}
                  of {table.getFilteredRowModel().rows.length} entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate" title={row.original.category}>
                    {row.original.category}
                  </h3>
                  {row.original.notes && (
                    <p className="text-xs text-gray-500 truncate mt-1" title={row.original.notes}>
                      {row.original.notes}
                    </p>
                  )}
                </div>
                <div className="relative ml-2">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === row.original._id ? null : row.original._id)
                    }
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === row.original._id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <button
                          onClick={() => {
                            onView(row.original);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Icon icon="mdi:eye-outline" width="18" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            onEdit(row.original);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Icon icon="mdi:pencil-outline" width="18" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onDelete(row.original);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center gap-2"
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
                    ₦{row.original.amount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">
                    {formatDate(row.original.date)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Icon
              icon="mdi:receipt-text-outline"
              width="48"
              height="48"
              className="mx-auto text-gray-400 mb-3"
            />
            <p className="text-gray-500">No expenses found</p>
            <p className="text-sm text-gray-400 mt-1">
              Click "Add New Expense" to get started
            </p>
          </div>
        )}

        {/* Mobile Pagination */}
        {table.getRowModel().rows.length > 0 && (
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Button */}
      <div className="mt-6 px-4 lg:px-0 pb-4 lg:pb-0 md:flex md:justify-end">
        <button onClick={onAddNew} className="btn btn-primary w-full md:w-1/4">
          Add New Expense
        </button>
      </div>
    </div>
  );
};