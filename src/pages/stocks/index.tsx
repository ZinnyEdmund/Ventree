// ============================================
// ManageStocks.tsx - Optimized with New Inventory Service
// ============================================
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import type { RootState } from "../../state/store";

import { AddGoodsModal, type GoodsFormData } from "./components/AddGoodsModal";
import { GoodsTable } from "./components/GoodsTable";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { useDebounce } from "../../hooks/useDebounce";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import { useCreateInventoryMutation, useDeleteInventoryMutation, useGetInventoryListQuery, useUpdateInventoryMutation } from "../../services/stocks.service";
import { cleanObject } from "../../lib/helper";
import { handleApiError } from "../../lib/errorHandler";

export const ManageStocks = () => {
  // ============================================
  // State Management
  // ============================================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "sellingPrice" | "availableQuantity">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { user } = useSelector((state: RootState) => state.auth);
  const shopId = user?.shopId || "";

  // Debounced search for backend query
  const debouncedSearch = useDebounce(searchTerm, 500);

  // ============================================
  // RTK Query Hooks
  // ============================================
  const {
    data: inventoryResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetInventoryListQuery(
    {
      shopId,
      search: debouncedSearch || undefined,
      page,
      limit: pageSize,
      sortBy,
      sortOrder,
    },
    {
      skip: !shopId,
    }
  );

  const [createInventory, { isLoading: isCreating }] = useCreateInventoryMutation();
  const [updateInventory, { isLoading: isUpdating }] = useUpdateInventoryMutation();
  const [deleteInventory, { isLoading: isDeleting }] = useDeleteInventoryMutation();

  // ============================================
  // Data Transformation
  // ============================================
  const goods = useMemo(() => {
    if (!inventoryResponse?.data?.items) return [];

    return inventoryResponse.data.items.map((item) => ({
      id: item._id,
      product: item.name,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      quantity: item.availableQuantity,
      category: item.category,
      sku: item.sku,
      unit: item.unit,
      isLowStock: item.isLowStock,
      isOutOfStock: item.isOutOfStock,
      reorderLevel: item.reorderLevel,
    }));
  }, [inventoryResponse]);

  const pagination = useMemo(() => ({
    total: inventoryResponse?.data?.total || 0,
    page: inventoryResponse?.data?.page || 1,
    pages: inventoryResponse?.data?.pages || 1,
  }), [inventoryResponse]);

  // ============================================
  // Event Handlers
  // ============================================
  const handleAddGoods = async (rawFormDate: GoodsFormData) => {
    const formData = cleanObject(rawFormDate)
    console.log("Hwllo")
    console.log(formData)
    try {
      if (editingItemId) {
        // Update existing item
        await updateInventory({
          shopId,
          itemId: editingItemId,
          name: formData.productName,
          category: formData.category || "General",
          costPrice: formData.costPrice,
          sellingPrice: formData.sellingPrice,
          minSellingPrice: formData.minSellingPrice,
          unit: formData.measurement,
          initialQuantity: formData.quantity,
          availableQuantity: formData.quantity,
          reorderLevel: formData.reorderLevel,
          description: formData.description,
          barcode: formData.barcode,
          supplier: formData.supplier,
        }).unwrap();

        toast.success("Item updated successfully!");
      } else {
        // Create new item
        await createInventory({
          shopId,
          name: formData.productName,
          category: formData.category || "General",
          costPrice: formData.costPrice,
          sellingPrice: formData.sellingPrice,
          minSellingPrice: formData.minSellingPrice,
          initialQuantity: formData.quantity,
          unit: formData.measurement,
          reorderLevel: formData.reorderLevel,
          description: formData.description,
          barcode: formData.barcode,
          supplier: formData.supplier,
        }).unwrap();

        toast.success("Item added successfully!");
      }

      setIsAddModalOpen(false);
      setEditingItemId(null);
    } catch (error: any) {
      handleApiError(error)
    }
  };

  const handleEdit = (id: string) => {
    setEditingItemId(id);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingItemId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItemId) return;

    try {
      await deleteInventory({
        shopId,
        itemId: deletingItemId,
      }).unwrap();

      toast.success("Item deleted successfully!");
      setDeletingItemId(null);
    } catch (error: any) {
      handleApiError(error)
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1); // Reset to first page on sort
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on search
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingItemId(null);
  };

  // Get initial data for edit mode
  const getInitialData = () => {
    if (!editingItemId || !inventoryResponse?.data?.items) return undefined;

    const item = inventoryResponse.data.items.find((i) => i._id === editingItemId);
    if (!item) return undefined;

    return {
      id: item._id,
      product: item.name,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      minSellingPrice: item.minSellingPrice,
      quantity: item.availableQuantity,
      measurement: item.unit,
      category: item.category,
      reorderLevel: item.reorderLevel,
      description: item.description,
      barcode: item.barcode,
      supplier: item.supplier,
    };
  };

  // ============================================
  // Loading State
  // ============================================
  if (isLoading && !inventoryResponse) {
    return <LoadingState text="Loading inventory..." size="lg" />;
  }

  // ============================================
  // Error State
  // ============================================
  if (isError && !inventoryResponse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorState
          errorCode="500"
          message={
            (error as any)?.data?.message ||
            (error as any)?.message ||
            "Failed to load inventory data."
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
      <article className="mb-6">
        <h1 className="h4 md:text-3xl text-secondary mb-2">Goods Management</h1>
        <p className="text-gray-600">
          Easily track and manage your shop items
        </p>
      </article>

      {/* Error Banner (when data exists but refresh fails) */}
      {isError && inventoryResponse && (
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

      {/* Goods Table */}
      <GoodsTable
        goods={goods}
        isLoading={isFetching && !inventoryResponse}
        pagination={pagination}
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onAddNew={() => setIsAddModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onSort={handleSort}
      />

      {/* Add/Edit Modal */}
      <AddGoodsModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAddGoods}
        initialData={getInitialData()}
        isEditMode={!!editingItemId}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingItemId}
        onClose={() => setDeletingItemId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        itemName={
          goods.find((g) => g.id === deletingItemId)?.product || "this item"
        }
      />
    </section>
  );
};