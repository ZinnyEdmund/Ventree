import { useState, useCallback, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";
import { useCreateSalesMutation } from "../../services/sales.service"; // Adjust path as needed
import type { RootState } from "../../state/store"; // Adjust path as needed
import { handleApiError } from "../../lib/errorHandler";
import { useFetchInventoryQuery } from "../../services/stocks.service";
import { PaymentMethodOptions, type InventoryData, type Stocks } from "../../types/general";
import TextInput from "../../components/ui/textInput";

interface Good {
  itemId: string;
  name: string;
  quantity: string;
  price: number;
  costPrice: number;
  category: string;
  availableStock?: number;
}

interface PaymentMethodMap {
  label: string;
  value: PaymentMethodOptions;
}

const PAYMENT_METHODS: PaymentMethodMap[] = [
  { label: "Cash", value: PaymentMethodOptions.cash },
  { label: "Credit", value: PaymentMethodOptions.card },
  { label: "Transfer", value: PaymentMethodOptions.bankTransfer },
];

export default function RecordSale() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOptions | "">(PaymentMethodOptions.cash);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get shopId and user info from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const shopId = user?.shopId || "";
  const soldBy = user?.userId || "";
  const soldByName = user?.userName || "";

  // Fetch inventory
  const {
    data: inventoryResponse,
    isLoading: isLoadingInventory,
    isError: isInventoryError,
    error: inventoryError,
  } = useFetchInventoryQuery(shopId);

  // Create sales mutation
  const [createSales, { isLoading: isCreatingSale }] = useCreateSalesMutation();

  // Extract inventory items
  const inventoryItems: InventoryData = useMemo(() => {
    return (
      inventoryResponse?.data || { items: [], total: 0, page: 1, pages: 1 }
    );
  }, [inventoryResponse]);

  // Filter inventory based on search
  const filteredInventory = useMemo(() => {
    if (!searchTerm.trim()) return inventoryItems.items;
    const search = searchTerm.toLowerCase();
    return inventoryItems.items.filter((item) =>
      item.name.toLowerCase().includes(search)
    );
  }, [inventoryItems, searchTerm]);

  // Handle inventory error
  useEffect(() => {
    if (isInventoryError && inventoryError) {
      handleApiError(inventoryError);
    }
  }, [isInventoryError, inventoryError]);

  const handleSelectItem = useCallback(
    (item: Stocks) => {
      // Check if item already exists in goods
      const existingItem = goods.find((good) => good.itemId === item._id);
      if (existingItem) {
        toast.error(`${item.name} is already added to the list.`);
        return;
      }

      const newGood: Good = {
        itemId: item._id,
        name: item.name,
        quantity: "",
        price: item.sellingPrice,
        costPrice: item.costPrice,
        category: item.category,
        availableStock: item.availableQuantity,
      };

      setGoods((prev) => [...prev, newGood]);
      setSearchTerm("");
      setName("");
      setShowDropdown(false);

      if (goods.length === 0) setIsEditing(true);
    },
    [goods]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setName(value);
    setShowDropdown(value.trim().length > 0);
  }, []);

  const handleDelete = useCallback((index: number) => {
    setGoods((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleQuantityChange = useCallback((index: number, value: string) => {
    const cleanValue = value.replace(/,/g, "");
    const num = parseFloat(cleanValue);

    // Validate quantity
    if (value !== "" && (isNaN(num) || num <= 0)) {
      toast.error("Quantity must be a positive number.");
      return;
    }

    setGoods((prev) => {
      const updated = [...prev];
      const item = updated[index];

      // Check if quantity exceeds available stock
      if (item.availableStock && num > item.availableStock) {
        toast.error(
          `Only ${item.availableStock} units available for ${item.name}.`
        );
        return prev;
      }

      updated[index].quantity = value;
      return updated;
    });
  }, []);

  const handlePriceChange = useCallback((index: number, value: string) => {
    const cleanValue = value.replace(/,/g, "");
    const num = Number(cleanValue);

    if (value !== "" && (isNaN(num) || num < 0)) {
      toast.error("Price must be a positive number.");
      return;
    }

    setGoods((prev) => {
      const updated = [...prev];
      updated[index].price = value === "" ? 0 : num;
      return updated;
    });
  }, []);

  const formatPrice = useCallback((price: number) => {
    if (price === 0) return "";
    return price.toLocaleString();
  }, []);

  const handleRecord = useCallback(async () => {
    if (goods.length === 0) {
      toast.error("Please add at least one item before recording a sale.");
      return;
    }

    const incomplete = goods.some((item) => {
      const qty = parseFloat(item.quantity);
      return !item.quantity || isNaN(qty) || qty <= 0 || item.price <= 0;
    });

    if (incomplete) {
      toast.error(
        "Please make sure every item has a quantity and price greater than 0."
      );
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    try {
      // Create sales records for each item
      const salesPromises = goods.map((item) => {
        const qty = parseFloat(item.quantity);
        const totalAmount = qty * item.price;
        const costTotal = qty * item.costPrice;
        const profitAmount = totalAmount - costTotal;
        const profitPercentage =
          costTotal > 0
            ? ((profitAmount / costTotal) * 100).toFixed(2)
            : "0.00";

        return createSales({
          shopId,
          itemId: item.itemId,
          quantity: qty,
          sellingPrice: item.price,
          discount: 0,
          taxAmount: 0,
          // totalAmount,
          // profitAmount,
          profitPercentage,
          soldBy,
          // soldByName,
          paymentMethod,
          // date: new Date().toISOString(),
          // refunded: false,
        }).unwrap();
      });

      await Promise.all(salesPromises);

      toast.success("Sale Recorded Successfully!");

      // Reset form
      setGoods([]);
      setPaymentMethod("");
      setIsEditing(false);
      setName("");
      setSearchTerm("");
    } catch (error) {
      handleApiError(error);
    }
  }, [goods, paymentMethod, shopId, soldBy, soldByName, createSales]);

  const total = goods.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    return sum + qty * item.price;
  }, 0);


  return (
    <section className="flex flex-col w-full py-6 sm:py-8">
      {/* Header */}
      <div className="relative mb-8 sm:mb-6">
        <Link to="/home" className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:inline">
          <Icon
            icon="iconamoon:arrow-left-6-circle-light"
            width="24"
            height="24"
            aria-hidden="true"
          />
        </Link>

        <h2 className="h4 font-semibold text-secondary text-center">
          Sale 0001
        </h2>
      </div>

      {/* Input for searching and adding goods */}

      <div className="mb-8 sm:mb-6 flex flex-col items-center">
        <div className="w-full max-w-md">
          <label
            htmlFor="good-name"
            className="block link-small text-black mb-2"
          >
            Name of Good
          </label>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 px-1 md:px-0">
              <input
                id="good-name"
                type="text"
                value={name}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowDropdown(searchTerm.trim().length > 0)}
                placeholder="Search for a product"
                disabled={isLoadingInventory}
                className="w-full bg-white body-small border border-secondary-4 rounded-md px-3 py-4 pr-10 password-small focus:ring-2 focus:ring-tertiary outline-none"
              />

              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                {isLoadingInventory ? (
                  <LoaderCircle width={20} className="animate-spin" />
                ) : (
                  <Icon
                    icon="ic:outline-arrow-drop-down-circle"
                    width="22"
                    height="22"
                    aria-hidden="true"
                  />
                )}
              </span>

              {/* Dropdown for filtered inventory */}
              {showDropdown && filteredInventory.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-secondary-4 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredInventory.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-secondary-4 last:border-b-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="body-small text-black font-medium">
                            {item.name}
                          </p>
                          <p className="password-small text-subtle-text">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="body-small text-black">
                            ₦{item.sellingPrice.toLocaleString()}
                          </p>
                          <p className="password-small text-subtle-text">
                            Stock: {item.availableQuantity}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showDropdown && searchTerm && filteredInventory.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-secondary-4 rounded-md shadow-lg p-4">
                  <p className="body-small text-subtle-text text-center">
                    No products found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* List of Goods */}
      <main className="mb-8 sm:mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-3">
          <h3 className="h4 text-secondary">List of Goods</h3>
          {goods.length > 0 && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              aria-label={isEditing ? "Done editing" : "Edit goods"}
            >
              <Icon
                icon={isEditing ? "ic:outline-done" : "ic:outline-edit"}
                width="24"
                height="24"
              />
            </button>
          )}
        </div>

        <div className="rounded-md overflow-hidden bg-white px-4 border border-secondary-5">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white">
              <tr>
                <th className="pr-4 py-3 body-bold text-secondary">
                  Name
                </th>
                <th className="px-2 sm:px-6 py-3 body-bold text-secondary">
                  Quantity
                </th>
                <th className="px-2 sm:px-6 py-3 body-bold text-secondary">
                  Price
                </th>
                {isEditing && <th className="px-1 sm:px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody className="bg-white">
              {goods.length === 0 ? (
                <tr>
                  <td
                    colSpan={isEditing ? 4 : 3}
                    className="text-center py-8 text-subtle-text body-small"
                  >
                    No items added yet
                  </td>
                </tr>
              ) : (
                goods.map((item, index) => (
                  <tr
                    key={`${item.itemId}-${index}`}
                    className="border-b last:border-none border-secondary-4 hover:bg-gray-50  transition"
                  >
                    <td className="pr-4 py-5 sm:py-4">
                      <div className="max-w-[120px] sm:max-w-none">
                        <p className="body text-black truncate">{item.name}</p>
                        {item.availableStock !== undefined && (
                          <p className="password-small text-subtle-text">
                            Available: {item.availableStock}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-5 sm:py-4">
                      {isEditing ? (
                        <TextInput
                          type="text"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          placeholder="0"
                          aria-label={`Quantity for ${item.name}`}
                        />
                      ) : (
                        <span className="body-small text-black">
                          {item.quantity || "0"}
                        </span>
                      )}
                    </td>
                    <td className="px-2 sm:px-6 py-4">
                      {isEditing ? (
                        <TextInput
                          type="text"
                          value={formatPrice(item.price)}
                          onChange={(e) =>
                            handlePriceChange(index, e.target.value)
                          }
                          placeholder="0"
                          aria-label={`Price for ${item.name}`}
                        />
                      ) : (
                        <span className="body-small text-black">
                          ₦{item.price.toLocaleString()}
                        </span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="px-1 sm:px-6 py-4">
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-error hover:text-red-700"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Icon
                            icon="ion:remove-circle-outline"
                            width="24"
                            height="24"
                          />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex items-center justify-between mt-5 py-6 sm:py-4 border-t border-secondary-4">
            <p className="body text-secondary">TOTAL</p>
            <p className="h4 text-secondary">₦{total.toLocaleString()}</p>
          </div>
        </div>
      </main>

      {/* Payment Method */}
      <div className="mt-6 sm:mt-4 mb-8">
        <h3 className="h4 text-secondary mb-4">Payment Method</h3>
        <div className="flex items-center gap-3 sm:gap-4 px-4 py-6 border border-secondary-5 rounded-md bg-white">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.value}
              className="flex items-center w-1/3 cursor-pointer gap-2"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethodOptions)
                }
                className="hidden"
              />

              <div
                className={`
                  w-5 h-5
                  flex items-center justify-center
                  rounded-sm
                  border border-success hover:bg-primary-1
                  transition
                  ${paymentMethod === method.value ? "bg-success" : "bg-transparent"}
                `}
              >
                {paymentMethod === method.value && (
                  <span className="text-white">
                    <Icon
                      icon="stash:check-solid"
                      width="24"
                      height="24"
                      aria-hidden="true"
                    />
                  </span>
                )}
              </div>

              <span className="body-small text-black">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Record Button */}
      <div className="flex justify-center mb-5">
        <button
          onClick={handleRecord}
          disabled={isCreatingSale || goods.length === 0}
          className="btn btn-primary w-full sm:w-[50%] rounded-md font-medium border active:border-tertiary transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingSale ? "Recording..." : "Record Sale"}
          {isCreatingSale && (
            <LoaderCircle width={20} className="animate-spin" />
          )}
        </button>
      </div>
    </section>
  );
}
