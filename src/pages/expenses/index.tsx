// import { useState, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { StatCard } from "../home/components/StatCard";
// import { useAddGoodsModal } from "../../hooks/useAddGoodsModal";
// import { AddGoodsModal } from "./components/AddGoodsModal";
// import { ExpenseTable } from "./components/ExpenseTable";
// import {
//   ViewExpenseModal,
//   EditExpenseModal,
//   DeleteExpenseModal,
// } from "./components/ExpenseModals";
// import Modal from "../../components/ui/modal";
// import { SelectInputBorderless } from "../../components/ui/selectInput";
// import type { RootState } from "../../state/store";
// import {
//   useFetchExpensesQuery,
//   useCreateExpensesMutation,
//   useUpdateExpensesMutation,
//   useDeleteExpensesMutation,
// } from "../../services/expenses.service";
// import { TimePeriod, type ExpenseData, type ICreateExpense } from "../../types/general";
// import { handleApiError } from "../../lib/errorHandler";
// import { usePersistentDashboard } from "../../hooks/usePersistentDashboard";
// import { RefreshCw } from "lucide-react";

// export const ExpensesPage = () => {
//   const { isOpen, openModal, closeModal } = useAddGoodsModal();
//   const [salesSuccessModal, setSalesSuccessModal] = useState(false);
  
//   // Modal states
//   const [viewExpense, setViewExpense] = useState<ExpenseData | null>(null);
//   const [editExpense, setEditExpense] = useState<ExpenseData | null>(null);
//   const [deleteExpense, setDeleteExpense] = useState<ExpenseData | null>(null);

//   // Get shopId from Redux
//   const { user } = useSelector((state: RootState) => state.auth);
//   const shopId = user?.shopId || "";

//   // Fetch expenses
//   const {
//     data: expensesResponse,
//     isLoading: isLoadingExpenses,
//     isError: isExpensesError,
//     error: expensesError,
//   } = useFetchExpensesQuery(shopId, {
//     skip: !shopId,
//   });

//   // Mutations
//   const [createExpense] = useCreateExpensesMutation();
//   const [updateExpense] = useUpdateExpensesMutation();
//   const [deleteExpenseMutation] = useDeleteExpensesMutation();

//   // Extract expenses from response
//   const expenses = expensesResponse?.data || [];

//   // Handle create expense
//   const handleAddExpense = useCallback(
//     async (data: ICreateExpense) => {
//       try {
//         await createExpense({
//           ...data,
//           shopId,
//         }).unwrap();

//         // setSalesSuccessModal(true);
//         closeModal();
//       } catch (error) {
//         handleApiError(error);
//         throw error;
//       }
//     },
//     [createExpense, shopId, closeModal]
//   );

//   // Handle update expense
//   const handleUpdateExpense = useCallback(
//     async (expenseId: string, data: ICreateExpense) => {
//       try {
//         await updateExpense({
//           ...data,
//           shopId,
//           expenseId,
//         }).unwrap();

//         setEditExpense(null);
//       } catch (error) {
//         handleApiError(error);
//         throw error;
//       }
//     },
//     [updateExpense, shopId]
//   );

//   // Handle delete expense
//   const handleDeleteExpense = useCallback(
//     async (expenseId: string) => {
//       try {
//         await deleteExpenseMutation({
//           shopId,
//           expenseId,
//         }).unwrap();

//         setDeleteExpense(null);
//       } catch (error) {
//         handleApiError(error);
//         throw error;
//       }
//     },
//     [deleteExpenseMutation, shopId]
//   );

//   // Table action handlers
//   const handleView = useCallback((expense: ExpenseData) => {
//     setViewExpense(expense);
//   }, []);

//   const handleEdit = useCallback((expense: ExpenseData) => {
//     setEditExpense(expense);
//   }, []);

//   const handleDelete = useCallback((expense: ExpenseData) => {
//     setDeleteExpense(expense);
//   }, []);

//   // Show error toast if expenses fetch fails
//   if (isExpensesError && expensesError) {
//     handleApiError(expensesError);
//   }

//   const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(TimePeriod.DAILY);
//   // Fetch dashboard data with selected period
//   const {
//     data: dashboardData,
//     isFetching,
//     refetch,
//   } = usePersistentDashboard(user?.shopId || "", selectedPeriod);

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return `₦${amount.toLocaleString()}`;
//   };

//   // Extract dashboard stats
//   const dashboard = dashboardData?.data?.dashboard;

//   // Build stats array from API data or show loading/default
//   const stats = dashboard
//     ? [
//         {
//           title: "Expenses",
//           Icon: "ic:outline-monetization-on",
//           value: formatCurrency(dashboard.expenses),
//           description: "What you spent",
//         }
//       ]
//     : [
//         {
//           title: "Expenses",
//           Icon: "ic:outline-monetization-on",
//           value: "₦0",
//           description: "What you spent",
//         }
//     ];

