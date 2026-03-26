import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, updateQty } from './cartSlice';

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(s => s.cart.items);
  return { items, addItem: (i) => dispatch(addItem(i)), removeItem: (id) => dispatch(removeItem(id)), updateQty: (p) => dispatch(updateQty(p)) };
}
