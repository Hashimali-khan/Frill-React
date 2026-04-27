import { createSlice, createSelector } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],    // CartItem[]
    isOpen: false,
  },
  reducers: {
    openCart(state)  { state.isOpen = true  },
    closeCart(state) { state.isOpen = false },

    addItem(state, { payload }) {
      // payload: { product, quantity, selectedSize, selectedColor, designDataUrl? }
      const key = `${payload.product.id}-${payload.selectedSize}-${payload.selectedColor}`
      const existing = state.items.find(i => i.key === key)
      if (existing) {
        existing.quantity += payload.quantity
      } else {
        state.items.push({
          key,
          productId:     payload.product.id,
          name:          payload.product.name,
          slug:          payload.product.slug,
          img:           payload.product.img,
          price:         payload.product.price,
          selectedSize:  payload.selectedSize,
          selectedColor: payload.selectedColor,
          quantity:      payload.quantity,
          designDataUrl: payload.designDataUrl || null,
        })
      }
    },

    removeItem(state, { payload: key }) {
      state.items = state.items.filter(i => i.key !== key)
    },

    updateQuantity(state, { payload: { key, quantity } }) {
      const item = state.items.find(i => i.key === key)
      if (item) {
        if (quantity <= 0) state.items = state.items.filter(i => i.key !== key)
        else item.quantity = quantity
      }
    },

    clearCart(state) { state.items = [] },
  },
})

export const { openCart, closeCart, addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

/* ── Memoised Selectors (never recompute unless items change) ── */
export const selectCartItems = state => state.cart.items
export const selectCartOpen  = state => state.cart.isOpen

export const selectCartCount = createSelector(
  selectCartItems,
  items => items.reduce((sum, i) => sum + i.quantity, 0)
)

export const selectCartTotal = createSelector(
  selectCartItems,
  items => items.reduce((sum, i) => sum + i.price * i.quantity, 0)
)