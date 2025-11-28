import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetCreditsByShopQuery, useGetSalesByShopQuery } from "../../services/sales.service";
import { Info, X } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { Sale } from "../../types/general";
import type { RootState } from "../../state/store";

// // Types
// interface RootState {
//   auth: {
//     user: {
//       shopId: string;
//       name: string;
//     } | null;
//   };
// }

// interface Sale {
//   _id: string;
//   shopId: string;
//   itemId: string;
//   itemName: string;
//   itemCategory: string;
//   quantitySold: number;
//   costPrice: number;
//   sellingPrice: number;
//   totalAmount: number;
//   amountPaid: number;
//   amountOwed: number;
//   discount: number;
//   taxAmount: number;
//   profitAmount: number;
//   paymentMethod: string;
//   isCredit: boolean;
//   creditStatus: string;
//   refunded: boolean;
//   payments: any[];
//   soldBy?: {
//     _id: string;
//     staffName: string;
//   };
//   soldByName?: string;
//   date: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

interface TableSale {
  id: string;
  price: number;
  product: string;
  date: string;
  payment: string;
  soldBy: string;
  isCredit: boolean;
  originalData: Sale;
}

// Modal Component
const SaleDetailsModal = ({
  sale,
  onClose,
}: {
  sale: Sale | null;
  onClose: () => void;
}) => {
  if (!sale) return null;

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Sale Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Product Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Product Name</p>
                <p className="font-medium text-gray-800">{sale.itemName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium text-gray-800">{sale.itemCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantity Sold</p>
                <p className="font-medium text-gray-800">{sale.quantitySold}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sold By</p>
                <p className="font-medium text-gray-800">
                  {sale.soldBy?.staffName || sale.soldByName || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Financial Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cost Price</p>
                <p className="font-medium text-gray-800">
                  {formatCurrency(sale.costPrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Selling Price</p>
                <p className="font-medium text-gray-800">
                  {formatCurrency(sale.sellingPrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-gray-800">
                  {formatCurrency(sale.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-medium text-green-600">
                  {formatCurrency(sale.amountPaid)}
                </p>
              </div>
              {sale.amountOwed > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Amount Owed</p>
                  <p className="font-medium text-red-600">
                    {formatCurrency(sale.amountOwed)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Profit</p>
                <p className="font-medium text-green-600">
                  {formatCurrency(sale.profitAmount)}
                </p>
              </div>
              {sale.discount > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Discount</p>
                  <p className="font-medium text-gray-800">
                    {formatCurrency(sale.discount)}
                  </p>
                </div>
              )}
              {sale.taxAmount > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Tax Amount</p>
                  <p className="font-medium text-gray-800">
                    {formatCurrency(sale.taxAmount)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Payment Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium text-gray-800">{sale.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Credit Status</p>
                <p
                  className={`font-medium ${
                    sale.isCredit ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {sale.isCredit ? sale.creditStatus : "Paid"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Refunded</p>
                <p
                  className={`font-medium ${
                    sale.refunded ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {sale.refunded ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sale Date</p>
                <p className="font-medium text-gray-800">
                  {new Date(sale.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const HistoryPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<"debtors" | "sales">("debtors");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Fetch sales data
  const {
    data: salesData,
    isLoading,
    isError,
    error,
  } = useGetSalesByShopQuery(user?.shopId || "", {
    skip: !user?.shopId,
  });

//   Fetch Debtors
  const {
    data: debtorsDataFetch,
    isLoading: isLoadingDebtors,
    isError: isErrorDebtors,
    error: errorDebtors,
    } = useGetCreditsByShopQuery(user?.shopId || "", {})

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMins = Math.floor(diffInMs / (1000 * 60));

    if (diffInMins < 60) {
      return `${diffInMins} mins ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-GB");
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };

  // Transform data for tables
  const tableData: TableSale[] = useMemo(() => {
    return (
      salesData?.data?.sales?.map((sale, index) => ({
        id: String(index + 1).padStart(4, "0"),
        price: sale.totalAmount,
        product: sale.itemName,
        date: formatDate(sale.createdAt),
        payment: sale.paymentMethod,
        soldBy: sale.soldBy?.staffName || sale.soldByName || "You",
        isCredit: sale.isCredit,
        originalData: sale,
      })) || []
    );
  }, [salesData]);

  // Filter debtors (credit sales)
  const debtorsData = useMemo(() => {
    return tableData.filter((sale) => sale.isCredit);
  }, [tableData]);

  // Column helper
  const columnHelper = createColumnHelper<TableSale>();

  // Debtors columns
  const debtorsColumns: ColumnDef<TableSale, any>[] = [
    columnHelper.accessor("soldBy", {
      header: "Name",
      cell: (info) => (
        <span className="text-gray-800 font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => (
        <span className="text-gray-800">{formatCurrency(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("product", {
      header: "Product",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("payment", {
      header: "Payment",
      cell: (info) => (
        <span className="text-red-600 font-medium">Credit</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <button
          onClick={() => setSelectedSale(info.row.original.originalData)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Info size={20} />
        </button>
      ),
    }),
  ];

  // Sales columns
  const salesColumns: ColumnDef<TableSale, any>[] = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <span className="text-gray-800 font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => (
        <span className="text-gray-800">{formatCurrency(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("product", {
      header: "Product",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("payment", {
      header: "Payment",
      cell: (info) => (
        <span
          className={`font-medium ${
            info.row.original.isCredit ? "text-red-600" : "text-gray-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <button
          onClick={() => setSelectedSale(info.row.original.originalData)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Info size={20} />
        </button>
      ),
    }),
  ];

  // Debtors table
  const debtorsTable = useReactTable({
    data: debtorsData,
    columns: debtorsColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Sales table
  const salesTable = useReactTable({
    data: tableData,
    columns: salesColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const currentTable = activeTab === "debtors" ? debtorsTable : salesTable;

  return (
    <div className="py-6 max-w-7xl mx-auto px-4">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("debtors")}
          className={`pb-3 px-2 font-semibold text-lg transition-colors relative ${
            activeTab === "debtors"
              ? "text-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Debtors
          {activeTab === "debtors" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`pb-3 px-2 font-semibold text-lg transition-colors relative ${
            activeTab === "sales"
              ? "text-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sales History
          {activeTab === "sales" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700" />
          )}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-700"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 font-medium">Failed to load data</p>
          <p className="text-sm text-red-600 mt-1">
            {(error as any)?.data?.message || "Please try again later"}
          </p>
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === "debtors" ? "Debtors" : "Sales History"}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {activeTab === "debtors"
                ? "The people that are owing you."
                : "View what have you have sold."}
            </p>
          </div>

          {currentTable.getRowModel().rows.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">
                No {activeTab === "debtors" ? "debtors" : "sales"} found
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      {currentTable.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="text-left py-3 px-4 font-semibold text-gray-700 text-sm"
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
                      {currentTable.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="py-3 px-4">
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

                {/* Pagination */}
                {currentTable.getPageCount() > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Page {currentTable.getState().pagination.pageIndex + 1} of{" "}
                      {currentTable.getPageCount()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => currentTable.previousPage()}
                        disabled={!currentTable.getCanPreviousPage()}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => currentTable.nextPage()}
                        disabled={!currentTable.getCanNextPage()}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden bg-white rounded-lg border border-gray-200">
                {currentTable.getRowModel().rows.map((row) => (
                  <div
                    key={row.id}
                    className="p-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {activeTab === "sales" && (
                          <p className="text-sm text-gray-500">
                            #{row.original.id}
                          </p>
                        )}
                        <p className="font-semibold text-gray-800">
                          {row.original.product}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activeTab === "debtors"
                            ? row.original.soldBy
                            : `Sold by ${row.original.soldBy}`}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedSale(row.original.originalData)}
                        className="text-gray-400"
                      >
                        <Info size={20} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-800 font-medium">
                        ₦{formatCurrency(row.original.price)}
                      </span>
                      <span
                        className={`font-medium ${
                          row.original.isCredit
                            ? "text-red-600"
                            : "text-gray-800"
                        }`}
                      >
                        {row.original.payment}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {row.original.date}
                    </p>
                  </div>
                ))}

                {/* Mobile Pagination */}
                {currentTable.getPageCount() > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Page {currentTable.getState().pagination.pageIndex + 1} of{" "}
                      {currentTable.getPageCount()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => currentTable.previousPage()}
                        disabled={!currentTable.getCanPreviousPage()}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => currentTable.nextPage()}
                        disabled={!currentTable.getCanNextPage()}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Sale Details Modal */}
      {selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </div>
  );
}