import { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { toast } from "sonner"

export default function RecordSale() {
  const [goods, setGoods] = useState<
    { name: string; quantity: string; price: number }[]
  >([]);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
    // Remove commas and parse
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
      toast.error("Please make sure every item has a quantity and price greater than 0.");
      return;
    }

    toast.success("Sale Recorded Successfully!");
  };

  const total = goods.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    return sum + qty * item.price;
  }, 0);

  return (
    <section className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="h4 font-semibold text-[var(--color-secondary)]">
          Sale 000001
        </h2>
      </div>

      {/* Input for adding goods */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-full max-w-md">
          <label className="block link-small text-[var(--color-black)] mb-2">Name of Good</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Put the name of good"
              className="grow bg-[var(--color-white)] body-small border border-[var(--color-secondary-4)] rounded-md px-3 py-3 password-small focus:ring-2 focus:ring-[var(--color-tertiary)] outline-none"
            />
            <button
              onClick={handleAdd}
              className="btn btn-primary body px-8 rounded-md border active:border-[var(--color-tertiary)] transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* List of Goods */}
      <main className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="h4 text-[var(--color-secondary)]">List of Goods</h3>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
              <Edit2 size={18} className="text-gray-600 hover:text-gray-800" />
            </button>
          ) : (
            <button onClick={() => setIsEditing(false)}>
              <Check size={20} className="text-green-600 hover:text-green-700" />
            </button>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-md overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-white)]">
              <tr>
                <th className="px-6 py-3 body-bold text-[var(--color-secondary)] min-w-[180px]">
                  Name
                </th>
                <th className="px-6 py-3 body-bold text-[var(--color-secondary)] min-w-[180px]">
                  Quantity
                </th>
                <th className="px-6 py-3 body-bold text-[var(--color-secondary)] min-w-[180px]">
                  Price
                </th>
                {isEditing && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody className="bg-white">
              {goods.length === 0 ? (
                <tr>
                  <td
                    colSpan={isEditing ? 4 : 3}
                    className="text-center py-8 text-gray-400 text-sm"
                  >
                    No items added yet
                  </td>
                </tr>
              ) : (
                goods.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--color-secondary-4)] hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 body text-[var(--color-black)] whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          placeholder=""
                          className="w-full border border-[var(--color-secondary-3)] text-[var(--color-black)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      ) : (
                        <span className="body-small text-gray-700">{item.quantity || "0"}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={formatPrice(item.price)}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          placeholder=""
                          className="w-full border border-[var(--color-secondary-4)] text-[var(--color-black)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      ) : (
                        <span className="body-small text-gray-700">₦{item.price.toLocaleString()}</span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} className="border border-red-500 rounded-full p-0.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {goods.length === 0 ? (
            <p className="text-center py-8 text-gray-400 text-sm">No items added yet</p>
          ) : (
            goods.map((item, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-medium text-[var(--color-black)]">{item.name}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500"
                    >
                      <X size={20} className="border-2 border-red-500 rounded-full p-0.5" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        placeholder=""
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    ) : (
                      <span className="text-sm text-[var(--color-black)]">{item.quantity || "0"}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Price</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formatPrice(item.price)}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        placeholder=""
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">₦{item.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Total */}
      <div className="flex items-center justify-between py-4">
        <p className="body text-[var(--color-secondary)]">TOTAL</p>
        <p className="h4 text-[var(--color-secondary)]">₦{total.toLocaleString()}</p>
      </div>

      {/* Record Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleRecord}
          className="btn btn-primary px-19 rounded-md font-medium border active:border-[var(--color-tertiary)] transition text-sm"
        >
          Record
        </button>
      </div>
    </section>
  );
}