// ============================================
// 1. GoodsListItem.tsx - Individual Goods Item Component
// ============================================
import { Icon } from "@iconify/react";

interface GoodsListItemProps {
  category: string;
  amount: number;
  date: string;
  quantity?: number;
  className?: string;
  onMenuClick?: () => void;
}

export const GoodsListItem: React.FC<GoodsListItemProps> = ({
  category,
  amount,
  date,
  quantity,
  className,
  onMenuClick,
}) => {
  return (
    <>
      {/* Desktop View */}
      <div
        className={`hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center py-2 px-4 lg:px-6 ${className}`}
      >
        <div className="text-gray-900">{category}</div>
        <div className="text-gray-700">₦{amount.toLocaleString()}</div>
        <div className="text-gray-700">{date}</div>
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon icon="mdi:dots-vertical" width="20" height="20" />
        </button>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-white rounded-lg p-4 border border-gray-200 mb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-gray-900">{category}</h3>
            
          </div>
          <button
            onClick={onMenuClick}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon icon="mdi:dots-vertical" width="20" height="20" />
          </button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            {/* <span className="text-gray-600">Costs: </span> */}
            <span className="text-gray-900 font-medium">
              ₦{amount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-900 font-medium">
              {date.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// 2. GoodsListHeader.tsx - Table Header (Desktop Only)
// ============================================
export const GoodsListHeader: React.FC = () => {
  return (
    <div className="hidden bg-white lg:grid lg:grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-subtle-2 font-semibold text-grey">
      <div>Category</div>
      <div>Amount</div>
      <div>Date</div>
      <div>Action</div>
    </div>
  );
};

// ============================================
// 3. GoodsList.tsx - Main Goods List Component
// ============================================
interface Good {
  id: string;
  category: string;
  amount: number;
  date: string;
  quantity?: number;
}

interface GoodsListProps {
  goods: Good[];
  onAddNew: () => void;
  onItemMenuClick?: (id: string) => void;
}

export const GoodsList: React.FC<GoodsListProps> = ({
  goods,
  onAddNew,
  onItemMenuClick,
}) => {
  return (
    <div className="lg:py-6 p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 lg:px-0 pt-4 lg:pt-0">
        <h2 className="h4 text-secondary">List of Expenses</h2>
      </div>

      {/* Desktop Table Header */}
      <GoodsListHeader />

      {/* Goods Items */}
      <div className="md:bg-white lg:mt-0 pb-4 lg:pb-0 rounded-bl-lg rounded-br-lg">
        {goods.length > 0 ? (
          goods.map((item) => (
            <GoodsListItem
              key={item.id}
              className="border-b border-accent-g2 last:border-b-0"
              category={item.category}
              amount={item.amount}
              date={item.date}
              quantity={item.quantity}
              onMenuClick={() => onItemMenuClick?.(item.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No goods added yet</p>
            <p className="text-sm mt-1">Click "Add New Goods" to get started</p>
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

// ============================================
// 4. StatsSummary.tsx - Mobile Stats Summary (Optional)
// ============================================
interface StatsSummaryProps {
  lowStockCount: number;
  lowStockLabel: string;
  profit: number;
  profitLabel: string;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  lowStockCount,
  lowStockLabel,
  profit,
  profitLabel,
}) => {
  return (
    <div className="lg:hidden mb-4 grid grid-cols-2 gap-3">
      {/* Low Stock Card */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <Icon icon="mdi:arrow-down" width="16" height="16" />
          <span className="text-sm font-medium">Low Stock</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {lowStockCount} Items
        </div>
        <div className="text-xs text-gray-500 mt-1">{lowStockLabel}</div>
      </div>

      {/* Profit Card */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <Icon icon="mdi:arrow-up" width="16" height="16" />
          <span className="text-sm font-medium">Profit</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          ₦{profit.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mt-1">{profitLabel}</div>
      </div>
    </div>
  );
};

// ============================================
// 5. Updated ManageStocks.tsx - Integration
// ============================================
import { useState } from "react";
import { StatCard } from "../home/components/StatCard";
import { expenseStats } from "../../lib/dummyData";
import { useAddGoodsModal } from "../../hooks/useAddGoodsModal";
import { AddGoodsModal } from "./components/AddGoodsModal";
import Modal from "../../components/ui/modal";
import { SelectInputBorderless } from "../../components/ui/selectInput";
import { Link } from "react-router-dom";

export const ExpensesPage = () => {
  const { isOpen, openModal, closeModal } = useAddGoodsModal();
  const [salesSuccessModal, setSalesSuccessModal] = useState(false);

  // Sample goods data - replace with your actual data
  const [goods] = useState<Good[]>([
    {
      id: "1",
      category: "Product Purchase",
      amount: 725000,
      date: "28/10/2025",
      quantity: 120,
    },
    {
      id: "2",
      category: "Transportation / Delivery",
      amount: 15000,
      date: "30/10/2025",
    },
    {
      id: "3",
      category: "Shop Rent",
      amount: 80000,
      date: "01/11/2025",
    },
    {
      id: "4",
      category: "Utilities (Electricity, Water, Internet)",
      amount: 22000,
      date: "02/11/2025",
    },
    {
      id: "5",
      category: "Repairs & Maintenance",
      amount: 10500,
      date: "03/11/2025",
    },
    {
      id: "6",
      category: "Staff Salary / Wages",
      amount: 150000,
      date: "05/11/2025",
    },
    {
      id: "7",
      category: "Advertising & Promotion",
      amount: 12000,
      date: "07/11/2025",
    },
    {
      id: "8",
      category: "Packaging Materials",
      amount: 7000,
      date: "08/11/2025",
      quantity: 50,
    },
    {
      id: "9",
      category: "Cleaning & Sanitation",
      amount: 4500,
      date: "09/11/2025",
    },
    {
      id: "10",
      category: "Equipment & Tools",
      amount: 25000,
      date: "10/11/2025",
    },
    {
      id: "11",
      category: "Taxes & Licenses",
      amount: 32000,
      date: "11/11/2025",
    },
    {
      id: "12",
      category: "Miscellaneous",
      amount: 3500,
      date: "12/11/2025",
    },
  ]);

  // Handle form submission
  const handleAddGoods = async () => {
    try {
      // Option 1: Using API mutation
      // await addGoods(data).unwrap();

      setSalesSuccessModal(true)

    } catch (error) {
      throw error; // Re-throw to let modal handle the error
    }
  };

  const handleItemMenu = (id: string) => {
    console.log("Menu clicked for item:", id);
    // Add your logic here - show menu, edit, delete, etc.
  };

  return (
    <section className="py-6">
      {/* Header */}
      <article className="mb-2">
        <div className="flex gap-2 items-center mb-2">
            {/* <Icon icon="mynaui:chevron-left-circle" width="24" height="24" /> */}
            <Link to='/home'> <Icon icon="ic:outline-arrow-circle-left" width="24px" className="text-secondary" /> </Link>
            <h1 className="h4 md:text-3xl text-secondary">Expense Management</h1>
        </div>
        <p className="text-black">Easily track and manage what you have spent</p>
      </article>

       {/* Time Filter */}
        <SelectInputBorderless 
          placeholder="Today"
          options={[
            { value: 'today', label: 'Today' },
            { value: 'yesterday', label: 'Yesterday' },
            { value: 'last-7-days', label: 'Last 7 days' },
            { value: 'last-30-days', label: 'Last 30 days' },
            { value: 'custom', label: 'Custom' },
          ]}
          name="time-filter"
          value={"today"}
          onChange={(e) => console.log(e.target.value)}
          className="w-30 flex items-center gap-2 h4 text-secondary border-none"
        />

      {/* Stats Grid */}
      <main className="py-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {expenseStats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.Icon}
            title={stat.title}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </main>

      {/* Goods List */}
      <div className="py-3">
        { goods.length > 0 ? (
            <GoodsList
            goods={goods}
            onAddNew={openModal}
            onItemMenuClick={handleItemMenu}
          />
        ) : (
            <div></div>
        )}
        
      </div>

      {/* Add Goods Modal */}
      <AddGoodsModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleAddGoods}
      />

      {/* Experience Modal */}
      {salesSuccessModal && (
        <Modal
          removeIcon={false}
          isOpen={salesSuccessModal}
          onClose={() => setSalesSuccessModal(false)}
          status="success"
          title="Success!"
          description="Sales Recorded Successfully"
          size="md"
        >
          <div className="flex justify-center gap-3 pt-10">
            <button onClick={() => setSalesSuccessModal(false)} className="px-10 btn btn-sec">
              Go Back
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};
