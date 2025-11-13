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
        <div className="modal-bg" onClick={onCancel} />
        <div className="modal-bg">
          <div
            className="bg-white rounded-lg w-full lg:w-1/2 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Remove Salesperson
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <strong>{personName}</strong> from
              your shop? This action cannot be undone.
            </p>
  
            <article className="w-full flex justify-end">
            <div className="flex flex-col w-full md:w-1/2 md:flex-row gap-3 pt-4">
              <button
                onClick={onCancel}
                className="flex-1 btn btn-tertiary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 btn btn-error"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
            </article>
          </div>
        </div>
      </>
    );
  };
  