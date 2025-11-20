// ============================================
// AddGoodsModal.tsx - Updated with Stocks fields
// ============================================
import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import TextInput from "../../../components/ui/textInput";
import SelectInput from "../../../components/ui/selectInput";
import { toast } from "sonner";

interface AddGoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoodsFormData) => Promise<void>;
  initialData?: {
    id: string;
    product: string;
    costPrice: number;
    sellingPrice: number;
    quantity?: number;
    measurement?: string;
    category?: string;
    reorderLevel?: number;
  };
  isEditMode?: boolean;
}

export interface GoodsFormData {
  productName: string;
  quantity: number;
  measurement: string;
  costPrice: number;
  sellingPrice: number;
  category?: string;
  reorderLevel?: number;
}

export const AddGoodsModal: React.FC<AddGoodsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState<GoodsFormData>({
    productName: "",
    quantity: 0,
    measurement: "",
    costPrice: 0,
    sellingPrice: 0,
    category: "",
    reorderLevel: 10,
  });

  const [loading, setLoading] = useState(false);

  // Populate form with initial data when in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        productName: initialData.product,
        quantity: initialData.quantity || 0,
        measurement: initialData.measurement || "pieces",
        costPrice: initialData.costPrice,
        sellingPrice: initialData.sellingPrice,
        category: initialData.category || "",
        reorderLevel: initialData.reorderLevel || 10,
      });
    } else if (!isEditMode) {
      // Reset form when not in edit mode
      setFormData({
        productName: "",
        quantity: 0,
        measurement: "",
        costPrice: 0,
        sellingPrice: 0,
        category: "",
        reorderLevel: 10,
      });
    }
  }, [isEditMode, initialData, isOpen]);

  // Measurement/Unit options
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

  // Category options
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

  const handleInputChange = useCallback(
    (field: keyof GoodsFormData, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    if (!formData.productName.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (formData.quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return false;
    }
    if (!formData.measurement) {
      toast.error("Please select a measurement unit");
      return false;
    }
    if (formData.costPrice <= 0) {
      toast.error("Cost price must be greater than 0");
      return false;
    }
    if (formData.sellingPrice <= 0) {
      toast.error("Selling price must be greater than 0");
      return false;
    }
    if (formData.sellingPrice < formData.costPrice) {
      toast.error(
        "Selling price should be greater than or equal to cost price"
      );
      return false;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    if (formData.reorderLevel && formData.reorderLevel < 0) {
      toast.error("Reorder level cannot be negative");
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setLoading(true);
      try {
        await onSubmit(formData);

        // Reset form only if not in edit mode
        if (!isEditMode) {
          setFormData({
            productName: "",
            quantity: 0,
            measurement: "",
            costPrice: 0,
            sellingPrice: 0,
            category: "",
            reorderLevel: 10,
          });
        }

        onClose();
      } catch (error: any) {
        // Error is handled by parent component
        console.error("Form submission error:", error);
      } finally {
        setLoading(false);
      }
    },
    [formData, validateForm, onSubmit, onClose, isEditMode]
  );

  const handleClose = useCallback(() => {
    if (loading) return; // Prevent closing while submitting
    setFormData({
      productName: "",
      quantity: 0,
      measurement: "",
      costPrice: 0,
      sellingPrice: 0,
      category: "",
      reorderLevel: 10,
    });
    onClose();
  }, [loading, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-b" onClick={handleClose} />

      {/* Modal */}
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[450px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="h6 font-semibold text-gray-900">
              {isEditMode ? "Edit Goods" : "Add New Goods"}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
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
              disabled={loading}
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <SelectInput
                name="Category"
                placeholder="Select category"
                options={categoryOptions}
                value={formData.category || ""}
                onChange={(e: any) =>
                  handleInputChange("category", e.target.value)
                }
                required
              />
            </div>

            {/* Quantity and Unit in a row */}
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Quantity"
                placeholder="Enter quantity"
                type="number"
                value={formData.quantity || ""}
                onChange={(e: any) =>
                  handleInputChange("quantity", Number(e.target.value))
                }
                required
                disabled={loading}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <SelectInput
                  name="Unit"
                  placeholder="Select unit"
                  options={measurementOptions}
                  value={formData.measurement}
                  onChange={(e: any) =>
                    handleInputChange("measurement", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Cost Price and Selling Price in a row */}
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Cost Price"
                placeholder="Purchase price"
                type="number"
                value={formData.costPrice || ""}
                onChange={(e: any) =>
                  handleInputChange("costPrice", Number(e.target.value))
                }
                required
                disabled={loading}
              />

              <TextInput
                label="Selling Price"
                placeholder="Selling price"
                type="number"
                value={formData.sellingPrice || ""}
                onChange={(e: any) =>
                  handleInputChange("sellingPrice", Number(e.target.value))
                }
                required
                disabled={loading}
              />
            </div>

            {/* Reorder Level */}
            <TextInput
              label="Reorder Level"
              placeholder="Minimum stock quantity"
              type="number"
              value={formData.reorderLevel || ""}
              onChange={(e: any) =>
                handleInputChange("reorderLevel", Number(e.target.value))
              }
              disabled={loading}
            />

            <p className="text-xs text-gray-500">
              You'll be notified when stock falls below this level
            </p>

            {/* Profit Preview */}
            {formData.costPrice > 0 && formData.sellingPrice > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Profit per unit:</span>{" "}
                  <span className="text-green-600 font-semibold">
                    ₦{(formData.sellingPrice - formData.costPrice).toLocaleString()}
                  </span>
                </p>
                {formData.quantity > 0 && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Total expected profit:</span>{" "}
                    <span className="text-green-600 font-semibold">
                      ₦{((formData.sellingPrice - formData.costPrice) * formData.quantity).toLocaleString()}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update Goods"
                  : "Save Goods"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};