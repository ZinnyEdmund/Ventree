// ============================================
// ManageStocks.tsx - Properly Integrated with RTK Query
// ============================================
import { useState, useEffect, useMemo } from "react";
import { StatCard } from "../home/components/StatCard";
import { useAddGoodsModal } from "../../hooks/useAddGoodsModal";
import { AddGoodsModal, type GoodsFormData } from "./components/AddGoodsModal";
import { GoodsTable } from "./components/GoodsTable";
import Modal from "../../components/ui/modal";
import { toast } from "sonner";
import {
  useFetchInventoryQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} from "../../services/stocks.service";
import type { Stocks } from "../../types/general";
import { stats } from "../../lib/dummyData";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";

export const ManageStocks = () => {
  const { isOpen, openModal, closeModal } = useAddGoodsModal();
  const [salesSuccessModal, setSalesSuccessModal] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<string | null>(null);
  const shop = useSelector((state: RootState) => state.auth.user);
  
  // Get shopId from your auth state or context
  // TODO: Replace with actual shopId from your Redux store/context
  const shopId = shop?.shopId || ""; 


  // Fetch inventory data using RTK Query
  const {
    data: inventoryResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchInventoryQuery(shopId);

  const [createInventory] = useCreateInventoryMutation();
  const [updateInventory] = useUpdateInventoryMutation();
  const [deleteInventory, { isLoading: isDeleting }] = useDeleteInventoryMutation();

  // Transform Stocks data to match GoodsTable structure
  const goods = useMemo(() => {
    if (!inventoryResponse?.data) return [];
    
    return inventoryResponse.data.items.map((stock: Stocks) => ({
      id: stock._id,
      product: stock.name,
      costPrice: stock.costPrice,
      sellingPrice: stock.sellingPrice,
      quantity: stock.availableQuantity,
      category: stock.category,
      sku: stock.sku,
      unit: stock.unit,
      isLowStock: stock.isLowStock,
      isOutOfStock: stock.isOutOfStock,
      reorderLevel: stock.reorderLevel,
    }));
  }, [inventoryResponse]);

  // Calculate stats from actual inventory data
//   const calculatedStats = useMemo(() => {
//     if (!inventoryResponse?.data) {
//       return {
//         totalItems: 0,
//         lowStockCount: 0,
//         totalValue: 0,
//         expectedProfit: 0,
//       };
//     }

//     const stocks = inventoryResponse.data;

//     return {
//       totalItems: stocks.length,
//       lowStockCount: stocks.filter((s: Stocks) => s.isLowStock).length,
//       totalValue: stocks.reduce(
//         (sum: number, s: Stocks) => sum + s.costPrice * s.availableQuantity,
//         0
//       ),
//       expectedProfit: stocks.reduce(
//         (sum: number, s: Stocks) => 
//           sum + (s.sellingPrice - s.costPrice) * s.availableQuantity,
//         0
//       ),
//     };
//   }, [inventoryResponse]);

  // Handle form submission (Create or Update)
  const handleAddGoods = async (formData: GoodsFormData) => {
    try {
      if (editMode) {
        // Update existing item
        await updateInventory({
          shopId,
          itemId: editMode,
          name: formData.productName,
          initialQuantity: formData.quantity,
          availableQuantity: formData.quantity,
          unit: formData.measurement,
          costPrice: formData.costPrice,
          sellingPrice: formData.sellingPrice,
          category: formData.category || "General",
          reorderLevel: formData.reorderLevel || 10,
        }).unwrap();

        toast.success("Goods updated successfully!");
        setEditMode(null);
      } else {
        // Create new item
        await createInventory({
          shopId,
          name: formData.productName,
          initialQuantity: formData.quantity,
          unit: formData.measurement,
          costPrice: formData.costPrice,
          sellingPrice: formData.sellingPrice,
          category: formData.category || "General",
          reorderLevel: formData.reorderLevel || 10,
        }).unwrap();
   
        toast.success("Goods added successfully!");
        // setSalesSuccessModal(true);
      }

      closeModal();
    } catch (error: any) {
      const errorMessage = 
        error?.data?.message || 
        error?.message || 
        "Failed to save goods";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Handle edit
  const handleEdit = (id: string) => {
    const item = inventoryResponse?.data?.items.find((s: Stocks) => s._id === id);
    if (item) {
      setEditMode(id);
      openModal();
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    setDeleteConfirmModal(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmModal) return;

    try {
      await deleteInventory({
        shopId,
        itemId: deleteConfirmModal,
      }).unwrap();

      toast.success("Goods deleted successfully!");
      setDeleteConfirmModal(null);
    } catch (error: any) {
      const errorMessage = 
        error?.data?.message || 
        error?.message || 
        "Failed to delete goods";
      toast.error(errorMessage);
    }
  };

  // Get initial data for edit mode
  const getInitialData = () => {
    if (!editMode || !inventoryResponse?.data) return undefined;
    
    const stock = inventoryResponse.data.items.find((s: Stocks) => s._id === editMode);
    if (!stock) return undefined;

    return {
      id: stock._id,
      product: stock.name,
      costPrice: stock.costPrice,
      sellingPrice: stock.sellingPrice,
      quantity: stock.availableQuantity,
      measurement: stock.unit,
      category: stock.category,
      reorderLevel: stock.reorderLevel,
    };
  };

  // Handle error state
  useEffect(() => {
    if (isError) {
      const errorMessage = 
        (error as any)?.data?.message || 
        (error as any)?.message || 
        "Failed to load inventory data";
      toast.error(errorMessage);
    }
  }, [isError, error]);

  return (
    <section className="py-6">
      {/* Header */}
      <article className="mb-2">
        <h1 className="h4 md:text-3xl text-secondary mb-2">Goods Management</h1>
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

      {/* Error State */}
      {isError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-error">
            Failed to load inventory. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Goods Table */}
      <div className="py-3">
        <GoodsTable
          goods={goods}
          onAddNew={() => {
            setEditMode(null);
            openModal();
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Add/Edit Goods Modal */}
      <AddGoodsModal
        isOpen={isOpen}
        onClose={() => {
          closeModal();
          setEditMode(null);
        }}
        onSubmit={handleAddGoods}
        initialData={getInitialData()}
        isEditMode={!!editMode}
      />

      {/* Success Modal */}
      {salesSuccessModal && (
        <Modal
          removeIcon={false}
          isOpen={salesSuccessModal}
          onClose={() => setSalesSuccessModal(false)}
          status="success"
          title="Success!"
          description="Goods Added Successfully"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <Modal
          removeIcon={false}
          isOpen={!!deleteConfirmModal}
          onClose={() => setDeleteConfirmModal(null)}
          status="error"
          title="Confirm Delete"
          description="Are you sure you want to delete this item? This action cannot be undone."
          size="md"
        >
          <div className="flex justify-center gap-3 pt-10">
            <button
              onClick={() => setDeleteConfirmModal(null)}
              className="px-10 btn btn-tertiary"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-10 btn btn-error"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};