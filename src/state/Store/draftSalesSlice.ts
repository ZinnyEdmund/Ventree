import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { PaymentMethodOptions } from "../../types/general";

interface DraftGood {
  itemId: string;
  name: string;
  quantity: string;
  price: number;
  costPrice: number;
  category: string;
  availableStock?: number;
}

interface DraftSalesState {
  goods: DraftGood[];
  paymentMethod: PaymentMethodOptions | "";
  isEditing: boolean;
  lastUpdated: string | null;
}

const initialState: DraftSalesState = {
  goods: [],
  paymentMethod: PaymentMethodOptions.cash,
  isEditing: false,
  lastUpdated: null,
};

const draftSalesSlice = createSlice({
  name: "draftSales",
  initialState,
  reducers: {
    addDraftGood: (state, action: PayloadAction<DraftGood>) => {
      const existingIndex = state.goods.findIndex(
        (good) => good.itemId === action.payload.itemId
      );
      
      if (existingIndex === -1) {
        state.goods.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    removeDraftGood: (state, action: PayloadAction<number>) => {
      state.goods.splice(action.payload, 1);
      state.lastUpdated = new Date().toISOString();
    },
    
    updateDraftGoodQuantity: (
      state,
      action: PayloadAction<{ index: number; quantity: string }>
    ) => {
      if (state.goods[action.payload.index]) {
        state.goods[action.payload.index].quantity = action.payload.quantity;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    updateDraftGoodPrice: (
      state,
      action: PayloadAction<{ index: number; price: number }>
    ) => {
      if (state.goods[action.payload.index]) {
        state.goods[action.payload.index].price = action.payload.price;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    updateDraftGoodStock: (
      state,
      action: PayloadAction<{ itemId: string; availableStock: number }>
    ) => {
      const good = state.goods.find((g) => g.itemId === action.payload.itemId);
      if (good) {
        good.availableStock = action.payload.availableStock;
      }
    },
    
    setDraftPaymentMethod: (
      state,
      action: PayloadAction<PaymentMethodOptions | "">
    ) => {
      state.paymentMethod = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    setDraftEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    
    clearDraftSales: (state) => {
      state.goods = [];
      state.paymentMethod = PaymentMethodOptions.cash;
      state.isEditing = false;
      state.lastUpdated = null;
    },
    
    syncDraftWithInventory: (
      state,
      action: PayloadAction<Array<{ itemId: string; availableStock: number }>>
    ) => {
      action.payload.forEach(({ itemId, availableStock }) => {
        const good = state.goods.find((g) => g.itemId === itemId);
        if (good) {
          good.availableStock = availableStock;
        }
      });
    },
  },
});

export const {
  addDraftGood,
  removeDraftGood,
  updateDraftGoodQuantity,
  updateDraftGoodPrice,
  updateDraftGoodStock,
  setDraftPaymentMethod,
  setDraftEditing,
  clearDraftSales,
  syncDraftWithInventory,
} = draftSalesSlice.actions;

export default draftSalesSlice.reducer;