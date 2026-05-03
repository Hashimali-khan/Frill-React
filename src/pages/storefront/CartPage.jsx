import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import {
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '@/features/cart/cartSlice'
import { formatPKR } from '@/utils/currency'

export default function CartPage() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const total = useSelector(selectCartTotal)

  if (items.length === 0) {
    return (
      <div className="section-inner py-10 max-w-3xl">
        <div className="bg-white border border-brand-border rounded-frill-lg shadow-frill-sm p-8 text-center">
          <ShoppingBag size={44} className="mx-auto text-frill-300 mb-4" />
          <h1 className="font-head text-2xl font-black text-purple">Your cart is empty</h1>
          <p className="text-frill-600 mt-2">Add products from the store, then return here to review your cart.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/collections"
              className="inline-flex items-center justify-center bg-magenta text-white font-head text-sm font-bold tracking-wider uppercase px-6 py-3 rounded-frill hover:bg-magenta-hot transition-colors"
            >
              Browse Products
            </Link>
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center border border-brand-border font-head text-sm font-bold text-frill-600 px-6 py-3 rounded-frill hover:border-purple transition-colors"
            >
              Go to Checkout
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-inner py-6 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <section className="lg:col-span-8">
          <div className="bg-white border border-brand-border rounded-frill-lg shadow-frill-sm p-5 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-frill-400">Shopping Cart</p>
                <h1 className="font-head text-2xl md:text-3xl font-black text-purple">Review your items</h1>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-frill-400 text-sm font-medium">
                <ShoppingBag size={16} /> {count} item{count === 1 ? '' : 's'}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 pb-4 border-b border-brand-border last:border-b-0 last:pb-0">
                  <img src={item.mockupUrl || item.img} alt={item.name} className="w-20 h-24 rounded-frill object-cover bg-frill-100 shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-head font-bold text-purple text-base truncate">{item.name}</p>
                        <p className="text-[.72rem] text-frill-400 mt-1">
                          {item.selectedSize}
                          {item.selectedViewLabel ? ` · ${item.selectedViewLabel}` : ''}
                          <span className="ml-1">
                            {item.selectedColorName || item.selectedColor}
                            <span
                              className="inline-block w-3 h-3 rounded-full align-middle ml-1"
                              style={{ background: item.selectedColor }}
                            />
                          </span>
                        </p>
                        <p className="font-head font-bold text-purple text-sm mt-2">
                          {formatPKR(item.price * item.quantity)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => dispatch(removeItem(item.key))}
                        className="text-frill-400 hover:text-red-500 shrink-0"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
                        className="w-8 h-8 rounded border border-brand-border flex items-center justify-center hover:border-purple"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-head font-semibold text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
                        className="w-8 h-8 rounded border border-brand-border flex items-center justify-center hover:border-purple"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white border border-brand-border rounded-frill-lg shadow-frill-sm p-5 md:p-6">
            <h2 className="font-head text-lg font-black text-purple mb-5">Cart Summary</h2>

            <div className="flex justify-between items-center mb-2">
              <span className="font-head font-semibold text-frill-600">Subtotal</span>
              <span className="font-head font-black text-purple text-lg">{formatPKR(total)}</span>
            </div>

            <div className="flex justify-between items-center mb-4 text-sm text-frill-400">
              <span>Total items</span>
              <span>{count}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-magenta text-white font-head text-sm font-bold tracking-wider uppercase py-3 rounded-frill text-center hover:bg-magenta-hot transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/collections"
              className="block w-full mt-3 border border-brand-border font-head text-sm font-bold text-frill-600 py-3 rounded-frill text-center hover:border-purple transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}