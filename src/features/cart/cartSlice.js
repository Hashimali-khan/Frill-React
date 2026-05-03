import { createSlice, createSelector } from '@reduxjs/toolkit'

function getPrimaryProductImage(product) {
  const color = product?.colors?.[0]
  const view = color?.views?.[0]
  return view?.imageUrl || product?.img || product?.imgs?.[0] || ''
}

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
      // payload: { product, quantity, selectedSize, selectedColor, selectedView, mockupUrl, printUrl, designJson }
      const colorObj = payload.selectedColor && typeof payload.selectedColor === 'object'
        ? payload.selectedColor
        : null
      const colorHex = colorObj?.hex || payload.selectedColor || '#000000'
      const colorName = colorObj?.name || payload.selectedColorName || null
      const colorId = colorObj?.id || payload.selectedColorId || null
      const viewObj = payload.selectedView && typeof payload.selectedView === 'object'
        ? payload.selectedView
        : null
      const viewId = viewObj?.id || payload.selectedViewId || null
      const viewLabel = viewObj?.label || payload.selectedViewLabel || null

      const designKey = payload.designId || payload.printUrl || payload.mockupUrl || 'standard'
      const key = payload.key || `${payload.product.id}-${payload.selectedSize}-${colorId || colorHex}-${viewId || 'front'}-${designKey}`
      const existing = state.items.find(i => i.key === key)
      if (existing) {
        existing.quantity += payload.quantity
      } else {
        state.items.push({
          key,
          productId:     payload.product.id,
          name:          payload.product.name,
          slug:          payload.product.slug,
          img:           payload.mockupUrl || getPrimaryProductImage(payload.product),
          price:         payload.product.price,
          selectedSize:  payload.selectedSize,
          selectedColor: colorHex,
          selectedColorName: colorName,
          selectedColorId: colorId,
          selectedViewId: viewId,
          selectedViewLabel: viewLabel,
          quantity:      payload.quantity,
          mockupUrl:     payload.mockupUrl || null,
          printUrl:      payload.printUrl || null,
          designJson:    payload.designJson || null,
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