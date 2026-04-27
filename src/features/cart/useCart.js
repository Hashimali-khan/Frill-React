import { useSelector, useDispatch } from 'react-redux'
import { addItem, removeItem, updateQuantity, openCart, closeCart, selectCartOpen } from './cartSlice'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector((s) => s.cart.items)
  const isOpen = useSelector(selectCartOpen)

  return {
    items,
    isOpen,
    addItem: (payload) => dispatch(addItem(payload)),
    removeItem: (key) => dispatch(removeItem(key)),
    updateQuantity: (payload) => dispatch(updateQuantity(payload)),
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
  }
}
