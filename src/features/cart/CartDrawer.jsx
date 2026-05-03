import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { closeCart, removeItem, updateQuantity,
         selectCartItems, selectCartTotal, selectCartOpen } from './cartSlice'
import { formatPKR } from '@/utils/currency'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const items    = useSelector(selectCartItems)
  const total    = useSelector(selectCartTotal)
  const isOpen   = useSelector(selectCartOpen)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => dispatch(closeCart())} />
          <motion.aside
            initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
            transition={{ type:'spring', stiffness:280, damping:28 }}
            className="fixed right-0 top-0 h-full w-95 max-w-full bg-white z-50 flex flex-col shadow-frill-xl">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-purple" />
                <span className="font-head font-bold text-purple">Your Cart</span>
                <span className="bg-magenta text-white text-[.6rem] font-bold px-1.5 py-0.5 rounded-full">
                  {items.reduce((s,i) => s+i.quantity, 0)}
                </span>
              </div>
              <button onClick={() => dispatch(closeCart())} className="text-frill-400 hover:text-purple">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {items.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-frill-400">
                  <ShoppingBag size={40} className="mb-3 opacity-30" />
                  <p className="font-head font-semibold">Your cart is empty</p>
                </div>
              )}
              {items.map(item => (
                <div key={item.key} className="flex gap-3 pb-4 border-b border-brand-border">
                  <img src={item.mockupUrl || item.img} alt={item.name} className="w-16 h-16 rounded-frill object-cover bg-frill-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-head font-bold text-purple text-sm truncate">{item.name}</p>
                    <p className="text-[.72rem] text-frill-400">
                      {item.selectedSize}
                      {item.selectedViewLabel ? ` · ${item.selectedViewLabel}` : ''}
                      <span className="ml-1">
                        {item.selectedColorName || item.selectedColor}
                        <span style={{ background: item.selectedColor }} className="inline-block w-3 h-3 rounded-full align-middle ml-1" />
                      </span>
                    </p>
                    <p className="font-head font-bold text-purple text-sm mt-1">{formatPKR(item.price * item.quantity)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => dispatch(updateQuantity({ key:item.key, quantity:item.quantity-1 }))} className="w-6 h-6 rounded border border-brand-border flex items-center justify-center hover:border-purple"><Minus size={10} /></button>
                      <span className="font-head font-semibold text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ key:item.key, quantity:item.quantity+1 }))} className="w-6 h-6 rounded border border-brand-border flex items-center justify-center hover:border-purple"><Plus size={10} /></button>
                      <button onClick={() => dispatch(removeItem(item.key))} className="ml-auto text-frill-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-brand-border">
                <div className="flex justify-between mb-4">
                  <span className="font-head font-semibold text-frill-600">Subtotal</span>
                  <span className="font-head font-black text-purple text-lg">{formatPKR(total)}</span>
                </div>
                <Link to="/checkout" onClick={() => dispatch(closeCart())}
                  className="block w-full bg-magenta text-white font-head text-sm font-bold
                              tracking-wider uppercase py-3 rounded-frill text-center
                              hover:bg-magenta-hot transition-colors">
                  Checkout · {formatPKR(total)}
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
