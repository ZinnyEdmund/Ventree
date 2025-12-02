import { useMemo, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Loader, 
  RefreshCw, 
  Search,
  X
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { 
  useGetTicketListQuery, 
  useGetCreditTicketsQuery,
  useGetSaleTicketByIdQuery,
  useSearchTicketsQuery
} from "../../services/sales.service";
import {
  PaymentMethodOptions,
  type CreditSale,
  type salesResponse,
} from "../../types/general";
import { RecordCreditPaymentModal } from "./components/RecordPaymentModal";
import ErrorState from "../../components/common/ErrorState";

interface TicketRow {
  id: string;
  ticketNumber: string;
  totalAmount: number;
  soldByName?: string;
  paymentMethod: string;
  date: string;
  customerName?: string;
  amountOwed?: number;
  amountPaid?: number;
}

type TabType = "debtors" | "history";

const formatCurrency = (amount: number) =>
  `₦${(amount || 0).toLocaleString()}`;

const getTimeAgo = (date: string) => {
  const now = new Date();
  const saleDate = new Date(date);
  const diffMs = now.getTime() - saleDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const ticketColumnHelper = createColumnHelper<TicketRow>();

const PaymentBadge = ({ method }: { method: string }) => {
  const isCredit =
    method?.toLowerCase() === PaymentMethodOptions.credit.toLowerCase();

  return (
    <span
      className={`text-sm font-semibold ${
        isCredit ? "text-red-600" : "text-gray-700"
      }`}
    >
      {method ? method.charAt(0).toUpperCase() + method.slice(1) : "Cash"}
    </span>
  );
};

interface TableProps {
  data: TicketRow[];
  isLoading: boolean;
  emptyState: {
    title: string;
    description: string;
  };
  columns: ColumnDef<TicketRow, any>[];
  onRowAction?: (ticketId: string) => void;
}

const TableCard: React.FC<TableProps> = ({
  data,
  isLoading,
  emptyState,
  columns,
  onRowAction,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Icon icon="mdi:loading" className="animate-spin" width="24" />
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center space-y-2">
        <p className="text-gray-800 font-semibold">{emptyState.title}</p>
        <p className="text-gray-500 text-sm">{emptyState.description}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide uppercase"
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
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
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

      <div className="lg:hidden divide-y divide-gray-100">
        {table.getRowModel().rows.map((row) => {
          const ticket = row.original;
          return (
            <div key={row.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-gray-500">Ticket</p>
                  <p className="font-semibold text-gray-900">
                    {ticket.ticketNumber}
                  </p>
                </div>
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => onRowAction?.(ticket.id)}
                >
                  <Info size={18} className="text-gray-500" />
                </button>
              </div>
              {ticket.customerName && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Customer</span>
                  <span className="font-medium text-gray-900">
                    {ticket.customerName}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Price</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(ticket.totalAmount)}
                </span>
              </div>
              {ticket.amountOwed !== undefined && ticket.amountOwed > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Amount Owed</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(ticket.amountOwed)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Sold By</span>
                <span className="font-medium text-gray-900">
                  {ticket.soldByName || "You"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Date</span>
                <span className="text-gray-900">{getTimeAgo(ticket.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Payment</span>
                <PaymentBadge method={ticket.paymentMethod} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isLoading,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-4">
      <div className="text-sm text-gray-600">
        Showing page {currentPage} of {totalPages} ({totalItems} total items)
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              page === currentPage
                ? "bg-primary text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export const HistoryPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>("history");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 when searching
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isSearching = debouncedSearch.length >= 2;

  // Search query (when searching)
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    error: searchError,
  } = useSearchTicketsQuery(
    { 
      shopId: user?.shopId || "", 
      q: debouncedSearch,
      page,
      limit
    },
    { skip: !user?.shopId || !isSearching }
  );

  // All tickets query (when not searching)
  const {
    data: allTicketsData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
    error: allTicketsError,
    refetch: refetchAll,
  } = useGetTicketListQuery(
    { 
      shopId: user?.shopId || "",
      page,
      limit
    },
    { skip: !user?.shopId || isSearching }
  );

  // Credit tickets query (when not searching)
  const {
    data: creditTicketsData,
    isLoading: isLoadingCredit,
    isFetching: isFetchingCredit,
    error: creditTicketsError,
    refetch: refetchCredit,
  } = useGetCreditTicketsQuery(
    { 
      shopId: user?.shopId || "",
      creditStatus: "pending",
      page,
      limit
    },
    { skip: !user?.shopId || isSearching }
  );

  // Fetch full ticket details when a ticket is selected
  const { data: ticketDetailsData, isLoading: isLoadingTicket } = useGetSaleTicketByIdQuery(
    {
      shopId: user?.shopId || "",
      ticketId: selectedTicketId || "",
    },
    {
      skip: !selectedTicketId || !user?.shopId,
    }
  );

  // Determine which data to use
  const activeData = isSearching 
    ? searchResults 
    : (activeTab === "history" ? allTicketsData : creditTicketsData);

  const activeError = isSearching
    ? searchError
    : (activeTab === "history" ? allTicketsError : creditTicketsError);

  // Transform tickets for display
  const tickets = useMemo<TicketRow[]>(() => {
    const items = isSearching 
      ? (searchResults?.data?.tickets || [])
      : (activeTab === "history" 
          ? (allTicketsData?.data?.tickets || []) 
          : (creditTicketsData?.data?.tickets || []));
    
    if (!items.length) return [];

    return items.map((ticket: salesResponse | CreditSale) => ({
      id: ticket._id ?? "",
      ticketNumber: ticket.ticketNumber ?? "",
      totalAmount: ticket.totalAmount ?? 0,
      soldByName: ticket.soldByName ?? "",
      paymentMethod: ticket.paymentMethod ?? "",
      date: ticket.date ?? "",
      customerName: ticket.customerName ?? "",
      amountOwed: ticket.amountOwed ?? 0,
      amountPaid: ticket.amountPaid ?? 0,
    }));
  }, [searchResults, allTicketsData, creditTicketsData, activeTab, isSearching]);

  // Get counts from non-search queries (for tab badges)
  const allTicketsCount = allTicketsData?.data?.total || allTicketsData?.data?.tickets?.length || 0;
  const creditTicketsCount = creditTicketsData?.data?.total || creditTicketsData?.data?.tickets?.length || 0;

  // Pagination info
  const pagination = activeData?.data;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || tickets.length;

  const handleRowAction = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicketId(null);
  };

  const handleRefresh = () => {
    refetchAll();
    refetchCredit();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1); // Reset to page 1 when switching tabs
  };

  const isBusy = isLoadingAll || isFetchingAll || isLoadingCredit || isFetchingCredit || isSearchLoading || isSearchFetching;

  // Debtors columns
  const debtorColumns: ColumnDef<TicketRow, any>[] = [
    ticketColumnHelper.accessor("customerName", {
      header: "Name",
      cell: (info) => (
        <div className="font-semibold text-gray-900">
          {info.getValue() || "Walk-in Customer"}
        </div>
      ),
    }),
    ticketColumnHelper.accessor("totalAmount", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown size={14} />
          ) : (
            <ArrowUpDown size={14} className="text-gray-400" />
          )}
        </button>
      ),
      cell: (info) => (
        <div className="font-semibold text-gray-900">
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    ticketColumnHelper.accessor("amountOwed", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Owed
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown size={14} />
          ) : (
            <ArrowUpDown size={14} className="text-gray-400" />
          )}
        </button>
      ),
      cell: (info) => (
        <div className="font-semibold text-red-600">
          {formatCurrency(info.getValue() || 0)}
        </div>
      ),
    }),
    ticketColumnHelper.accessor("soldByName", {
      header: "Sold By",
      cell: (info) => (
        <div className="text-gray-700">
           {info.getValue() || "You"}
        </div>
      ),
    }),
    ticketColumnHelper.accessor("date", {
      header: "Date",
      cell: (info) => (
        <div className="text-gray-700">{getTimeAgo(info.getValue())}</div>
      ),
    }),
    ticketColumnHelper.display({
      id: "debtorActions",
      header: "",
      cell: ({ row }) => (
        <button 
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={() => handleRowAction(row.original.id)}
        >
          <Info size={16} className="text-gray-500" />
        </button>
      ),
    }),
  ];

  // Sales History columns
  const ticketColumns: ColumnDef<TicketRow, any>[] = [
    ticketColumnHelper.accessor("ticketNumber", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown size={14} />
          ) : (
            <ArrowUpDown size={14} className="text-gray-400" />
          )}
        </button>
      ),
      cell: (info) => (
        <div className="font-semibold text-gray-900">{info.getValue()}</div>
      ),
    }),
    ticketColumnHelper.accessor("totalAmount", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown size={14} />
          ) : (
            <ArrowUpDown size={14} className="text-gray-400" />
          )}
        </button>
      ),
      cell: (info) => (
        <div className="font-semibold text-gray-900">
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    ticketColumnHelper.accessor("soldByName", {
      header: "Sold By",
      cell: (info) => (
        <div className="text-gray-700">
        {info.getValue() || "You"}
        </div>
      ),
    }),
    ticketColumnHelper.accessor("date", {
      header: "Date",
      cell: (info) => (
        <div className="text-gray-700">{getTimeAgo(info.getValue())}</div>
      ),
    }),
    ticketColumnHelper.accessor("paymentMethod", {
      header: "Payment",
      cell: (info) => <PaymentBadge method={info.getValue()} />,
    }),
    ticketColumnHelper.display({
      id: "ticketActions",
      header: "",
      cell: ({ row }) => (
        <button 
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={() => handleRowAction(row.original.id)}
        >
          <Info size={16} className="text-gray-500" />
        </button>
      ),
    }),
  ];

  // Show global error if any
  if (activeError) {
    return (
      <section className="py-6">
        <ErrorState 
          message="Failed to load sales data" 
          onRetry={handleRefresh}
        />
      </section>
    );
  }

  return (
    <section className="py-6 space-y-6">
      {/* Header with Search and Refresh */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="h4 md:text-2xl text-secondary">
            {isSearching ? "Search Results" : activeTab === "debtors" ? "Debtors" : "Sales History"}
          </h1>
          <p className="text-sm text-gray-900">
            {isSearching 
              ? `Found ${totalItems} result${totalItems !== 1 ? 's' : ''} for "${debouncedSearch}"` 
              : activeTab === "debtors" 
                ? "The people that are owing you." 
                : "See what you have sold."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Small Search Bar */}
          <div className="relative w-full sm:w-auto sm:max-w-xs">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isBusy}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <RefreshCw size={16} className={isBusy ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation (Hide when searching) */}
      {!isSearching && (
        <div className="bg-white rounded-xl border border-gray-100 p-1">
          <nav className="flex gap-1">
            <button
              onClick={() => handleTabChange("history")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Sales History</span>
                {allTicketsCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "history" 
                      ? "bg-white/20 text-white" 
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {allTicketsCount}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => handleTabChange("debtors")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "debtors"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Debtors</span>
                {creditTicketsCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "debtors" 
                      ? "bg-white/20 text-white" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {creditTicketsCount}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>
      )}

      {/* Table Content */}
      <div className="space-y-0">
        <TableCard
          data={tickets}
          isLoading={isBusy}
          emptyState={{
            title: isSearching ? "No results found" : activeTab === "debtors" ? "No debtors yet" : "No sales yet",
            description: isSearching 
              ? "Try a different search term" 
              : activeTab === "debtors"
                ? "Credit sales will appear here once recorded."
                : "Once you record sales, they will show up here.",
          }}
          columns={isSearching || activeTab === "history" ? ticketColumns : debtorColumns}
          onRowAction={handleRowAction}
        />

        {/* Pagination */}
        {/* {tickets.length > 0 && ( */}
          <div className="bg-white rounded-b-xl border border-t-0 border-gray-100">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              isLoading={isBusy}
            />
          </div>
        {/* )} */}
      </div>

      {/* Record Credit Payment Modal */}
      {isModalOpen && (
        <>
          {isLoadingTicket ? (
            <>
              <div className="fixed inset-0 bg-black/50 z-40" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <Loader />
                </div>
              </div>
            </>
          ) : ticketDetailsData?.data ? (
            <RecordCreditPaymentModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              ticket={ticketDetailsData.data}
              shopId={user?.shopId || ""}
              currentUserId={user?.userId || ""}
            />
          ) : null}
        </>
      )}
    </section>
  );
};
