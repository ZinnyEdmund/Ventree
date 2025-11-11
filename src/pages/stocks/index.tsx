// ============================================
// 1. GoodsListItem.tsx - Individual Goods Item Component
// ============================================
import { Icon } from "@iconify/react";

interface GoodsListItemProps {
  product: string;
  costPrice: number;
  sellingPrice: number;
  quantity?: number;
  className?: string;
  onMenuClick?: () => void;
}

export const GoodsListItem: React.FC<GoodsListItemProps> = ({
  product,
  costPrice,
  sellingPrice,
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
        <div className="text-gray-900">{product}</div>
        <div className="text-gray-700">₦{costPrice.toLocaleString()}</div>
        <div className="text-gray-700">₦{sellingPrice.toLocaleString()}</div>
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
            <h3 className="font-medium text-gray-900">{product}</h3>
            {quantity && (
              <span className="text-xs text-gray-500">({quantity} left)</span>
            )}
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
            <span className="text-gray-600">Costs: </span>
            <span className="text-gray-900 font-medium">
              ₦{costPrice.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Sells: </span>
            <span className="text-gray-900 font-medium">
              ₦{sellingPrice.toLocaleString()}
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
      <div>Product</div>
      <div>Cost Price</div>
      <div>Selling Price</div>
      <div>Action</div>
    </div>
  );
};

// ============================================
// 3. GoodsList.tsx - Main Goods List Component
// ============================================
interface Good {
  id: string;
  product: string;
  costPrice: number;
  sellingPrice: number;
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
        <h2 className="h4 text-secondary">Goods List</h2>
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
              product={item.product}
              costPrice={item.costPrice}
              sellingPrice={item.sellingPrice}
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
          Add New Goods
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
import { stats } from "../../lib/dummyData";
import { useAddGoodsModal } from "../../hooks/useAddGoodsModal";
import { AddGoodsModal, type GoodsFormData } from "./components/AddGoodsModal";
import Modal from "../../components/ui/modal";
import { Link } from "react-router-dom";

export const ManageStocks = () => {
  const { isOpen, openModal, closeModal } = useAddGoodsModal();
  const [salesSuccessModal, setSalesSuccessModal] = useState(false);

  // Sample goods data - replace with your actual data
  const [goods, setGoods] = useState<Good[]>([
    {
      id: "1",
      product: "Coca-Cola 50cl",
      costPrice: 700,
      sellingPrice: 900,
      quantity: 36,
    },
    {
      id: "2",
      product: "Coca-Cola 50cl",
      costPrice: 700,
      sellingPrice: 900,
      quantity: 36,
    },
    {
      id: "3",
      product: "Coca-Cola 50cl",
      costPrice: 700,
      sellingPrice: 900,
      quantity: 36,
    },
    {
      id: "4",
      product: "Coca-Cola 50cl",
      costPrice: 700,
      sellingPrice: 900,
      quantity: 36,
    },
    {
      id: "5",
      product: "Coca-Cola 50cl",
      costPrice: 700,
      sellingPrice: 900,
      quantity: 36,
    },
    {
      id: "6",
      product: "Coca-Cola 50cl",
      costPrice: 700,
      sellingPrice: 900,
      quantity: 36,
    },
  ]);

  // Handle form submission
  const handleAddGoods = async (data: GoodsFormData) => {
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
        <h1 className="h3 text-secondary mb-2">Goods Management</h1>
        <p className="text-black">Easily track and manage your shop items</p>
      </article>

      {/* Stats Grid */}
      <main className="py-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.Icon}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            variant={stat.variant}
          />
        ))}
      </main>

      {/* Goods List */}
      <div className="py-3">
        <GoodsList
          goods={goods}
          onAddNew={openModal}
          onItemMenuClick={handleItemMenu}
        />
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
