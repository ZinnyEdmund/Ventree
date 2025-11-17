import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

export default function RecordSale() {
  const [goods, setGoods] = useState<
    { name: string; quantity: string; price: number }[]
  >([]);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handleAdd = () => {
    if (!name.trim()) {
      toast.error("Please enter the name of the good.");
      return;
    }

    const newGood = { name: name.trim(), quantity: "", price: 0 };
    setGoods([...goods, newGood]);
    setName("");

    if (goods.length === 0) setIsEditing(true);
  };

  const handleDelete = (index: number) => {
    setGoods(goods.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, value: string) => {
    const updated = [...goods];
    updated[index].quantity = value;
    setGoods(updated);
  };

  const handlePriceChange = (index: number, value: string) => {
    const cleanValue = value.replace(/,/g, "");
    const num = Number(cleanValue);

    if (value !== "" && (isNaN(num) || num < 0)) {
      toast.error("Price must be a positive number.");
      return;
    }

    const updated = [...goods];
    updated[index].price = value === "" ? 0 : num;
    setGoods(updated);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "";
    return price.toLocaleString();
  };

  const handleRecord = () => {
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

    toast.success("Sale Recorded Successfully!");
    // Reset form after successful recording
    setGoods([]);
    setPaymentMethod("");
    setIsEditing(false);
    setName("");
  };

  const total = goods.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    return sum + qty * item.price;
  }, 0);

  return (
    <section className="flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="relative mb-8 sm:mb-6">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:inline">
          <Icon
            icon="iconamoon:arrow-left-6-circle-light"
            width="24"
            height="24"
          />
        </span>

        <h2 className="h4 font-semibold text-secondary text-center">
          Sale 000001
        </h2>
      </div>

      {/* Input for adding goods */}
      <div className="mb-8 sm:mb-6 flex flex-col items-center">
        <div className="w-full max-w-md">
          <label className="block link-small text-black mb-2">
            Name of Good
          </label>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Put the name of good"
                className="w-full bg-white body-small border border-secondary-4 rounded-md px-3 py-4 pr-10 password-small focus:ring-2 focus:ring-tertiary outline-none"
              />

              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Icon
                  icon="ic:outline-arrow-drop-down-circle"
                  width="22"
                  height="22"
                />
              </span>
            </div>

            <button
              onClick={handleAdd}
              className="btn btn-primary body px-4 sm:px-8 rounded-md border active:border-tertiary transition flex items-center justify-center gap-2"
            >
              <span className="block sm:hidden">
                <Icon icon="ic:outline-add" width="24" height="24" />
              </span>
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* List of Goods */}
      <main className="mb-8 sm:mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-3">
          <h3 className="h4 text-secondary">List of Goods</h3>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
              <Icon icon="ic:outline-edit" width="24" height="24" />
            </button>
          ) : (
            <button onClick={() => setIsEditing(false)}>
              <Icon icon="ic:outline-done" width="24" height="24" />
            </button>
          )}
        </div>

        <div className="rounded-md overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white">
              <tr>
                <th className="px-2 sm:px-6 py-3 body-bold text-secondary">
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
                    key={index}
                    className="border-b border-secondary-4 hover:bg-gray-50 transition"
                  >
                    <td className="px-2 sm:px-6 py-5 sm:py-4 body text-black">
                      <div className="max-w-[120px] sm:max-w-none truncate">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-5 sm:py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          placeholder=""
                          className="w-full border border-secondary-3 text-black rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      ) : (
                        <span className="body-small text-black">
                          {item.quantity || "0"}
                        </span>
                      )}
                    </td>
                    <td className="px-2 sm:px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={formatPrice(item.price)}
                          onChange={(e) =>
                            handlePriceChange(index, e.target.value)
                          }
                          placeholder=""
                          className="w-full border border-secondary-3 text-black rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
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
        </div>
      </main>

      {/* Total */}
      <div className="flex items-center justify-between py-6 sm:py-4 border-t border-secondary-4">
        <p className="body text-secondary">TOTAL</p>
        <p className="h4 text-secondary">₦{total.toLocaleString()}</p>
      </div>

      {/* Payment Method */}
      <div className="mt-6 sm:mt-4 mb-8">
        <h3 className="h4 text-secondary mb-4">Payment Method</h3>
        <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 py-6 border border-accent-g2 rounded-md bg-white">
          {["Credit", "Cash", "Transfer"].map((method) => (
            <label
              key={method}
              className={`flex items-center justify-center gap-2 cursor-pointer transition ${
                paymentMethod === method
              }`}
            >
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />

                <div
                  className={`
      w-5 h-5
      flex items-center justify-center
      rounded-sm
      border border-accent-g3 hover:bg-accent-g4
      ${paymentMethod === method ? "bg-success" : "bg-transparent"}
    `}
                >
                  {paymentMethod === method && (
                    <span className="text-white">
                      <Icon icon="stash:check-solid" width="24" height="24" />
                    </span>
                  )}
                </div>

                <span>{method}</span>
              </label>

              <span className="body text-black">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Record Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRecord}
          className="btn btn-primary w-full sm:w-[50%] rounded-md font-medium border active:border-tertiary transition text-sm"
        >
          Record
        </button>
      </div>
    </section>
  );
}
