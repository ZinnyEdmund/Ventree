import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useRecordCreditMutation } from "../../../services/sales.service"; // Update this path
import type { SaleTicket, RecordCreditPaymentDTO } from "../../../types/general"; // Update this path

interface RecordCreditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SaleTicket;
  shopId: string;
  currentUserId: string; // The staff ID of the person recording the payment
}

export const RecordCreditPaymentModal: React.FC<RecordCreditPaymentModalProps> = ({
  isOpen,
  onClose,
  ticket,
  shopId,
  currentUserId,
}) => {
  const [recordCredit, { isLoading }] = useRecordCreditMutation();
  
  const [formData] = useState<RecordCreditPaymentDTO>({
    amount: ticket.amountOwed,
    paymentMethod: "cash",
    receivedBy: currentUserId,
    transactionReference: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await recordCredit({
        shopId,
        ticketId: ticket._id,
        ...formData,
      }).unwrap();
      
      onClose();
      // Optionally show success message
    } catch (error) {
      console.error("Failed to record payment:", error);
      // Optionally show error message
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-bg z-50 flex items-center justify-center p-4"
        onClick={onClose} // Clicking backdrop closes modal
      >

      {/* Modal */}
      <div 
          className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()} // Prevent modal content clicks from closing
        >
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {ticket.ticketNumber}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="mdi:close" width="24" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Customer Info */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">{ticket.soldByName || "N/A"}</span>
              <span className="font-medium text-gray-900">
                {"08123456789"}
              </span>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-700">Name</div>
                  <div className="text-sm font-semibold text-gray-700 text-center">
                    Quantity
                  </div>
                  <div className="text-sm font-semibold text-gray-700 text-right">
                    Price
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {ticket.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-sm text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-900 text-center">
                        {item.quantitySold}
                      </div>
                      <div className="text-sm text-gray-900 text-right">
                        {formatCurrency(item.sellingPrice * item.quantitySold)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="p-4 border-t-2 border-gray-300 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">TOTAL</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(ticket.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Owed Display */}
              {/* <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-amber-800">
                    Amount Owed
                  </span>
                  <span className="text-lg font-bold text-amber-900">
                    {formatCurrency(ticket.amountOwed)}
                  </span>
                </div>
              </div> */}

              {/* Amount Input */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  max={ticket.amountOwed}
                  min={0}
                  step="0.01"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div> */}

              {/* Payment Method */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                {/* <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "cash" })
                    }
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.paymentMethod === "cash"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "transfer" })
                    }
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.paymentMethod === "transfer"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Transfer
                  </button>
                </div> */}
                <div className="border p-4 rounded-lg border-secondary-5">
                    <p>{ticket.paymentMethod}</p>

                </div>
              </div>

              {/* Transaction Reference (for Transfer) */}
              {/* {formData.paymentMethod === "transfer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.transactionReference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionReference: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter reference number"
                  />
                </div>
              )} */}

              {/* Notes */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add any additional notes"
                />
              </div> */}

              {/* Sale Info */}
              <div className="flex justify-between items-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                <span>Sold by {ticket.soldByName}</span>
                <span>{new Date(ticket.date).toLocaleDateString()}</span>
              </div>

              {/* Submit Button */}
              {ticket.paymentMethod === "credit" && ticket.creditStatus === "pending" && (
                <button
                type="submit"
                // disabled={isLoading || formData.amount <= 0}
                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Icon icon="mdi:loading" className="animate-spin" width="20" />
                    Moving to Sales...
                  </>
                ) : (
                  "Paid"
                )}
              </button>
              )}
              
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};