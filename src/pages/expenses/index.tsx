import { useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { StatCard } from "../home/components/StatCard";
import { expenseStats } from "../../lib/dummyData";
import { useAddGoodsModal } from "../../hooks/useAddGoodsModal";
import { AddGoodsModal } from "./components/AddGoodsModal";
import { ExpenseTable } from "./components/ExpenseTable";
import {
  ViewExpenseModal,
  EditExpenseModal,
  DeleteExpenseModal,
} from "./components/ExpenseModals";
import Modal from "../../components/ui/modal";
import { SelectInputBorderless } from "../../components/ui/selectInput";
import type { RootState } from "../../state/store";
import {
  useFetchExpensesQuery,
  useCreateExpensesMutation,
  useUpdateExpensesMutation,
  useDeleteExpensesMutation,
} from "../../services/expenses.service";
import { TimePeriod, type ExpenseData, type ICreateExpense } from "../../types/general";
import { handleApiError } from "../../lib/errorHandler";
import { usePersistentDashboard } from "../../hooks/usePersistentDashboard";
import { RefreshCw } from "lucide-react";

export const ExpensesPage = () => {
  const { isOpen, openModal, closeModal } = useAddGoodsModal();
  const [salesSuccessModal, setSalesSuccessModal] = useState(false);
  
  // Modal states
  const [viewExpense, setViewExpense] = useState<ExpenseData | null>(null);
  const [editExpense, setEditExpense] = useState<ExpenseData | null>(null);
  const [deleteExpense, setDeleteExpense] = useState<ExpenseData | null>(null);

  

  // Get shopId from Redux
  const { user } = useSelector((state: RootState) => state.auth);
  const shopId = user?.shopId || "";

  // Fetch expenses
  const {
    data: expensesResponse,
    isLoading: isLoadingExpenses,
    isError: isExpensesError,
    error: expensesError,
  } = useFetchExpensesQuery(shopId, {
    skip: !shopId,
  });

  // Mutations
  const [createExpense] = useCreateExpensesMutation();
  const [updateExpense] = useUpdateExpensesMutation();
  const [deleteExpenseMutation] = useDeleteExpensesMutation();

  // Extract expenses from response
  const expenses = expensesResponse?.data || [];

  // Handle create expense
  const handleAddExpense = useCallback(
    async (data: ICreateExpense) => {
      try {
        await createExpense({
          ...data,
          shopId,
        }).unwrap();

        // setSalesSuccessModal(true);
        closeModal();
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    [createExpense, shopId, closeModal]
  );

  // Handle update expense
  const handleUpdateExpense = useCallback(
    async (expenseId: string, data: ICreateExpense) => {
      try {
        await updateExpense({
          ...data,
          shopId,
          expenseId,
        }).unwrap();

        setEditExpense(null);
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    [updateExpense, shopId]
  );

  // Handle delete expense
  const handleDeleteExpense = useCallback(
    async (expenseId: string) => {
      try {
        await deleteExpenseMutation({
          shopId,
          expenseId,
        }).unwrap();

        setDeleteExpense(null);
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    [deleteExpenseMutation, shopId]
  );

  // Table action handlers
  const handleView = useCallback((expense: ExpenseData) => {
    setViewExpense(expense);
  }, []);

  const handleEdit = useCallback((expense: ExpenseData) => {
    setEditExpense(expense);
  }, []);

  const handleDelete = useCallback((expense: ExpenseData) => {
    setDeleteExpense(expense);
  }, []);

  // Show error toast if expenses fetch fails
  if (isExpensesError && expensesError) {
    handleApiError(expensesError);
  }

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(TimePeriod.DAILY);
  // Fetch dashboard data with selected period
  const {
    data: dashboardData,
    isFetching,
    refetch,
  } = usePersistentDashboard(user?.shopId || "", selectedPeriod);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Extract dashboard stats
  const dashboard = dashboardData?.data?.dashboard;

  // Build stats array from API data or show loading/default
  const stats = dashboard
    ? [
        {
          title: "Expenses",
          Icon: "ic:outline-monetization-on",
          value: formatCurrency(dashboard.expenses),
          description: "What you spent",
        }
      ]
    : [
        {
          title: "Expenses",
          Icon: "ic:outline-monetization-on",
          value: "₦0",
          description: "What you spent",
        }
    ];

    // Handle period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value as TimePeriod);
  };

  return (
    <section className="py-6">
      {/* Header */}
      <article className="mb-2">
        <div className="flex gap-2 items-center mb-2">
          {/* <Link to="/home">
            <Icon
              icon="ic:outline-arrow-circle-left"
              width="24px"
              className="text-secondary"
            />
          </Link> */}
          <h1 className="h4 md:text-3xl text-secondary">Expense Management</h1>
        </div>
        <p className="text-black">Easily track and manage what you have spent</p>
      </article>

      <div className="flex items-center justify-between mb-4">

      {/* Time Filter */}
      <SelectInputBorderless
        placeholder="Today"
        options={[
          { value: TimePeriod.DAILY, label: "Today" },
          { value: TimePeriod.WEEKLY, label: "Last 7 days" },
        ]}
        name="time-filter"
        value="today"
        onChange={handlePeriodChange}
        // disabled={isFetching}
        className="w-30 flex items-center gap-2 h4 text-secondary border-none"
      />

      {/* Refresh Button - Desktop */}
      <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh dashboard"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

      {/* Stats Grid */}
      <main className="py-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.Icon}
            title={stat.title}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </main>

      {/* Expenses Table */}
      <div className="py-3">
        <div className="mb-4">
          <div className="flex items-center justify-between px-4 lg:px-0">
            <h2 className="h4 text-secondary">List of Expenses</h2>
          </div>
        </div>

        <ExpenseTable
          expenses={expenses}
          isLoading={isLoadingExpenses}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={openModal}
        />

        {/* Add New Button */}
        {/* <div className="mt-6 px-4 lg:px-0 md:flex md:justify-end">
          <button onClick={openModal} className="btn btn-primary w-full md:w-1/4">
            Add New Expense
          </button>
        </div> */}
      </div>

      {/* Add Expense Modal */}
      <AddGoodsModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleAddExpense}
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
      />

      {/* Delete Expense Modal */}
      <DeleteExpenseModal
        isOpen={!!deleteExpense}
        onClose={() => setDeleteExpense(null)}
        expense={deleteExpense}
        onConfirm={handleDeleteExpense}
      />

      {/* Success Modal */}
      {salesSuccessModal && (
        <Modal
          removeIcon={false}
          isOpen={salesSuccessModal}
          onClose={() => setSalesSuccessModal(false)}
          status="success"
          title="Success!"
          description="Expense Recorded Successfully"
          size="md"
        >
          <div className="flex justify-center gap-3 pt-10">
            <button
              onClick={() => setSalesSuccessModal(false)}
              className="px-10 btn btn-sec"
            >
              Go Back
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};