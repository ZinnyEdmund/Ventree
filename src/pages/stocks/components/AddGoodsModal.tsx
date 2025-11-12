// ============================================
// 1. AddGoodsModal.tsx - Reusable Modal Component
// ============================================
import { useState, useCallback } from "react";
import { X } from "lucide-react";
import TextInput from "../../../components/ui/textInput";
import SelectInput from "../../../components/ui/selectInput";
import { toast } from "sonner";

interface AddGoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoodsFormData) => Promise<void>;
}

export interface GoodsFormData {
  productName: string;
  quantity: number;
  measurement: string;
  costPrice: number;
  sellingPrice: number;
}

export const AddGoodsModal: React.FC<AddGoodsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<GoodsFormData>({
    productName: "",
    quantity: 0,
    measurement: "",
    costPrice: 0,
    sellingPrice: 0,
  });

  const [loading, setLoading] = useState(false);

  // Measurement options
  const measurementOptions = [
    { value: "pieces", label: "Pieces" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "g", label: "Grams (g)" },
    { value: "l", label: "Liters (L)" },
    { value: "ml", label: "Milliliters (ml)" },
    { value: "dozen", label: "Dozen" },
    { value: "carton", label: "Carton" },
    { value: "pack", label: "Pack" },
    { value: "bottle", label: "Bottle" },
    { value: "can", label: "Can" },
    { value: "bag", label: "Bag" },
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
    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setLoading(true);
      try {
        await onSubmit(formData);
        toast.success("Goods added successfully!");

        // Reset form
        setFormData({
          productName: "",
          quantity: 0,
          measurement: "",
          costPrice: 0,
          sellingPrice: 0,
        });

        onClose();
      } catch (error: any) {
        toast.error(error?.message || "Failed to add goods");
      } finally {
        setLoading(false);
      }
    },
    [formData, validateForm, onSubmit, onClose]
  );

  const handleClose = useCallback(() => {
    if (loading) return; // Prevent closing while submitting
    setFormData({
      productName: "",
      quantity: 0,
      measurement: "",
      costPrice: 0,
      sellingPrice: 0,
    });
    onClose();
  }, [loading, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-b"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="modal-bg">
        <div
          className="bg-white rounded-lg shadow-xl w-full lg:w-[400px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="h6 font-semibold text-gray-900">Goods List</h2>
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

            {/* Quantity */}
            <TextInput
              label="Quantity"
              placeholder="Enter number of goods"
              type="number"
              value={formData.quantity || ""}
              onChange={(e: any) =>
                handleInputChange("quantity", Number(e.target.value))
              }
              required
              disabled={loading}
            />

            {/* Measurement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Measurement
              </label>
              <SelectInput
                name="Measurement"
                placeholder="Inches, painter, cup"
                options={measurementOptions}
                value={formData.measurement}
                onChange={(e: any) =>
                  handleInputChange("measurement", e.target.value)
                }
                required
                // disabled={loading}
              />
            </div>

            {/* Cost Price */}
            <TextInput
              label="Cost Price"
              placeholder="Enter your price of purchase"
              type="number"
              value={formData.costPrice || ""}
              onChange={(e: any) =>
                handleInputChange("costPrice", Number(e.target.value))
              }
              required
              disabled={loading}
            />

            {/* Selling Price */}
            <TextInput
              label="Selling Price"
              placeholder="Enter selling price"
              type="number"
              value={formData.sellingPrice || ""}
              onChange={(e: any) =>
                handleInputChange("sellingPrice", Number(e.target.value))
              }
              required
              disabled={loading}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Goods"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