//     // Handle period change
//   const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedPeriod(e.target.value as TimePeriod);
//   };

//   return (
//     <section className="py-6">
//       {/* Header */}
//       <article className="mb-2">
//         <div className="flex gap-2 items-center mb-2">
//           {/* <Link to="/home">
//             <Icon
//               icon="ic:outline-arrow-circle-left"
//               width="24px"
//               className="text-secondary"
//             />
//           </Link> */}
//           <h1 className="h4 md:text-3xl text-secondary">Expense Management</h1>
//         </div>
//         <p className="text-black">Easily track and manage what you have spent</p>
//       </article>

//       <div className="flex items-center justify-between mb-4">

//       {/* Time Filter */}
//       <SelectInputBorderless
//         placeholder="Today"
//         options={[
//           { value: TimePeriod.DAILY, label: "Today" },
//           { value: TimePeriod.WEEKLY, label: "Last 7 days" },
//         ]}
//         name="time-filter"
//         value="today"
//         onChange={handlePeriodChange}
//         // disabled={isFetching}
//         className="w-30 flex items-center gap-2 h4 text-secondary border-none"
//       />

//       {/* Refresh Button - Desktop */}
//       <button
//             onClick={() => refetch()}
//             disabled={isFetching}
//             className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             title="Refresh dashboard"
//           >
//             <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
//             <span>Refresh</span>
//           </button>
//         </div>

//       {/* Stats Grid */}
//       <main className="py-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <StatCard
//             key={index}
//             icon={stat.Icon}
//             title={stat.title}
//             value={stat.value}
//             description={stat.description}
//           />
//         ))}
//       </main>

//       {/* Expenses Table */}
//       <div className="py-3">
//         <div className="mb-4">
//           <div className="flex items-center justify-between px-4 lg:px-0">
//             <h2 className="h4 text-secondary">List of Expenses</h2>
//           </div>
//         </div>

//         <ExpenseTable
//           expenses={expenses}
//           isLoading={isLoadingExpenses}
//           onView={handleView}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onAddNew={openModal}
//         />

//         {/* Add New Button */}
//         {/* <div className="mt-6 px-4 lg:px-0 md:flex md:justify-end">
//           <button onClick={openModal} className="btn btn-primary w-full md:w-1/4">
//             Add New Expense
//           </button>
//         </div> */}
//       </div>

//       {/* Add Expense Modal */}
//       <AddGoodsModal
//         isOpen={isOpen}
//         onClose={closeModal}
//         onSubmit={handleAddExpense}
//       />

//       {/* View Expense Modal */}
//       <ViewExpenseModal
//         isOpen={!!viewExpense}
//         onClose={() => setViewExpense(null)}
//         expense={viewExpense}
//       />

//       {/* Edit Expense Modal */}
//       <EditExpenseModal
//         isOpen={!!editExpense}
//         onClose={() => setEditExpense(null)}
//         expense={editExpense}
//         onSubmit={handleUpdateExpense}
//       />

//       {/* Delete Expense Modal */}
//       <DeleteExpenseModal
//         isOpen={!!deleteExpense}
//         onClose={() => setDeleteExpense(null)}
//         expense={deleteExpense}
//         onConfirm={handleDeleteExpense}
//       />

//       {/* Success Modal */}
//       {salesSuccessModal && (
//         <Modal
//           removeIcon={false}
//           isOpen={salesSuccessModal}
//           onClose={() => setSalesSuccessModal(false)}
//           status="success"
//           title="Success!"
//           description="Expense Recorded Successfully"
//           size="md"
//         >
//           <div className="flex justify-center gap-3 pt-10">
//             <button
//               onClick={() => setSalesSuccessModal(false)}
//               className="px-10 btn btn-sec"
//             >
//               Go Back
//             </button>
//           </div>
//         </Modal>
//       )}
//     </section>
//   );
// };

