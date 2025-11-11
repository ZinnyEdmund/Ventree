// ============================================
// 2. useAddGoodsModal.ts - Custom Hook for Modal Management
// ============================================
import { useState } from "react";

export const useAddGoodsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
