// ============================================
// AddGoodsModal.tsx - Fixed Version
// ============================================
import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import TextInput from "../../../components/ui/textInput";
import SelectInput from "../../../components/ui/selectInput";

interface AddGoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoodsFormData) => Promise<void>;
  initialData?: {
    id: string;
    product: string;
    costPrice: number;
    sellingPrice: number;
    minSellingPrice?: number;
    quantity?: number;
    measurement?: string;
    category?: string;
    reorderLevel?: number;
    description?: string;
    barcode?: string;
    supplier?: {
      name?: string;
      contact?: string;
      email?: string;
    };
  };
  isEditMode?: boolean;
  isLoading?: boolean;
}

export interface GoodsFormData {
  productName: string;
  quantity: number;
  measurement: string;
  costPrice: number;
  sellingPrice: number;
  minSellingPrice?: number;
  category?: string;
  reorderLevel?: number;
  description?: string;
  barcode?: string;
  supplier?: {
    name?: string;
    contact?: string;
    email?: string;
  };
}

const measurementOptions = [
  { value: "pieces", label: "Pieces" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "liters", label: "Liters" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "boxes", label: "Boxes" },
  { value: "packs", label: "Packs" },
  { value: "dozens", label: "Dozens" },
  { value: "cartons", label: "Cartons" },
  { value: "bags", label: "Bags" },
  { value: "bottles", label: "Bottles" },
  { value: "cans", label: "Cans" },
  { value: "meters", label: "Meters" },
  { value: "cm", label: "Centimeters (cm)" },
];

const categoryOptions = [
  { value: "General", label: "General" },
  { value: "Beverages", label: "Beverages" },
  { value: "Food", label: "Food & Groceries" },
  { value: "Electronics", label: "Electronics" },
  { value: "Household", label: "Household Items" },
  { value: "Personal Care", label: "Personal Care" },
  { value: "Stationery", label: "Stationery" },
  { value: "Clothing", label: "Clothing" },
  { value: "Other", label: "Other" },
];

const getInitialFormData = (): GoodsFormData => ({
  productName: "",
  quantity: 0,
  measurement: "pieces",
  costPrice: 0,
  sellingPrice: 0,
  minSellingPrice: undefined,
  category: "General",
  reorderLevel: 10,
  description: "",
  barcode: "",
  supplier: {
    name: "",
    contact: "",
    email: "",
  },
});