// ============================================
// ExpensesPage.tsx - Optimized with Backend Pagination
// ============================================
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";
import type { RootState } from "../../state/store";
import { StatCard } from "../home/components/StatCard";
import { ExpenseTable } from "./components/ExpenseTable";
import { AddExpenseModal } from "./components/AddExpenseModal";
import { ViewExpenseModal } from "./components/ViewExpenseModal";
import { EditExpenseModal } from "./components/EditExpenseModal";
import { DeleteExpenseModal } from "./components/DeleteExpenseModal";
import {
  useGetExpensesQuery,
  useGetTotalExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from "../../services/expenses.service";
import { useDebounce } from "../../hooks/useDebounce";
import { type ExpenseData, type ICreateExpense } from "../../types/general";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

export const ExpensesPage = () => {
  // ============================================
  // State Management
  // ============================================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewExpense, setViewExpense] = useState<ExpenseData | null>(null);
  const [editExpense, setEditExpense] = useState<ExpenseData | null>(null);
  const [deleteExpense, setDeleteExpense] = useState<ExpenseData | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "amount" | "title">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { user } = useSelector((state: RootState) => state.auth);
  const shopId = user?.shopId || "";

  // Debounced search for backend query
  const debouncedSearch = useDebounce(searchTerm, 500);

  // ============================================
  // RTK Query Hooks
  // ============================================
  const {
    data: expensesResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetExpensesQuery(
    {
      shopId,
      search: debouncedSearch || undefined,
      category: category || undefined,
      page,
      limit: pageSize,
      sortBy,
      sortOrder,
    },
    {
      skip: !shopId,
    }
  );

  
  const {
    data: totalsResponse,
    isLoading: isLoadingTotals,
    refetch: refetchTotals,
  } = useGetTotalExpensesQuery(shopId, {
    skip: !shopId,
  });

  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const [deleteExpenseMutation, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  // ============================================
  // Data Transformation
  // ============================================
  const expenses = useMemo(() => {
    return expensesResponse?.data || [];
  }, [expensesResponse]);

  
  // console.log(expensesResponse?.data?.pagination?.total)
  const pagination = useMemo(() => ({
    total: expensesResponse?.pagination?.total || 0,
    page: expensesResponse?.pagination?.page || 1,
    pages: expensesResponse?.pagination?.pages || 1,
  }), [expensesResponse]);

  const totals = totalsResponse?.data;

  // ============================================
  // Event Handlers
  // ============================================
  const handleAddExpense = async (data: ICreateExpense) => {
    try {
      await createExpense({
        ...data,
        shopId,
      }).unwrap();

      setIsAddModalOpen(false);
    } catch (error: any) {
      throw error;
    }
  };

  const handleUpdateExpense = async (expenseId: string, data: ICreateExpense) => {
    try {
      await updateExpense({
        expenseId,
        ...data,
        shopId,
      }).unwrap();

      setEditExpense(null);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpenseMutation({
        shopId,
        expenseId,
      }).unwrap();

      setDeleteExpense(null);
    } catch (error: any) {
      throw error;
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    refetchTotals();
  };

  // Format currency
  const formatCurrency = (amount: number = 0) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Build stats array
  const stats = [
    {
      title: "Today",
      Icon: "ic:outline-monetization-on",
      value: formatCurrency(totals?.today || 0),
      description: "Today's expenses",
    },
    {
      title: "This Week",
      Icon: "ic:outline-trending-up",
      value: formatCurrency(totals?.week || 0),
      description: "Last 7 days",
    },
    {
      title: "This Month",
      Icon: "ic:outline-calendar-today",
      value: formatCurrency(totals?.month || 0),
      description: "Current month",
    },
    {
      title: "Total",
      Icon: "ic:outline-account-balance-wallet",
      value: formatCurrency(totals?.total || 0),
      description: "All time",
    },
  ];

  // ============================================
  // Loading State
  // ============================================
  if (isLoading && !expensesResponse) {
    return <LoadingState text="Loading expenses..." size="lg" />;
  }

  // ============================================
  // Error State
  // ============================================
  if (isError && !expensesResponse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorState
          errorCode="500"
          message={
            (error as any)?.data?.message ||
            (error as any)?.message ||
            "Failed to load expense data."
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <article className="mb-2">
          <h1 className="h4 md:text-3xl text-secondary mb-2">Expense Management</h1>
          <p className="text-gray-600">Track and manage your expenses with ease</p>
        </article>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isFetching || isLoadingTotals}
          className="btn btn-tertiary flex gap-2 items-center"
          title="Refresh data"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Banner (when data exists but refresh fails) */}
      {isError && expensesResponse && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-error shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-medium">Failed to refresh data</p>
              <p className="text-sm text-red-600 mt-1">
                {(error as any)?.data?.message || "Showing cached data"}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <main className="py-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingTotals ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.Icon}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))
        )}
      </main>

      {/* Expenses Table */}
      <div className="py-3">
        <ExpenseTable
          expenses={expenses}
          isLoading={isFetching && !expensesResponse}
          pagination={pagination}
          searchTerm={searchTerm}
          category={category}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onAddNew={() => setIsAddModalOpen(true)}
          onView={setViewExpense}
          onEdit={setEditExpense}
          onDelete={setDeleteExpense}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onPageChange={handlePageChange}
          onSort={handleSort}
        />
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExpense}
        isLoading={isCreating}
      />

      {/* View Expense Modal */}
      <ViewExpenseModal
        isOpen={!!viewExpense}
        onClose={() => setViewExpense(null)}
        expense={viewExpense}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        isOpen={!!editExpense}
        onClose={() => setEditExpense(null)}
        expense={editExpense}
        onSubmit={handleUpdateExpense}
        isLoading={isUpdating}
      />

      {/* Delete Expense Modal */}
      <DeleteExpenseModal
        isOpen={!!deleteExpense}
        onClose={() => setDeleteExpense(null)}
        expense={deleteExpense}
        onConfirm={handleDeleteExpense}
        isLoading={isDeleting}
      />
    </section>
  );
};