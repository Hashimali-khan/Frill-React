import { createSlice } from '@reduxjs/toolkit';

const initialState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) { state.items.push(action.payload); },
    removeItem(state, action) { state.items = state.items.filter(i => i.id !== action.payload); },
    updateQty(state, action) {
      const it = state.items.find(i => i.id === action.payload.id);
      if (it) it.quantity = action.payload.quantity;
    }
  }
});

export const { addItem, removeItem, updateQty } = cartSlice.actions;
export default cartSlice.reducer;
