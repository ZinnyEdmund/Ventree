// ============================================
// 5. DeleteConfirmModal.tsx - Delete Confirmation

import { useState } from "react";
import { toast } from "sonner";

// ============================================

interface DeleteConfirmModalProps {
    personName: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
  }
  
export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    personName,
    onConfirm,
    onCancel,
  }) => {
    const [loading, setLoading] = useState(false);
  
    const handleConfirm = async () => {
      setLoading(true);
      try {
        await onConfirm();
        toast.success("Sales person removed successfully!");
      } catch (error) {
        toast.error("Failed to remove sales person");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onCancel} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Remove Salesperson
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <strong>{personName}</strong> from
              your shop? This action cannot be undone.
            </p>
  
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  