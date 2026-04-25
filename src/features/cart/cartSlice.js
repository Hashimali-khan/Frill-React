import { createSlice } from '@reduxjs/toolkit';

const initialState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      state.items.push(action.payload);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQty(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
  },
});

export const { addItem, removeItem, updateQty } = cartSlice.actions;

export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + (item.quantity ?? 1), 0);

export default cartSlice.reducer;