export const AddGoodsModal: React.FC<AddGoodsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<GoodsFormData>(getInitialFormData());
  const [showAdvanced, setShowAdvanced] = useState(false);

  // FIX 1: Populate form with initial data when in edit mode
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setFormData({
          productName: initialData.product,
          quantity: initialData.quantity ?? 0,
          measurement: initialData.measurement || "pieces",
          costPrice: initialData.costPrice,
          sellingPrice: initialData.sellingPrice,
          minSellingPrice: initialData.minSellingPrice,
          category: initialData.category || "General",
          reorderLevel: initialData.reorderLevel ?? 10,
          description: initialData.description || "",
          barcode: initialData.barcode || "",
          supplier: initialData.supplier || { name: "", contact: "", email: "" },
        });
        
        // Show advanced if any advanced field has data
        if (
          initialData.description ||
          initialData.barcode ||
          initialData.supplier?.name
        ) {
          setShowAdvanced(true);
        }
      } else {
        // Reset form when opening in add mode
        setFormData(getInitialFormData());
        setShowAdvanced(false);
      }
    }
  }, [isOpen, isEditMode, initialData]);

  const handleInputChange = useCallback(
    (field: keyof GoodsFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSupplierChange = useCallback(
    (field: "name" | "contact" | "email", value: string) => {
      setFormData((prev) => ({
        ...prev,
        supplier: {
          ...prev.supplier,
          [field]: value,
        },
      }));
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    if (!formData.productName.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!isEditMode && formData.quantity < 0) {
      toast.error("Quantity cannot be negative");
      return false;
    }

    if (!formData.measurement) {
      toast.error("Please select a measurement unit");
      return false;
    }

    if (formData.costPrice < 0) {
      toast.error("Cost price cannot be negative");
      return false;
    }

    if (formData.sellingPrice <= 0) {
      toast.error("Selling price must be greater than 0");
      return false;
    }

    if (formData.sellingPrice < formData.costPrice) {
      const confirm = window.confirm(
        "Selling price is less than cost price. This will result in a loss. Continue?"
      );
      if (!confirm) return false;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }

    return true;
  }, [formData, isEditMode]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        await onSubmit(formData);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [formData, validateForm, onSubmit]
  );

  const handleClose = useCallback(() => {
    if (isLoading) return;
    onClose();
  }, [isLoading, onClose]);

  if (!isOpen) return null;

  const profit = (formData.sellingPrice - formData.costPrice) * formData.quantity;
  const profitPerUnit = formData.sellingPrice - formData.costPrice;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-bg" onClick={handleClose}>

      {/* Modal */}
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[550px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
            <h2 className="h6 font-semibold text-gray-900">
              {isEditMode ? "Edit Item" : "Add New Item"}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Product Name */}
            <TextInput
              label="Product Name"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={(e: any) =>
                handleInputChange("productName", e.target.value)
              }
              required
              disabled={isLoading}
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-error">*</span>
              </label>
              <SelectInput
                name="category"
                placeholder="Select category"
                options={categoryOptions}
                value={formData.category || ""}
                onChange={(e: any) =>
                  handleInputChange("category", e.target.value)
                }
                required
                disabled={isLoading}
              />
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              {/* FIX 2: Allow quantity to be 0 */}
              <TextInput
                label="Initial Quantity"
                placeholder="Enter quantity"
                type="number"
                value={formData.quantity === 0 ? "0" : formData.quantity || ""}
                onChange={(e: any) => {
                  const val = e.target.value;
                  handleInputChange("quantity", val === "" ? 0 : Number(val));
                }}
                required
                disabled={isLoading}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit <span className="text-error">*</span>
                </label>
                <SelectInput
                  name="unit"
                  placeholder="Select unit"
                  options={measurementOptions}
                  value={formData.measurement}
                  onChange={(e: any) =>
                    handleInputChange("measurement", e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Cost Price and Selling Price */}
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Cost Price"
                placeholder="Purchase price"
                type="number"
                value={formData.costPrice === 0 ? "0" : formData.costPrice || ""}
                onChange={(e: any) => {
                  const val = e.target.value;
                  handleInputChange("costPrice", val === "" ? 0 : Number(val));
                }}
                required
                disabled={isLoading}
              />
              <TextInput
                label="Selling Price"
                placeholder="Selling price"
                type="number"
                value={formData.sellingPrice === 0 ? "0" : formData.sellingPrice || ""}
                onChange={(e: any) => {
                  const val = e.target.value;
                  handleInputChange("sellingPrice", val === "" ? 0 : Number(val));
                }}
                required
                disabled={isLoading}
              />
            </div>

            {/* Reorder Level */}
            <div className="gap-4">
              <TextInput
                label="Reorder Level"
                description="Item is marked as low stock when quantity falls below this level."
                placeholder="Min stock alert"
                type="number"
                value={formData.reorderLevel === 0 ? "0" : formData.reorderLevel || ""}
                onChange={(e: any) => {
                  const val = e.target.value;
                  handleInputChange("reorderLevel", val === "" ? 0 : Number(val));
                }}
                disabled={isLoading}
              />
            </div>

            {/* Advanced Options Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary font-medium hover:underline"
            >
              {showAdvanced ? "Hide" : "Show"} advanced options
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 pt-2 border-t border-gray-200">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Product description..."
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                {/* Barcode */}
                <TextInput
                  label="Barcode"
                  placeholder="Product barcode"
                  value={formData.barcode || ""}
                  onChange={(e: any) =>
                    handleInputChange("barcode", e.target.value)
                  }
                  disabled={isLoading}
                />

                {/* Supplier Info */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Supplier Information
                  </p>
                  <TextInput
                    label="Supplier Name"
                    placeholder="Supplier name"
                    value={formData.supplier?.name || ""}
                    onChange={(e: any) =>
                      handleSupplierChange("name", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="Contact"
                      placeholder="Phone number"
                      value={formData.supplier?.contact || ""}
                      onChange={(e: any) =>
                        handleSupplierChange("contact", e.target.value)
                      }
                      disabled={isLoading}
                    />
                    <TextInput
                      label="Email"
                      placeholder="Email"
                      type="email"
                      value={formData.supplier?.email || ""}
                      onChange={(e: any) =>
                        handleSupplierChange("email", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profit Preview */}
            {formData.costPrice > 0 && formData.sellingPrice > 0 && (
              <div className="p-3 bg-primary-5 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Profit per unit:</span>{" "}
                  <span
                    className={`font-semibold ${
                      profitPerUnit < 0 ? "text-error" : "text-success"
                    }`}
                  >
                    ₦{profitPerUnit.toLocaleString()}
                  </span>
                </p>
                {formData.quantity > 0 && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Total expected profit:</span>{" "}
                    <span
                      className={`font-semibold ${
                        profit < 0 ? "text-error" : "text-success"
                      }`}
                    >
                      ₦{profit.toLocaleString()}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 btn btn-tertiary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn btn-primary"
                disabled={isLoading}
              >
                {isLoading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update Item"
                  : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};